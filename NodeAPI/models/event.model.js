const mongoose = require('mongoose');

const EventSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter event name"]
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },

        groups: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Group"
        }],

        startDate: {
            type: Date,
            required: [true,"Select a starting date"]
        }

    },
    {
        timestamps: true
    }
);


const User = mongoose.model("User", UserSchema);
const Group = mongoose.model("Group", GroupSchema);
const Event = mongoose.model("Event", EventSchema);

module.exports = Event;