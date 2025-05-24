const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter group name"]
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },

        members: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }],

        events: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Event"
        }]


    },
    {
        timestamps: true
    }
);


const User = mongoose.model("User", UserSchema);
const Group = mongoose.model("Group", GroupSchema);
const Event = mongoose.model("Event", EventSchema);

module.exports = Group;