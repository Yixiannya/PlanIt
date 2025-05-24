const mongoose = require('mongoose');

const EventSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter event name"]
        },

        owner: {
            type: String,
            required: true
        },

        group: {
            type: String,
            required: false
        },

        startDate: {
            type: Date,
            required: [true,"Select a starting date"]
        }

    },
    {
        timestamps: true
    }
);


const Event = mongoose.model("Event", EventSchema);

module.exports = Event;