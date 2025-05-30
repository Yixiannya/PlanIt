const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter username"],
            default: "New User"
        },

        // Use OAuth libraries, obtain access through Google
        googleId: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        groups: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Group",
        }],

        events: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Event"
        }],

        loggedIn: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);


const User = mongoose.model("User", UserSchema);

module.exports = User;