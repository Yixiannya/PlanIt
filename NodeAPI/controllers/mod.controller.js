const Mod = require('../models/mod.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');

const getAllMods = async (req, res) => {
    try {
        const mods = await Mod.find({});
        res.status(200).json(mods);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getModById = async (req, res) => {
    try {
        const {id} = req.params;
        const mod = await Mod.findById(id);

        if (!mod) {
            return res.status(404).json({message: "Mod not found"});
        }
        
        res.status(200).json(mod);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const postMod = async (req, res) => {
    try {
        const mod = await Mod.create(req.body);

        res.status(200).json(mod);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const putMod = async (req, res) => {
    try {
        const {id} = req.params;
        const mod = await Mod.findByIdAndUpdate(id, req.body);
        
        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({message: "Mod not found"});
        }

        // Check mod again
        const updatedMod = await Mod.findById(id);
        res.status(200).json(updatedMod);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to patch a mod
const patchMod = async (req, res) => {
    try {
        const updateObject = req.body; // e.g. {name: "John", group: "Doe"}
        const {id} = req.params;
        const mod = await Mod.findByIdAndUpdate(id, {$set: updateObject});
        
        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({message: "Mod not found"});
        }

        // Check mod again
        const updatedMod = await Mod.findById(id);
        res.status(200).json(updatedMod);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to delete a mod
const deleteMod = async (req, res) => {
    try {
        const {id} = req.params;
        const mod = await Mod.findByIdAndDelete(id, req.body);
        
        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({message: "Mod not found"});
        }

        const events = await mod.events;

        // Loop through events array and delete every event.
        // In the future we have to check if any other member is involved in the event as well.

        res.status(200).json({message: "Mod deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllMods, 
    getModById,
    postMod,
    putMod,
    patchMod,
    deleteMod
}