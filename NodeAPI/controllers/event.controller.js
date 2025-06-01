// Code containing all methods used in event routes
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');

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


// Controls to create a event
// Updates owner to contain new event when event is created
const postEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);

        const owner = event.owner;
        
        const user = await User.findByIdAndUpdate(
            owner,
            { $push: { events: event } }
        );
        
        // If user doesn't exist
        if (!user) {
            return res.status(404).json({message: "User not found"});
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
const deleteEvent = async (req, res) => {
    try {
        const {id} = req.params;
        const event = await Event.findByIdAndDelete(id, req.body);

        // If event doesn't exist
        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }
        
        const owner = event.owner;

        const user = await User.findByIdAndUpdate(
            owner,
            { $pull: { events: id } }
        );

        // If user doesn't exist
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({message: "Event deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllEvents, 
    getEventById,
    getEventOwner,
    postEvent,
    putEvent,
    patchEvent,
    deleteEvent
}