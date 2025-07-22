const { google } = require('googleapis');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');

const { createOAuth2Client } = require('../utils/googleapi.js');
const { scheduleEventNotification, cancelEventNotification } = require('./notif.controller.js');

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'openid',
    'email',
    'profile'
];

/*
const consent = (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(url);
};

const redirect = async (req, res) => {
  const code = req.query.code;

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Store tokens in DB if needed
  res.send('Google Calendar connected');
};
*/

async function syncEventToCalendar(user, event) {
    console.log("Syncing event");
    const members = event.members;
    const googleEventMembers = [];
    
    
    for (let i = 0; i < members.length; i++) {
        const member = await User.findById(members[i]);
        const eventMember = { displayName: member.name, email: member.email };
        googleEventMembers.push(eventMember);
    }
    console.log("Members added");

    // Hardcoding timezone adjustment (Will need to do something else if we want to account for local time
    // all over the world)
    const adjustedDueDate = event.dueDate.toISOString().slice(0, 19) + "+08:00";
    const adjustedEndDate = event.endDate.toISOString().slice(0, 19) + "+08:00";
    const googleEvent = {
        summary: event.name,
        description: event.description,
        start: { dateTime: adjustedDueDate, timeZone: "Asia/Singapore" },
        end: { dateTime: adjustedEndDate, timeZone: "Asia/Singapore" },
        attendees: googleEventMembers,
        location: event.venue
    };
    console.log("Google Calendar event created");
    console.log(googleEvent);

    if (!user || !user.google) {
        throw new Error("User not connected to Google");
    }

    const oAuth2Client = createOAuth2Client();
    oAuth2Client.setCredentials({
        access_token: user.google.accessToken,
        refresh_token: user.google.refreshToken,
        expiry_date: user.google.expiryDate
    });
    console.log("oAuth2Client initialised");
    try {
        await oAuth2Client.getAccessToken();
        console.log("Tokens get");
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    if (event.googleId) {
        // Event is already on Google Calendar, update it instead
        const existingEvent = await calendar.events.get({
            calendarId: "primary",
            eventId: event.googleId
        });

        const updatedEvent = {
            ...existingEvent.data,
            summary: googleEvent.summary,
            description: googleEvent.description,
            start: googleEvent.start,
            end: googleEvent.end,
            attendees: googleEvent.attendees,
            location: googleEvent.location
        };
        console.log("Updated payload created");
        
        await calendar.events.update({
            calendarId: "primary",
            eventId: event.googleId,
            resource: updatedEvent
        });
        console.log("Google Calendar updated");
    } else {
        // Event not on Google Calendar, insert it
        const result = await calendar.events.insert({
            calendarId: "primary",
            resource: googleEvent
        });
        console.log("Insertion successful");

        event.googleId = result.data.id;
        await event.save();
    }
    console.log("Event synced");
    await scheduleEventNotification(user, event);
    console.log("Event notif created");
};

async function deleteEventFromCalendar(user, event) {
    const oAuth2Client = createOAuth2Client();
    oAuth2Client.setCredentials({
        access_token: user.google.accessToken,
        refresh_token: user.google.refreshToken,
        expiry_date: user.google.expiryDate
    });
    console.log("oAuth2Client initialised");

    try {
        await oAuth2Client.getAccessToken();
        console.log("Tokens get");
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    if (!event.googleId) {
        console.warn("Event '%s' has no googleId, terminating sync", event.name);
        return;
    }

    try {
        await calendar.events.delete({
            calendarId: "primary",
            eventId: event.googleId
        });
        console.log("Event '%s' removed from %s's Google Calendar", event.name, user.name);
        await cancelEventNotification(event);
    } catch (error) {
        if (error.code === 410) {
            // Catches error if deleting an event that has already been deleted
            console.warn("Event '%s' is already deleted from Google Calendar", event.name);
        } else {
            console.error("Failed to delete event:", error.response?.data || error.message);
            // Rethrow other errors
            throw error; 
        }
    } 
};

async function importEventToUser(user, googleEvent) {
    await user.populate('events');

    const eventExists = user.events.some(event => event.googleId === googleEvent.id);

    const startDate = googleEvent.start.dateTime || googleEvent.start.date;
    const endDate = googleEvent.end.dateTime || googleEvent.end.date;

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    const adjustedStartDate = new Date(newStartDate.getTime() + (8 * 60 * 60 * 1000));
    const adjustedEndDate = new Date(newEndDate.getTime() + (8 * 60 * 60 * 1000));

    if (eventExists) {
        const event = await Event.findOneAndUpdate({ googleId: googleEvent.id },
            {
                name: googleEvent.summary || "No title given",
                description: googleEvent.description,
                owner: user,
                dueDate: new Date(adjustedStartDate),
                endDate: new Date(adjustedEndDate),
                venue: googleEvent.location
            }
        );
        console.log("Event '%s' exists, overriding PlanIt event", event.name);
        await cancelEventNotification(event);
        await scheduleEventNotification(user, event);
        return;
    }

    const event = await Event.create({
        googleId: googleEvent.id,
        name: googleEvent.summary || "No title given",
        description: googleEvent.description,
        owner: user,
        dueDate: new Date(adjustedStartDate),
        endDate: new Date(adjustedEndDate),
        venue: googleEvent.location
    });
    console.log("Event created:", event);

    await scheduleEventNotification(user, event);
    await user.events.push(event._id);
    console.log("Event '%s' imported", event.name);
}

const importEvents = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Initialising oAuth2Client for query
        const oAuth2Client = createOAuth2Client();

        oAuth2Client.setCredentials({
            access_token: user.google.accessToken,
            refresh_token: user.google.refreshToken,
            expiry_date: user.google.expiryDate
        });
        console.log("oAuth2Client initialised");

        try {
            await oAuth2Client.getAccessToken();
            console.log("Tokens get");
        } catch (error) {
            console.error(error.response?.data || error.message);
            throw error;
        }

        const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

        const response = await calendar.events.list({
            calendarId: "primary",
            singleEvents: true,
            orderBy: "startTime",
            maxResults: 100, // Limit in case we got a user with too many dates to handle at one time
            timeMin: new Date().toISOString() // Only upcoming dates from current time
        });
        console.log("Google Calendar Events found");

        const eventsList = response.data.items;
        const promises = [];
        eventsList.forEach(event => promises.push(importEventToUser(user, event)));

        await Promise.all(promises);
        await user.save();
        res.status(200).json({ message: "First 100 upcoming events imported successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    syncEventToCalendar,
    deleteEventFromCalendar,
    importEvents
}