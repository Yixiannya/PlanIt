const mongoose = require('mongoose');

const ModSchema = mongoose.Schema(
    {
        moduleCode: {
            type: String,
            required: [true, "Please enter module code"],
        },

        lessonType: {
            type: String,
            required: false
        },

        classNo: {
            type: String,
            required: false
        },

        description: {
            type: String,
            required: false
        },

        year: {
            type: String,
            required: true
        },

        semester: {
            type: String,
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        isComplete: {
            type: Boolean,
            required: true,
            default: false
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User"
        },

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


const Mod = mongoose.model("Mod", ModSchema);

module.exports = Mod;