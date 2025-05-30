const express = require('express');
const passport = require('passport');
const User = require('../models/user.model.js');
const router = express.Router();

// Renders login screen
router.get('/login', function(req, res, next) {
  res.render('login');
});


// Web Google Oauth 2.0
// Initiates the Google OAuth 2.0 authentication flow
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL for handling the OAuth 2.0 response
router.get('/auth/google/callback', passport.authenticate('google', { 
  failureRedirect: '/' }), 
  // Successful authentication, redirect to profile page

  /* (req, res) => {
    res.redirect('/profile');
  } */

    // How about directly returning the user as a JSON?
    (req, res) => {
      res.json({
        message: 'Login successful',
        user: req.user
      })
    }

  // Shane's suggestion
  /* (req, res) => {
    res.redirect('myapp://login-success');
  } */
);


// Android Google Oauth 2.0
// Frontend should have an implementation of Google sign in?,
// then it will be posting a request to /auth/google, with the id token.
// If all goes well, it should return a user with the associated GoogleId.
// If no such user exists, it will create a new user with the given GoogleId.
router.post('/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token required' });
    }

    const googleUser = await verifyGoogleToken(idToken);

    let user = await User.findOne({ googleId: googleUser.googleId });

    // User doesn't exist, so we create one
    if (!user) {
      user = await User.create({
        googleId: googleUser.googleId,
        name: googleUser.name,
        email: googleUser.email,
      });
    }

    // Do we need to create JWT?
    const token = createJWT(user);
    res.json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Basic authentication
// Sort and Hash for basic String password
// Or just directly store it -> will be directly storing it for now.
router.post('/login', async (req, res) => {
  try {
    const requestedEmail = req.body.email;
    const requestedPassword = req.body.password;
    
    const user = await User.findOne({ email: requestedEmail });

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    if (requestedPassword != user.password) {
      return res.status(401).json({message: "Incorrect password"});
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// How profile page works for passportjs
router.get('/profile', (req, res) => {
  // User doesn't exist, go back to main page
  if (!req.user) {
    res.redirect('/');
  }
  // User exists, send user info
  res.send(req.user);
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(function(err){
      if(err) return next(err);
      res.redirect('/');
    });
});

module.exports = router;