const { google } = require('googleapis');
const { createOAuth2Client } = require('../utils/googleapi.js');

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

    console.log("Creating Google Calendar event");

    // Hardcoding timezone adjustment (Will need to do something else if we want to account for local time
    // all over the world)
    const adjustedDueDate = event.dueDate.toISOString().slice(0, 19) + "+08:00";
    const adjustedEndDate = event.endDate.toISOString().slice(0, 19) + "+08:00";
    const googleEvent = {
        summary: event.name,
        description: event.description,
        start: { dateTime: adjustedDueDate, timeZone: "Asia/Singapore" },
        end: { dateTime: adjustedEndDate, timeZone: "Asia/Singapore" },
        attendees: googleEventMembers
    };
    console.log("Google Calendar event created");

    if (!user || !user.google) {
        return res.status(404).json({ message: "User not connected to Google" });
    }

    console.log("Initialising oAuth2Client for query");
    const oAuth2Client = createOAuth2Client();

    oAuth2Client.setCredentials({
        access_token: user.google.accessToken,
        refresh_token: user.google.refreshToken,
        expiry_date: user.google.expiryDate
    });
    console.log("oAuth2Client initialised");

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    console.log("Inserting into Google Calendar");
    const result = await calendar.events.insert({
        calendarId: "primary",
        resource: googleEvent
    });
    console.log("Insertion successful");

    event.googleId = result.data.id;
    await event.save();
    console.log("Event synced at %s", result.data.htmlLink);
};

async function deleteEventFromCalendar(user, event) {
    console.log("Initialising oAuth2Client for query");
    const oAuth2Client = createOAuth2Client();

    oAuth2Client.setCredentials({
        access_token: user.google.accessToken,
        refresh_token: user.google.refreshToken,
        expiry_date: user.google.expiryDate
    });
    console.log("oAuth2Client initialised");

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    await calendar.events.delete({
        calendarId: "primary",
        eventId: event.googleId
    });

    console.log("Event '%s' removed from %s's Google Calendar", event.name, user.name);
};

module.exports = {
    syncEventToCalendar,
    deleteEventFromCalendar
}