// Code containing all methods used in group routes
const Group = require('../models/group.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');

const { deleteEventFunc } = require('./event.controller.js');

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

// Controls to get a specific group's admins by id
const getGroupAdmins = async (req, res) => {
    try {
        const {id} = req.params;
        const groupAdmins = await Group.findById(id, '-_id admins').populate('admins');

        // If group doesn't exist
        if (!groupAdmins) {
            return res.status(404).json({message: "Group not found"});
        }
        
        res.status(200).json(groupAdmins);
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
// Updates admins and members to contain new group when group is created
const postGroup = async (req, res) => {
    try {
        
        // Check to make sure there is an admin in the group.
        if (req.body.admins.length <= 0) {
            return res.status(403).json({message: "Must have at least one admin in the group."});
        }

        const group = await Group.create(req.body);

        const admins = group.admins;

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

        // Goes through array and assigns every user in admins array to the group
        for (let i = 0; i < admins.length; i++) {
            const user = await User.findByIdAndUpdate(
                admins[i],
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
        // TODO: have it check requester's id and see if they're an admin
        const updateObject = req.body; // e.g. {name: "dog", members: ["id1", "id2"]}
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

// Promote member to admin
const promoteGroupMember = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        const promotedMembers = req.body.promotedMembers; // Must be array of members to promote

        // Check requester's id and see if they're an admin
        let i = 0;
        while (i < admins.length) {
            if (admins[i] == userId) {
                break;
            }
            i++;
        }

        if (i >= admins.length) {
            return res.status(403).json({message: "Requesting User is not an admin"});
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }

        for (let j = 0; j < promotedMembers.length; j++) {
            const memberId = promotedMembers[j];
            group.members.pull(memberId);
            group.admins.push(memberId);
        }

        await group.save();
        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const addGroupMember = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        const addedMembers = req.body.addedMembers; // Must be array of members id to add

        // Check requester's id and see if they're an admin
        let i = 0;
        while (i < admins.length) {
            console.log(userId);
            if (admins[i] == userId) {
                break;
            }
            i++;
        }

        if (i >= admins.length) {
            return res.status(403).json({message: "Requesting User is not an admin"});
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }

        for (let j = 0; j < addedMembers.length; j++) {
            const memberId = addedMembers[j];
            if (group.members.includes(memberId)) {
                console.log("Skipping duplicate member");
                continue;
            }

            // Updates the user's info so they have this group
            const user = await User.findByIdAndUpdate(
                memberId,
                { $push: { groups: group } }
            );

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            group.members.push(memberId);
            await group.save();
        }

        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteGroupMember = async (req, res) => {
    try {
        
        const {id} = req.params;
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        // Must be array of members id to delete
        const deletedMembers = req.body.deletedMembers; 

        // Check requester's id and see if they're an admin
        let i = 0;
        while (i < admins.length) {
            if (admins[i] == userId) {
                break;
            }
            i++;
        }

        if (i >= admins.length) {
            return res.status(403).json({message: "Requesting User is not an admin"});
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }

        for (let j = 0; j < deletedMembers.length; j++) {
            const memberId = deletedMembers[j];
            console.log(memberId);
            group.members.pull(memberId);
            await group.save();

            // Updates the user's info so they don't have this group
            const user = await User.findByIdAndUpdate(
                memberId,
                { $pull: { groups: group._id } }
            );

            
            // If user doesn't exist
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

        }

        
        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const demoteGroupAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        // Must be array of admins to demote
        const demotedAdmins = req.body.demotedAdmins; 

        // Check requester's id and see if they're an admin
        let i = 0;
        while (i < admins.length) {
            if (admins[i] == userId) {
                break;
            }
            i++;
        }

        if (i >= admins.length) {
            return res.status(403).json({message: "Requesting User is not an admin"});
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }

        for (let j = 0; j < demotedAdmins.length; j++) {
            const adminId = demotedAdmins[j];
            group.admins.pull(adminId);
            group.members.push(adminId);
        }

        // Check to make sure there is an admin in the group.
        if (group.admins.length <= 0) {
            return res.status(403).json({message: "Must have at least one admin in the group."});
        }

        await group.save();
        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const addGroupAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        const addedAdmins = req.body.addedAdmins; // Must be array of members id to add

        // Check requester's id and see if they're an admin
        let i = 0;
        while (i < admins.length) {
            console.log(userId);
            if (admins[i] == userId) {
                break;
            }
            i++;
        }

        if (i >= admins.length) {
            return res.status(403).json({message: "Requesting User is not an admin"});
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }

        for (let j = 0; j < addedAdmins.length; j++) {
            const adminId = addedAdmins[j];
            if (group.admins.includes(adminId)) {
                console.log("Skipping duplicate admin");
                continue;
            }

            // Updates the user's info so they have this group
            const user = await User.findByIdAndUpdate(
                adminId,
                { $push: { groups: group } }
            );

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            group.admins.push(adminId);
        }

        await group.save();
        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


const deleteGroupAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        // Must be array of admins to delete
        const deletedAdmins = req.body.deletedAdmins; 

        // Check requester's id and see if they're an admin
        let i = 0;
        while (i < admins.length) {
            if (admins[i] == userId) {
                break;
            }
            i++;
        }

        if (i >= admins.length) {
            return res.status(403).json({message: "Requesting User is not an admin"});
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }

        for (let j = 0; j < deletedAdmins.length; j++) {
            const adminId = deletedAdmins[j];
            group.admins.pull(adminId);

            // Updates the user's info so they don't have this group
            const user = await User.findByIdAndUpdate(
                adminId,
                { $pull: { groups: group._id } }
            );

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }
        }

        // Check to make sure there is an admin in the group.
        if (group.admins.length <= 0) {
            return res.status(403).json({message: "Must have at least one admin in the group."});
        }

        await group.save();
        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// Controls to delete a group
// Also deletes it from admins of this group
// TODO: Delete events
const deleteGroup = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.body.userId;
        const targetGroup = await Group.findById(id);

        // If group doesn't exist
        if (!targetGroup) {
            return res.status(404).json({message: "Group not found"});
        }
        
        const tAdmins = targetGroup.admins;
        

        // Check requester's id and see if they're an admin
        let i = 0;
        while (i < tAdmins.length) {
            if (tAdmins[i] == userId) {
                break;
            }
            i++;
        }

        if (i >= tAdmins.length) {
            return res.status(403).json({message: "Requesting User is not an admin"});
        }

        const group = await Group.findByIdAndDelete(id, req.body);
        const admins = group.admins;
        const members = group.members;
        const events = group.events;

        const promises = [];

        // Goes through array and deletes each event
        for (let i = 0; i < events.length; i++) {
            promises.push(deleteEventFunc(events[i]));
        }

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

        // Goes through array and removes group from every user that is an admin
        for (let i = 0; i < admins.length; i++) {
            const user = await User.findByIdAndUpdate(
                admins[i],
                { $pull: { groups: id } }
            );

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }
        }

        await Promise.all(promises);
        res.status(200).json({message: "Group deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllGroups, 
    getGroupById,
    getGroupAdmins,
    getGroupMembers,
    promoteGroupMember,
    addGroupMember,
    deleteGroupMember,
    demoteGroupAdmin,
    addGroupAdmin,
    deleteGroupAdmin,
    getGroupEvents,
    postGroup,
    putGroup,
    patchGroup,
    deleteGroup
}