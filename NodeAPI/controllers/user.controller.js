// Code containing all methods used in user routes
const User = require('../models/user.model.js');
const Event = require('../models/event.model.js');

const { deleteEventFunc } = require('./event.controller.js');

// Controls to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to get a specific user by id
const getUserById = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);

        // If user doesn't exist
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Get all events a user has
const getUserEvents = async (req, res) => {
    try {
        const { id } = req.params;
        const userEvents = await User.findById(id, '-_id events').populate('events');

        // If user doesn't exist
        if (!userEvents) {
            return res.status(404).json({message: "User not found"});
        }
        
        res.status(200).json(userEvents);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Get all events a user has
const getUserGroups = async (req, res) => {
    try {
        const { id } = req.params;
        const userGroups = await User.findById(id, '-_id groups').populate('groups');

        // If user doesn't exist
        if (!userGroups) {
            return res.status(404).json({message: "User not found"});
        }
        
        res.status(200).json(userGroups);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUserMods = async (req, res) => {
    try {
        const { id } = req.params;
        const userMods = await User.findById(id, '-_id mods').populate('mods');

        // If user doesn't exist
        if (!userMods) {
            return res.status(404).json({message: "User not found"});
        }
        
        res.status(200).json(userMods);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// Controls to create a user
const postUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        console.log("User %s created", user.name);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to update a user
const putUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        
        // If user doesn't exist
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Check user again
        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to patch a user
const patchUser = async (req, res) => {
    try {
        const updateObject = req.body; // e.g. {name: "John", group: "Doe"}
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, {$set: updateObject});
        
        // If user doesn't exist
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Check user again
        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to delete a user
const deleteUser = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const userId = id;
        const user = await User.findById(id, req.body).populate('events');

        console.log("Initiating deletion of user %s", user.name);
        
        // If user doesn't exist
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Loops through events array and delete every event where user is owner.
        const promises = [];

        console.log("Deleting user's events");
        
        const ownedEvents = user.events.filter(e => e.owner.toString() === userId.toString());

        for (let i = 0; i < ownedEvents.length; i++) {
            const eventId = ownedEvents[i]._id;
            const event = await Event.findById(eventId);

            // If event doesn't exist
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            promises.push(deleteEventFunc(event));
        }
        await Promise.all(promises);

        console.log("User Events all deleted");

        await User.findByIdAndDelete(id, req.body);

        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllUsers, 
    getUserById,
    getUserEvents,
    getUserGroups,
    getUserMods,
    postUser,
    putUser,
    patchUser,
    deleteUser
}