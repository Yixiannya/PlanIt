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
const getSpecificUser = async (req, res) => {
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
const getAllUserEvents = async (req, res) => {
    try {
        const {id} = req.params;
        const events = await User.findById(id).select('events');

        // If user doesn't exist
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        res.status(200).json(events);
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

// Controls to delete a user
const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id, req.body);
        
        // If user doesn't exist
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllUsers, 
    getSpecificUser,
    postUser,
    putUser,
    deleteUser
}