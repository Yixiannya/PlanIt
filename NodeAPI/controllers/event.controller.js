const Event = require('../models/event.model.js');

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
const getSpecificEvent = async (req, res) => {
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
const getSpecificEventOwner = async (req, res) => {
    try {
        const {id} = req.params;
        const eventOwner = await Event.findById(id, 'owner').populate('owner');

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
// Add a way to update owner to contain new event when event is created
const postEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to update a event
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

// Controls to delete a event
const deleteEvent = async (req, res) => {
    try {
        const {id} = req.params;
        const event = await Event.findByIdAndDelete(id, req.body);
        
        // If event doesn't exist
        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }

        res.status(200).json({message: "Event deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllEvents, 
    getSpecificEvent,
    getSpecificEventOwner,
    postEvent,
    putEvent,
    deleteEvent
}