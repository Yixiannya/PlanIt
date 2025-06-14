// Code containing the routes used for groups
const express = require('express');
const router = express.Router();
const { getAllGroups, getGroupById, getGroupAdmins, getGroupMembers, getGroupEvents, postGroup,
    putGroup, patchGroup, deleteGroup } = require('../controllers/group.controller.js');

router.get('/', getAllGroups);
// Get event by id
router.get('/:id', getGroupById);

// Get specific event admins by event id
router.get('/:id/admins', getGroupAdmins);

router.get('/:id/members', getGroupMembers);

router.get('/:id/events', getGroupEvents);

// Create event
router.post('/', postGroup);

// Update event by id
router.put('/:id', putGroup);

// Update event by id (Patch)
router.patch('/:id', patchGroup);

// Delete event by id
router.delete('/:id', deleteGroup);


module.exports = router;