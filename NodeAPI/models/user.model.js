const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter username"]
        },

        // Use OAuth libraries, obtain access through email
        email: {
            type: String,
            required: true
        },

        groups: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Group"
        }],

        events: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Event"
        }],
    },
    {
        timestamps: true
    }
);


const User = mongoose.model("User", UserSchema);

module.exports = User;