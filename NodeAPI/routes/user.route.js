// Code containing the routes used for users
const express = require('express');
const router = express.Router();
const {getAllUsers, getUserById, getUserEvents, postUser, putUser, patchUser, deleteUser} = require('../controllers/user.controller.js');

// Get all users
router.get('/', getAllUsers);

// Get user by id
router.get('/:id', getUserById);

// Get all events the user has
router.get('/:id/events', getUserEvents);

// Create user
router.post('/', postUser);

// Update user by id
router.put('/:id', putUser);

// Update user by id (Patch)
router.patch('/:id', patchUser);

// Delete user by id
router.delete('/:id', deleteUser);


module.exports = router;