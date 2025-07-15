const mongoose = require('mongoose');

const GoogleSchema = mongoose.Schema(
    {
        // Use OAuth libraries, obtain access through Google
        googleId: {
            type: String,
            required: true,
            unique: true
        },
        
        accessToken: {
            type: String,
            required: true
        },

        refreshToken: {
            type: String,
            required: true
        },

        expiryDate: {
            type: Date,
            required: true
        }
    }
);

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter username"],
            default: "New User"
        },

        google: GoogleSchema,

        email: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: false
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

        mods: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Mod"
        }],

        notificationsEnabled: {
            type: Boolean,
            required: true,
            default: false
        },

        notificationToken: {
            type: String,
            required: false
        },

        image: {
            type: String,
            required: false
        },

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