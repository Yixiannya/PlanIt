const mongoose = require('mongoose');

const ClassSchema = mongoose.Schema(
    {
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

        day: {
            type: String,
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        weeks: [{
            type: Number,
            required: true
        }],

        userId: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User"
        }],

        events: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Event"
        }]
    }
)

const ModSchema = mongoose.Schema(
    {
        moduleCode: {
            type: String,
            required: [true, "Please enter module code"],
        },

        classes: [ClassSchema],

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

        isComplete: {
            type: Boolean,
            required: true,
            default: false
        },

        userId: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User"
        }],

        startDate: {
            type: Date,
            require: true
        }
        
    },
    {
        timestamps: true
    }
);


const Mod = mongoose.model("Mod", ModSchema);

module.exports = Mod;