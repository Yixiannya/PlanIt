const User = require('../models/user.model.js');
const passport = require('passport');

// Controls for authentication
const initiateAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const callbackAuth = passport.authenticate('google', { failureRedirect: '/login' });

const successAuth = (req, res) => {
  // Successful authentication, redirect or handle the user as desired
  res.redirect('/');
};

const logoutAuth = (req, res) => {
  req.logout();
  res.redirect('/');
};

module.exports = {
    initiateAuth,
    callbackAuth,
    successAuth,
    logoutAuth
}