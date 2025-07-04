// Code containing all methods used in user routes
const User = require('../models/user.model.js');

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


// Controls to create a user
const postUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
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
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id, req.body);
        
        // If user doesn't exist
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const events = await user.events;

        // Loop through events array and delete every event.
        // In the future we have to check if any other member is involved in the event as well.

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
    postUser,
    putUser,
    patchUser,
    deleteUser
}