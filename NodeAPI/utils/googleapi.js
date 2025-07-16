// google.js
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.SHANE_WEB_CLIENT_ID,       
    process.env.SHANE_WEB_CLIENT_SECRET,
);

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

module.exports = { oAuth2Client, calendar };