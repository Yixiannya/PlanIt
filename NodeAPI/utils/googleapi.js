// google.js
const { google } = require('googleapis');

function createOAuth2Client() {
    return new google.auth.OAuth2(
        process.env.SHANE_WEB_CLIENT_ID,       
        process.env.SHANE_WEB_CLIENT_SECRET,
    );
};

async function generateTokens(authCode) {
    const data = {
        code: authCode,
        client_id: process.env.SHANE_WEB_CLIENT_ID,
        client_secret: process.env.SHANE_WEB_CLIENT_SECRET,
        redirect_uri: '',
        grant_type: 'authorization_code',
    };


    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Token exchange error:', errorData);
        throw new Error(`Google token exchange failed: ${errorData.error}`);
    }

    const tokenData = await response.json();
    return tokenData;

}

module.exports = { createOAuth2Client, generateTokens };