// Code containing the routes used for events
const express = require('express');
const router = express.Router();
const {
    getAllEvents, getEventById, getEventOwner, getEventDates, 
    postEvent, putEvent, patchEvent, deleteEvent, deleteAllEvents
} = require('../controllers/event.controller.js');

router.get('/', getAllEvents);

// Get event by id
router.get('/:id', getEventById);

// Get specific event owner by event id
router.get('/:id/owner', getEventOwner);

router.get('/:id/dates', getEventDates);

// Create event
router.post('/', postEvent);

// Update event by id
router.put('/:id', putEvent);

// Update event by id (Patch)
router.patch('/:id', patchEvent);

// Delete event by id
router.delete('/:id', deleteEvent);



// Delete all events for debugging [DO NOT USE ON FRONTEND]
router.delete('/', deleteAllEvents);

module.exports = router;