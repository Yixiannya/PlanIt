// Code containing the routes used for mods
// Base route is /api/mods
const express = require('express');
const router = express.Router();
const {getAllMods, getModById, postMod, putMod, patchMod, deleteMod} = require('../controllers/mod.controller.js');

router.get('/', getAllMods);

// Get mod by id
router.get('/:id', getModById);

// Create mod
router.post('/', postMod);

// Update mod by id
router.put('/:id', putMod);

// Update mod by id (Patch)
router.patch('/:id', patchMod);

// Delete mod by id
router.delete('/:id', deleteMod);

router.post('/:id', createEvents);


module.exports = router;