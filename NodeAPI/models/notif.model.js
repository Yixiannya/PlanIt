const mongoose = require('mongoose');

const NotifSchema = mongoose.Schema(
    {
        expoToken: {
            type: String,
            required: true,
        },

        screen: {
            type: String,
            required: true
        },

        type: {
            type: String,
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Event"
        },

        group: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Group"
        }
    }
);

const Notif = mongoose.model("Notif", NotifSchema);

module.exports = Notif;