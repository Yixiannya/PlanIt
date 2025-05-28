const dotenv = require('dotenv');
dotenv.config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user.model.js');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: `${GOOGLE_CLIENT_ID}`,
      clientSecret: `${GOOGLE_CLIENT_SECRET}`,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Code to handle user authentication and retrieval
      try {
        // Checks if user exists
        let user = await User.findOne({ googleId: profile.id });

        // User doesn't exist so we create one
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value
          })
        }

        // User exists or is created, so we return
        return done(null, user);

      } catch (err) {
        // Return the error
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // Code to serialize user data, we serialize the User id
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // Code to deserialize user data by searching database according to id
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});