// Code containing the routes used in authentication
const express = require('express');
const router = express.Router();
const {login, initiatePasswordAuth, initiateAndroidAuth, getProfileInfo, logout} = require('../controllers/auth.controller.js');

// Renders login screen
router.get('/login', login);

// Basic authentication
router.post('/login', initiatePasswordAuth);

// Android Google Oauth 2.0
router.post('/auth/google', initiateAndroidAuth);

// How profile page works for passportjs
router.get('/profile', getProfileInfo);

// Logout route
router.get('/logout', logout);

module.exports = router;