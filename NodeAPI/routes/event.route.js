const express = require('express');
const Event = require('../models/event.model.js');
const router = express.Router();
const {getAllEvents, getSpecificEvent, getSpecificEventOwner, postEvent, putEvent, patchEvent, deleteEvent} = require('../controllers/event.controller.js');

// Get all events
router.get('/', getAllEvents);
// Get event by id
router.get('/:id', getSpecificEvent);

// Get specific event owner by event id
router.get('/:id/owner', getSpecificEventOwner);

// Create event
router.post('/', postEvent);

// Update event by id
router.put('/:id', putEvent);

// Update event by id (Patch)
router.patch('/:id', patchEvent);

// Delete event by id
router.delete('/:id', deleteEvent);


module.exports = router;