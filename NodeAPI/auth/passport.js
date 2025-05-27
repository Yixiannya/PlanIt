const dotenv = require('dotenv');
dotenv.config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user.model.js');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

console.log(CLIENT_ID);
console.log(CLIENT_SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: `${CLIENT_ID}`,
      clientSecret: `${CLIENT_SECRET}`,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Code to handle user authentication and retrieval
      // const user = await User.findOne({ googleId: profile.id })  
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  // Code to serialize user data
  done(null, user);
});

passport.deserializeUser((id, done) => {
  // Code to deserialize user data
  done(null, user);
});