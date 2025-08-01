// Code containing the routes used for mods
// Base route is /api/mods
const express = require('express');
const router = express.Router();
const {getAllMods, getModById, getModUsers, getModClasses, getAllUserClasses, getUserModClasses, 
    updateStatus, postMod, putMod, patchMod, deleteMod, deleteClass, leaveMod, leaveClass
} = require('../controllers/mod.controller.js');

router.get('/', getAllMods);

// Get mod by id
router.get('/:id', getModById);

router.get('/:id/users', getModUsers);
router.get('/:id/classes', getModClasses);
router.post('/classes', getAllUserClasses);
router.post('/:id/classes', getUserModClasses);

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
router.post('/:id/class/leave', leaveClass);

router.post('/:id/update', updateStatus);


module.exports = router;