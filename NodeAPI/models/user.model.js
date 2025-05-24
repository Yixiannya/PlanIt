const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter username"]
        },

        group: {
            type: String,
            required: false
        },

        event: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);


const User = mongoose.model("User", UserSchema);

module.exports = User;