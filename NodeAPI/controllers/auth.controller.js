// Code containing all methods used in authentication routes
const axios = require('axios');

const User = require('../models/user.model.js');

const {verifyGoogleToken} = require('../utils/verifyGoogleToken.js');
const {createJWT} = require('../utils/createJWT.js');
const { createOAuth2Client, generateTokens } = require('../utils/googleapi.js');

// Android Oauth method
const initiateAndroidAuth = async (req, res) => {
  try {
    console.log("Received token");
    const { idToken, accessToken, serverAuth } = req.body;
    const oAuth2Client = createOAuth2Client();
    
    if (!idToken) {
      console.log("No idToken received");
      return res.status(400).json({ error: 'ID token required' });
    }
    if (!accessToken) {
      console.log("No accessToken received");
      return res.status(400).json({ error: 'Access token required' });
    }
    if (!serverAuth) {
      console.log("No serverAuth received");
    } else {
      console.log("serverAuth: %s", serverAuth);
    }

    console.log("idToken: %s", idToken);
    console.log("accessToken: %s", accessToken);
    

    console.log("Verify token function");
    const googleUser = await verifyGoogleToken(idToken);

    if (!googleUser.googleId) {
      throw new Error("No googleId found");
    }
    var tokens;
    var expiryMs;
    console.log("Creating access and refresh tokens");
    if (serverAuth) {
      tokens = await generateTokens(serverAuth);
      console.log("Tokens received %s", tokens);
      console.log("Access token: %s", tokens.access_token);
      console.log("Refresh token: %s", tokens.refresh_token);

      const expiry_date = Date.now() + tokens.expires_in * 1000;
      expiryMs = new Date(expiry_date).getTime();
    }
    console.log("Finding user");
    let user = await User.findOne({ 'google.googleId': googleUser.googleId });

    if (!user) {
      console.log("No such user found, creating new user");
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        google: {
          googleId: googleUser.googleId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiryDate: expiryMs
        }
      });

      console.log("User created");
      await user.save();
    } else if (tokens) {
      user.google.accessToken = tokens.access_token;
      user.google.refreshToken = tokens.refresh_token;
      user.google.expiryDate = expiryMs;
      await user.save();
      console.log("Updated user tokens");
    }

    console.log("User found, creating JWT");
    const token = createJWT(user);

    console.log("Responding with JWT and user");
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const getProfileInfo = async (req, res) => {
  // User doesn't exist, go back to main page
  if (!req.user) {
    res.redirect('/');
  }
  // User exists, send user info
  res.send(req.user);
};

const logout = async (req, res) => {
  req.logout(function(err){
      
    if(err) {
      next(err);
    }

    res.redirect('/');
  });
};

module.exports = {
  initiateAndroidAuth,
  getProfileInfo,
  logout
}