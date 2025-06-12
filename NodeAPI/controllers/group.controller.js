// Code containing all methods used in group routes
const Group = require('../models/group.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');

// Controls to get all groups
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find({});
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to get a specific group by id
const getGroupById = async (req, res) => {
    try {
        const {id} = req.params;
        const group = await Group.findById(id);

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }
        
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to get a specific group's owner by id
const getGroupOwner = async (req, res) => {
    try {
        const {id} = req.params;
        const groupOwner = await Group.findById(id, '-_id owner').populate('owner');

        // If group doesn't exist
        if (!groupOwner) {
            return res.status(404).json({message: "Group not found"});
        }
        
        res.status(200).json(groupOwner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to get members of a group
const getGroupMembers = async (req, res) => {
    try {
        const {id} = req.params;
        const groupMembers = await Group.findById(id, '-_id members').populate('members');

        // If group doesn't exist
        if (!groupMembers) {
            return res.status(404).json({message: "Group not found"});
        }
        
        console.log(groupMembers.members[0]._id);
        res.status(200).json(groupMembers);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// Controls to create a group
// Updates owner to contain new group when group is created
const postGroup = async (req, res) => {
    try {
        const group = await Group.create(req.body);

        const owner = group.owner;

        const members = group.members;

        // Goes through array and assigns every user in members array to the group
        for (let i = 0; i < members.length; i++) {
            const user = await User.findByIdAndUpdate(
                members[i],
                { $push: { groups: group } }
            );

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to update an group
const putGroup = async (req, res) => {
    try {
        const {id} = req.params;
        const group = await Group.findByIdAndUpdate(id, req.body);
        
        // If group doesn't exist
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }

        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Get all events a group has
const getGroupEvents = async (req, res) => {
    try {
        const { id } = req.params;
        const groupEvents = await Group.findById(id, '-_id events').populate('events');

        // If group doesn't exist
        if (!groupEvents) {
            return res.status(404).json({message: "Group not found"});
        }
        
        res.status(200).json(groupEvents);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to patch an group
const patchGroup = async (req, res) => {
    try {
        const updateObject = req.body; // e.g. {name: "dog", dueDate: 2025-10-10T01:00:00.000+00:00}
        const {id} = req.params;
        const group = await Group.findByIdAndUpdate(id, {$set: updateObject});
        
        // If group doesn't exist
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }

        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// Controls to delete a group
// Also deletes it from owner of this group
const deleteGroup = async (req, res) => {
    try {
        const {id} = req.params;
        const group = await Group.findByIdAndDelete(id, req.body);

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }
        
        const members = group.members;

        // Goes through array and removes group from every user that is a member
        for (let i = 0; i < members.length; i++) {
            const user = await User.findByIdAndUpdate(
                members[i],
                { $pull: { groups: id } }
            );

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }
        }

        res.status(200).json({message: "Group deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllGroups, 
    getGroupById,
    getGroupOwner,
    getGroupMembers,
    getGroupEvents,
    postGroup,
    putGroup,
    patchGroup,
    deleteGroup
}