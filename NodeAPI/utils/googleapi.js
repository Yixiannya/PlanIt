// google.js
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,       
    process.env.GOOGLE_CLIENT_SECRET,   
    process.env.GOOGLE_REDIRECT_URI     // http://localhost:3000/oauth2callback
);

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

module.exports = { oAuth2Client, calendar };