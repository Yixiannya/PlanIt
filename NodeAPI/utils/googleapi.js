// google.js
const { google } = require('googleapis');

function createOAuth2Client() {
    return new google.auth.OAuth2(
        process.env.SHANE_WEB_CLIENT_ID,       
        process.env.SHANE_WEB_CLIENT_SECRET,
    );
};

module.exports = { createOAuth2Client };