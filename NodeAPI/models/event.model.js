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

        groups: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Group"
        }],

        dueDate: {
            type: Date,
            required: [true,"Select a due date"]
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