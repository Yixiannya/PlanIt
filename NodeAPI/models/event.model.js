const mongoose = require('mongoose');

const EventSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter event name"]
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Please enter owner's id"],
            ref: "User"
        },

        members: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User"
        }],

        group: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Group"
        },

        description: {
            type: String,
            required: false
        },

        venue: {
            type: String,
            required: false
        },

        dueDate: {
            type: Date,
            required: [true, "Select a due date"]
        },

        endDate: {
            type: Date,
            required: [true, "Select an end date"]
        },

        offsetMs: {
            type: Number,
            required: true,
            default: 300000 // By default, notify users of events 5 min before they start
        },

        isRecurring: {
            type: Boolean,
            required: true,
            default: false
        },

        rRule: {
            type: String,
            required: false
        },

        googleId: {
            type: String
        },

        googleIdMap: {
            type: Map,
            of: String,
            default: {}
        }
    },
    {
        timestamps: true
    }
);


const Event = mongoose.model("Event", EventSchema);

module.exports = Event;