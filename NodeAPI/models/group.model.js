const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter group name"]
        },

        admins: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }],

        members: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }],

        description: {
            type: String,
            required: false
        },
        
        image: {
            type: String,
            required: false
        },

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


const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;