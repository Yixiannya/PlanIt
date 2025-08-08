// Code containing the routes used in authentication
const express = require('express');
const router = express.Router();
const {initiateAndroidAuth, getProfileInfo, logout} = require('../controllers/auth.controller.js');


// Android Google Oauth 2.0
router.post('/auth/google', initiateAndroidAuth);

// How profile page works for passportjs
router.get('/profile', getProfileInfo);

// Logout route
router.get('/logout', logout);

module.exports = router;