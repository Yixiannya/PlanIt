const Mod = require('../models/mod.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');

// Find a way to track first monday of every August, that's when Sem 1 starts
// Keep track of users?

const SEM_START = "2026-08-04";

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

const getModUsers = async (req, res) => {
    try {
        const {id} = req.params;
        const users = await Group.findById(id, '-_id userId').populate('userId');

        // If group doesn't exist
        if (!users) {
            return res.status(404).json({message: "Mod not found"});
        }
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const postMod = async (req, res) => {
    try {
        const user = req.body.userId;

        // Check for duplicates and add user into it
        let mod = await Mod.findOne({ 
                moduleCode: req.body.moduleCode, 
                year: req.body.year, 
                semester: req.body.semester
            }  
        );

        if (!mod) {
            console.log("Creating new mod");
            mod = await Mod.create(req.body);
            await mod.save();
        } else if (!mod.userId.includes(user)) {
            // User isn't in mod so update both user and mod to contain this user
            console.log("Adding user %s into mod", user);
            mod.userId.push(user);
            await mod.save();
        }

        // Update users' mods array
        const userObject = await User.findByIdAndUpdate(
            user,
            { $push: { mods: mod } }
        );
                    
        // If user doesn't exist
        if (!userObject) {
            console.log("User not found or no user given");
        }
        
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

        const userIds = mod.userId;

        for (let i = 0; i < userIds.length; i++) {
            const user = await User.findByIdAndUpdate(
                userIds[i],
                { $pull: { mods: id } }
            );
            
            // If member doesn't exist
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }
        }

        res.status(200).json({message: "Mod deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const mod = await Mod.findByIdAndUpdate(id, { isComplete: true })

        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({message: "Mod not found"});
        }

        // Find a way to create events based on given class, year, sem
        // Use a temp event/mod for start of Sem 1, and refer to that mod for creation of future mods/events
        const yearStart = new Date(mod.year, 0, 1);
        const yearEnd = new Date(mod.year, 11, 31, 23, 59, 59);
        
        const ayStartRRule = await Event.findById("68667030a93852c53e910021").rRule;
        const ayStart = rrulestr(ayStartRRule.rRule).between(yearStart, yearEnd);

        console.log(ayStart);

        var semStart = ayStart;

        switch (mod.semester) {
            case 1:
                console.log(semStart);
                break;
            case 2:
                semStart.setDate(semStart.getDate() + (23 * 7)); 
                console.log(semStart);
                break;
            default:
                console.log(semStart);
                break;
        }



        res.status(200).json();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllMods, 
    getModById,
    getModUsers,
    postMod,
    putMod,
    patchMod,
    deleteMod,
    updateStatus
}