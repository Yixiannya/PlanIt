const express = require('express');
const passport = require('passport');
const router = express.Router();

// Renders login screen
router.get('/login', function(req, res, next) {
  res.render('login');
});

// Initiates the Google OAuth 2.0 authentication flow
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL for handling the OAuth 2.0 response
router.get('/auth/google/callback', passport.authenticate('google', { 
  failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, redirect or handle the user as desired
  res.redirect('/profile');
});

router.get('/profile', (req, res) => {
  console.log(req.user);
  res.send(`<pre>${JSON.stringify(req.user, null, 2)}</pre>`);
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;