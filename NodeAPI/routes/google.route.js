const express = require('express');
const router = express.Router();
const { importEvents } = require('../controllers/google.controller.js');

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'openid',
    'email',
    'profile'
];

// Route to get consent screen URL
//router.get('/auth/google', consent);

// Import Google Calendar events to app
router.post('/calendar/import', importEvents);

module.exports = router;
