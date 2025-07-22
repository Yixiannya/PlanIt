const mongoose = require('mongoose');

const NotifSchema = mongoose.Schema(
    {
        expoToken: {
            type: String,
            required: false,
        },

        screen: {
            type: String,
            required: true
        },

        type: {
            type: String,
            required: true
        },

        eventUserPairString: {
            type: String,
            required: false
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