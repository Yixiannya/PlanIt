// Code containing all methods used in group routes
const Group = require('../models/group.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');

const { deleteEventFunc } = require('./event.controller.js');
const { deleteEventFromCalendar } = require('./google.controller.js');
const { scheduleJoinGroupNotification, cancelEventNotification } = require('./notif.controller.js');

// Controls to get all groups
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find({});
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controls to get a specific group by id
const getGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id);

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controls to get a specific group's admins by id
const getGroupAdmins = async (req, res) => {
    try {
        const { id } = req.params;
        const groupAdmins = await Group.findById(id, '-_id admins').populate('admins');

        // If group doesn't exist
        if (!groupAdmins) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json(groupAdmins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controls to get members of a group
const getGroupMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const groupMembers = await Group.findById(id, '-_id members').populate('members');

        // If group doesn't exist
        if (!groupMembers) {
            return res.status(404).json({ message: "Group not found" });
        }

        console.log(groupMembers.members[0]._id);
        res.status(200).json(groupMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Controls to create a group
// Updates admins and members to contain new group when group is created
const postGroup = async (req, res) => {
    try {

        // Check to make sure there is an admin in the group.
        if (req.body.admins.length <= 0) {
            return res.status(403).json({ message: "Must have at least one admin in the group." });
        }

        const group = await Group.create(req.body);

        const admins = group.admins;
        const members = group.members;

        const promises = [];

        // Goes through array and assigns every user in members array to the group
        for (let i = 0; i < members.length; i++) {
            const user = await User.findByIdAndUpdate(
                members[i],
                { $push: { groups: group } }
            );

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            promises.push(scheduleJoinGroupNotification(user, group));
        }

        // Goes through array and assigns every user in admins array to the group
        for (let i = 0; i < admins.length; i++) {
            const user = await User.findByIdAndUpdate(
                admins[i],
                { $push: { groups: group } }
            );

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            promises.push(scheduleJoinGroupNotification(user, group));
        }

        await Promise.all(promises);
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controls to update an group
const putGroup = async (req, res) => {
    try {
        const { id } = req.params;
        // Check requester's id and see if they're an admin
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        let i = 0;
        while (i < admins.length) {
            console.log(userId);
            if (admins[i] == userId) {
                break;
            }
            i++;
        }
        if (i >= admins.length) {
            return res.status(403).json({ message: "Requesting User is not an admin" });
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }


        const updatedGroup = await Group.findByIdAndUpdate(id, req.body);

        // If group doesn't exist
        if (!updatedGroup) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check group again
        const finalUpdatedGroup = await Group.findById(id);
        res.status(200).json(finalUpdatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all events a group has
const getGroupEvents = async (req, res) => {
    try {
        const { id } = req.params;
        const groupEvents = await Group.findById(id, '-_id events').populate('events');

        // If group doesn't exist
        if (!groupEvents) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json(groupEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controls to patch an group
const patchGroup = async (req, res) => {
    try {
        const { id } = req.params;
        // Check requester's id and see if they're an admin
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        let i = 0;
        while (i < admins.length) {
            console.log(userId);
            if (admins[i] == userId) {
                break;
            }
            i++;
        }
        if (i >= admins.length) {
            return res.status(403).json({ message: "Requesting User is not an admin" });
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const updateObject = req.body; // e.g. {name: "dog", members: ["id1", "id2"]}
        const updatedGroup = await Group.findByIdAndUpdate(id, { $set: updateObject });

        // If group doesn't exist
        if (!updatedGroup) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check group again
        const finalUpdatedGroup = await Group.findById(id);
        res.status(200).json(finalUpdatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Promote member to admin
const promoteGroupMember = async (req, res) => {
    try {
        const { id } = req.params;
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
            return res.status(403).json({ message: "Requesting User is not an admin" });
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
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
        res.status(500).json({ message: error.message });
    }
};

const addGroupMember = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        const addedMembers = req.body.addedMembers; // Must be array of members id to add
        const promises = [];

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
            return res.status(403).json({ message: "Requesting User is not an admin" });
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const membersToBeNotified = [];

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
                return res.status(404).json({ message: "User not found" });
            }

            membersToBeNotified.push(memberId);
            group.members.push(memberId);
        }
        console.log(membersToBeNotified);
        await group.save();

        // Check group again
        const updatedGroup = await Group.findById(id);

        // Send notif to all added users, once group is finished updating
        for (let j = 0; j < membersToBeNotified.length; j++) {
            const memberId = membersToBeNotified[j];
            const user = await User.findById(memberId);

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            console.log("User found");

            promises.push(scheduleJoinGroupNotification(user, updatedGroup));
            console.log("Added to group notif sent");
        }

        await Promise.all(promises);
        console.log("All notifs sent");
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGroupMember = async (req, res) => {
    try {
        console.log("deleting member");
        const { id } = req.params;
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        // Must be array of members id to delete
        const deletedMembers = req.body.deletedMembers;
        console.log("Deleted members are:", deletedMembers);
        console.log("User ID is:", userId);

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // For deleting self from group (because frontend coded it this way without consulting me)
        if (deletedMembers.length == 1 && deletedMembers[0].toString() == userId.toString()) {
            console.log("removing self");
            group.members.pull(userId);
            await group.save();

            // Updates the user's info so they don't have this group
            const user = await User.findById(memberId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.groups.pull(group._id);
            await user.save();

            await user.populate('events');
            const events = user.events.filter(e => e.group.toString() == id.toString());
            console.log(events);

            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                await deleteEventFromCalendar(user, event);
                await user.events.pull(event._id);
                await event.save();
            }


            await user.save();

            // Check group again
            const updatedGroup = await Group.findById(id);
            res.status(200).json(updatedGroup);
            return;
        }

        // Check requester's id and see if they're an admin
        let i = 0;
        while (i < admins.length) {
            if (admins[i] == userId) {
                break;
            }
            i++;
        }

        if (i >= admins.length) {
            console.log("Not an admin");
            return res.status(403).json({ message: "Requesting User is not an admin" });
        }

        for (let j = 0; j < deletedMembers.length; j++) {
            const memberId = deletedMembers[j];
            console.log(memberId);
            group.members.pull(memberId);
            await group.save();

            // Updates the user's info so they don't have this group
            const user = await User.findById(memberId);

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.groups.pull(group._id);
            await user.save();

            await user.populate('events');
            const events = user.events.filter(e => e.group.toString() == id.toString());

            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                await deleteEventFromCalendar(user, event);
                await user.events.pull(event._id);
                await event.save();
            }

            await user.save();
        }


        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const demoteGroupAdmin = async (req, res) => {
    try {
        const { id } = req.params;
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
            return res.status(403).json({ message: "Requesting User is not an admin" });
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        for (let j = 0; j < demotedAdmins.length; j++) {
            const adminId = demotedAdmins[j];
            group.admins.pull(adminId);
            group.members.push(adminId);
        }

        // Check to make sure there is an admin in the group.
        if (group.admins.length <= 0) {
            return res.status(403).json({ message: "Must have at least one admin in the group." });
        }

        await group.save();
        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addGroupAdmin = async (req, res) => {
    try {
        const { id } = req.params;
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
            return res.status(403).json({ message: "Requesting User is not an admin" });
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
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
                return res.status(404).json({ message: "User not found" });
            }

            group.admins.push(adminId);
        }

        await group.save();
        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGroupAdmin = async (req, res) => {
    try {
        console.log("deleting admin");
        const { id } = req.params;
        const userId = req.body.userId;
        const group = await Group.findById(id);
        const admins = group.admins;
        // Must be array of admins to delete
        const deletedAdmins = req.body.deletedAdmins;
        console.log("Deleted admins are:", deletedAdmins);

        // For deleting self from group (because frontend coded it this way without consulting me)
        if (deletedAdmins.length == 1 && deletedAdmins[0].toString() == userId.toString()) {
            console.log("removing self");
            group.admins.pull(userId);
            await group.save();

            // Updates the user's info so they don't have this group
            const user = await User.findById(memberId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.groups.pull(group._id);
            await user.save();

            await user.populate('events');
            const events = user.events.filter(e => e.group.toString() == id.toString());

            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                await deleteEventFromCalendar(user, event);
                await cancelEventNotification(user, event);
                await user.events.pull(event._id);
                await event.save();
                // I would edit the event to pull the user from it, but that requires
                // further editing and checks if user is event owner and whatnot,
                // and I do not have time to finish this before Milestone 3.
            }

            await user.save();

            // Check group again
            const updatedGroup = await Group.findById(id);
            res.status(200).json(updatedGroup);
            return;
        }

        // Check requester's id and see if they're an admin
        let i = 0;
        while (i < admins.length) {
            if (admins[i] == userId) {
                break;
            }
            i++;
        }

        if (i >= admins.length) {
            console.log("Not an admin");
            return res.status(403).json({ message: "Requesting User is not an admin" });
        }

        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        for (let j = 0; j < deletedAdmins.length; j++) {
            const adminId = deletedAdmins[j];
            group.admins.pull(adminId);

            // Updates the user's info so they don't have this group
            const user = await User.findById(memberId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.groups.pull(group._id);
            await user.save();

            // Deletes events from the user
            await user.populate('events');
            const events = user.events.filter(e => e.group.toString() == id.toString());

            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                await deleteEventFromCalendar(user, event);
                await cancelEventNotification(user, event);
                await user.events.pull(event);
                await event.save();
            }

            await user.save();
        }

        // Check to make sure there is an admin in the group.
        if (group.admins.length <= 0) {
            return res.status(403).json({ message: "Must have at least one admin in the group." });
        }

        await group.save();
        // Check group again
        const updatedGroup = await Group.findById(id);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Controls to delete a group
// Also deletes it from admins of this group
// TODO: Delete events
const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        const targetGroup = await Group.findById(id);

        // If group doesn't exist
        if (!targetGroup) {
            return res.status(404).json({ message: "Group not found" });
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
            return res.status(403).json({ message: "Requesting User is not an admin" });
        }

        const group = await Group.findByIdAndDelete(id, req.body);
        const admins = group.admins;
        const members = group.members;
        const events = group.events;

        const promises = [];

        // Goes through array and deletes each event
        for (let i = 0; i < events.length; i++) {
            const eventId = events[i]._id;
            const event = await Event.findById(eventId);

            // If event doesn't exist
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            promises.push(deleteEventFunc(event));
        }

        // Goes through array and removes group from every user that is a member
        for (let i = 0; i < members.length; i++) {
            const user = await User.findByIdAndUpdate(
                members[i],
                { $pull: { groups: id } }
            );

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({ message: "User not found" });
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
                return res.status(404).json({ message: "User not found" });
            }
        }

        await Promise.all(promises);
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
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