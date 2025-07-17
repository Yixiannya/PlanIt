// Code containing the routes used for mods
// Base route is /api/mods
const express = require('express');
const router = express.Router();
const {getAllMods, getModById, getModUsers, getModClasses, updateStatus,
    postMod, putMod, patchMod, deleteMod, deleteClass, leaveMod, leaveClass
} = require('../controllers/mod.controller.js');

router.get('/', getAllMods);

// Get mod by id
router.get('/:id', getModById);

router.get('/:id/users', getModUsers);
router.get('/:id/classes', getModClasses);

// Create mod
router.post('/', postMod);

// Update mod by id
router.put('/:id', putMod);

// Update mod by id (Patch)
router.patch('/:id', patchMod);

// Delete mod by id
router.delete('/:id', deleteMod);
router.post('/:id/class/delete', deleteClass);

// Leave routes
router.post('/:id/leave', leaveMod);
router.post('/:id/leave/class', leaveClass);

router.post('/:id/update', updateStatus);


module.exports = router;