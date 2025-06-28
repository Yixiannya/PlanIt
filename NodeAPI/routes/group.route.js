// Code containing the routes used for groups
const express = require('express');
const router = express.Router();
const { getAllGroups, getGroupById, getGroupAdmins, getGroupMembers, promoteGroupMember,
    addGroupMember, deleteGroupMember, demoteGroupAdmin, addGroupAdmin, deleteGroupAdmin, getGroupEvents, postGroup, putGroup, 
    patchGroup, deleteGroup } = require('../controllers/group.controller.js');

router.get('/', getAllGroups);

// Get event by id
router.get('/:id', getGroupById);

router.get('/:id/events', getGroupEvents);

// Create event
router.post('/', postGroup);

// Update event by id
router.put('/:id', putGroup);

// Update event by id (Patch)
router.patch('/:id', patchGroup);

// Members related routes
router.get('/:id/members', getGroupMembers);
router.post('/:id/members/promote', promoteGroupMember);
router.post('/:id/members/add', addGroupMember);
router.post('/:id/members/delete', deleteGroupMember);

// Admins related routes
router.get('/:id/admins', getGroupAdmins);
router.post('/:id/admins/demote', demoteGroupAdmin);
router.post('/:id/admins/add', addGroupAdmin);
router.post('/:id/admins/delete', deleteGroupAdmin);

// Delete event by id
router.delete('/:id', deleteGroup);


module.exports = router;