const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

module.exports = async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: [
      process.env.GOOGLE_ANDROID_CLIENT_ID,
      process.env.GOOGLE_CLIENT_ID
    ]
  });

  const payload = ticket.getPayload();
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture
  };
};