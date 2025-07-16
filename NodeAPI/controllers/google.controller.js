const { google } = require('googleapis');
const { oAuth2Client } = require('../utils/googleapi.js');

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
    const googleEvent = {
        summary: event.name,
        description: event.description,
        start: { dateTime: event.dueDate, timeZone: "Asia/Singapore" },
        end: { dateTime: event.endDate, timeZone: "Asia/Singapore" },
        attendees: googleEventMembers
    };
    console.log("Google Calendar created");

    if (!user || !user.google) {
        return res.status(404).json({ message: "User not connected to Google" });
    }

    console.log("Initialising oAuth2Client for query");
    const oAuth2Client = await oAuth2Client({
        access_token: user.google.accessToken,
        refresh_token: user.google.refreshToken,
        expiry_date: user.google.expiryDate
    });
    console.log("oAuth2Client initialised");

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    console.log("Inserting into Google Calendar");
    const result = await calendar.events.insert({
        auth: auth,
        calendarId: "primary",
        resource: googleEvent
    });

    console.log("Event synced at %s", result.data.htmlLink);
};

module.exports = {
    syncEventToCalendar
}