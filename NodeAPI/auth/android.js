// Code to handle the verification of token received.
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

module.exports = async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    // Accepted Client IDs, from the web test client in passport and the android client
    audience: [
      process.env.SHANE_WEB_CLIENT_ID,
      process.env.SHANE_ANDROID_CLIENT_ID,
      process.env.SHANE_IOS_CLIENT_ID,
      process.env.GOOGLE_CLIENT_ID
    ]
  });

  const payload = ticket.getPayload();
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
  };
};