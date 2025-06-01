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
            // type: mongoose.Schema.Types.ObjectId,
            type: String,
            required: false,
            // ref: "Group"
        },

        description: {
            type: String,
            required: false
        },

        dueDate: {
            type: Date,
            required: [true, "Select a due date"]
        },

        description: {
            type: String,
            required: false
        }

    },
    {
        timestamps: true
    }
);


const Event = mongoose.model("Event", EventSchema);

module.exports = Event;