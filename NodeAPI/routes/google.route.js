const express = require('express');
const router = express.Router();
const { consent, redirect } = require('../controllers/auth.controller.js');

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'openid',
    'email',
    'profile'
];

// Route to get consent screen URL
//router.get('/auth/google', consent);

// Redirect URI handler
//router.get('/oauth2callback', redirect);

module.exports = router;
