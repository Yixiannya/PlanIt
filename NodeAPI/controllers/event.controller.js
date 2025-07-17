// Code containing all methods used in event routes
// Imports
const { RRule, rrulestr } = require('rrule');
const Event = require('../models/event.model.js');
const Group = require('../models/group.model.js');
const User = require('../models/user.model.js');

const { syncEventToCalendar, deleteEventFromCalendar } = require('./google.controller.js');

// Controls to get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to get a specific event by id
const getEventById = async (req, res) => {
    try {
        const {id} = req.params;
        const event = await Event.findById(id);

        // If event doesn't exist
        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }
        
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to get a specific event's owner by id
const getEventOwner = async (req, res) => {
    try {
        const {id} = req.params;
        const eventOwner = await Event.findById(id, '-_id owner').populate('owner');

        // If event doesn't exist
        if (!eventOwner) {
            return res.status(404).json({message: "Event not found"});
        }
        
        res.status(200).json(eventOwner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getEventDates = async (req, res) => {
    try {
        const {id} = req.params;

        const startRange = new Date(req.body.startRange);
        const endRange = new Date(req.body.endRange);
        
        const event = await Event.findById(id);

        // If event doesn't exist
        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }
        
        const rRule = rrulestr(event.rRule);
        const dates = rRule.between(startRange, endRange);
        res.status(200).json(dates);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// Controls to create a event
// Updates owner to contain new event when event is created
const postEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);

        const owner = req.body.owner;

        const group = event.group;
        
        const targetGroup = await Group.findByIdAndUpdate(
            group,
            { $push: { events: event } }
        );

        // If a group is specified for the event
        if (targetGroup) {
            const admins = targetGroup.admins;
            const members = targetGroup.members;

            const promises = [];

            // Check requester's id and see if they're an admin
            let i = 0;
            while (i < admins.length) {
                console.log(admins[i] == owner);
                if (admins[i] == owner) {
                    break;
                }
                i++;
            }

            if (i >= admins.length) {
                return res.status(403).json({message: "Requesting User is not an admin of the given group"});
            }

            // Members array
            for (let i = 0; i < members.length; i++) {
                const member = await User.findByIdAndUpdate(
                    members[i],
                    { $push: { events: event } }
                );

                event.members.push(member._id);
            
                // If user doesn't exist
                if (!member) {
                    return res.status(404).json({message: "User not found"});
                }

                promises.push(syncEventToCalendar(member, event));
            }

            // Admins array
            for (let i = 0; i < admins.length; i++) {
                const admin = await User.findByIdAndUpdate(
                    admins[i],
                    { $push: { events: event } }
                );

                event.members.push(admin._id);
            
                // If user doesn't exist
                if (!admin) {
                    return res.status(404).json({message: "User not found"});
                }

                promises.push(syncEventToCalendar(admin, event));
            }

            await Promise.all(promises);
        } else {
            // No group specificed, so event is a personal event.
            const user = await User.findByIdAndUpdate(
                owner,
                { $push: { events: event } }
            );
            
            // If user doesn't exist
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            await syncEventToCalendar(user, event);
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to update an event
const putEvent = async (req, res) => {
    try {
        const {id} = req.params;
        const event = await Event.findByIdAndUpdate(id, req.body);
        
        // If event doesn't exist
        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }

        // Check event again
        const updatedEvent = await Event.findById(id);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to patch an event
const patchEvent = async (req, res) => {
    try {
        const updateObject = req.body; // e.g. {name: "dog", dueDate: 2025-10-10T01:00:00.000+00:00}
        const {id} = req.params;
        const event = await Event.findByIdAndUpdate(id, {$set: updateObject});
        
        // If event doesn't exist
        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }

        // Check event again
        const updatedEvent = await Event.findById(id);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// Controls to delete a event
// Also deletes it from owner of this event

// Helper function
async function deleteEventFunc(event) {
    console.log("Deleting Event '%s'", event.name);
    
    const eventId = event._id;

    const ownerId = event.owner;

    const groupId = event.group;

    const members = event.members;

    console.log("Removing event from owner");
    const owner = await User.findByIdAndUpdate(
        ownerId,
        { $pull: { events: eventId } }
    );

    console.log("Removing event from group");
    const group = await Group.findByIdAndUpdate(
        groupId,
        { $pull: { events: eventId } }
    );

    const promises = [];

    for (let i = 0; i < members.length; i++) {
        const member = await User.findByIdAndUpdate(
            members[i],
            { $pull: { events: eventId } }
        );

        // If member doesn't exist
        if (!member) {
            console.log("Member not found");
            return;
        }

        promises.push(deleteEventFromCalendar(member, event));
    }

    // If owner doesn't exist
    if (!owner) {
        console.log("User not found");
        return;
    }

    // If group doesn't exist
    if (!group) {
        console.log("Group not found");
    }

    promises.push(deleteEventFromCalendar(owner, event));

    await Promise.all(promises);
    await Event.findByIdAndDelete(eventId)
        .then(promise => console.log("Event deleted"));
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id, req.body);

        // If event doesn't exist
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        console.log("Deleting event");
        await deleteEventFunc(event);

        console.log("Event %s deleted successfully", event.name);
        res.status(200).json({message: "Event deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllEvents, 
    getEventById,
    getEventOwner,
    getEventDates,
    postEvent,
    putEvent,
    patchEvent,
    deleteEvent,
    deleteEventFunc
}