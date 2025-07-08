const { RRule, rrulestr } = require('rrule');
const Mod = require('../models/mod.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');

// const { postEvent } = require('./event.controller.js');

// Find a way to track first monday of every August, that's when Sem 1 starts
// Keep track of users?

const SEM_START = "2026-08-04";

const getAllMods = async (req, res) => {
    try {
        const mods = await Mod.find({});
        res.status(200).json(mods);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getModById = async (req, res) => {
    try {
        const {id} = req.params;
        const mod = await Mod.findById(id);

        if (!mod) {
            return res.status(404).json({message: "Mod not found"});
        }
        
        res.status(200).json(mod);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getModUsers = async (req, res) => {
    try {
        const {id} = req.params;
        const users = await Mod.findById(id, '-_id userId').populate('userId');

        // If mod doesn't exist
        if (!users) {
            return res.status(404).json({message: "Mod not found"});
        }
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const postMod = async (req, res) => {
    try {
        const user = req.body.userId;

        // Check for duplicates and add user into it
        let mod = await Mod.findOne({ 
                moduleCode: req.body.moduleCode, 
                year: req.body.year, 
                semester: req.body.semester
            }  
        );

        if (!mod) {
            console.log("Creating new mod");
            mod = await Mod.create(req.body);
            await mod.save();
        } else if (!mod.userId.includes(user)) {
            // User isn't in mod so update both user and mod to contain this user
            console.log("Adding user %s into mod", user);
            mod.userId.push(user);
            await mod.save();
        }

        // Update users' mods array
        const userObject = await User.findByIdAndUpdate(
            user,
            { $push: { mods: mod } }
        );
                    
        // If user doesn't exist
        if (!userObject) {
            console.log("User not found or no user given");
        }
        
        console.log("Mod %s created successfully", mod.moduleCode);
        res.status(200).json(mod);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const putMod = async (req, res) => {
    try {
        const {id} = req.params;
        const mod = await Mod.findByIdAndUpdate(id, req.body);
        
        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({message: "Mod not found"});
        }

        // Check mod again
        const updatedMod = await Mod.findById(id);
        res.status(200).json(updatedMod);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to patch a mod
const patchMod = async (req, res) => {
    try {
        const updateObject = req.body; // e.g. {name: "John", group: "Doe"}
        const {id} = req.params;
        const mod = await Mod.findByIdAndUpdate(id, {$set: updateObject});
        
        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({message: "Mod not found"});
        }

        // Check mod again
        const updatedMod = await Mod.findById(id);
        res.status(200).json(updatedMod);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Controls to delete a mod
const deleteMod = async (req, res) => {
    try {
        const {id} = req.params;
        const mod = await Mod.findByIdAndDelete(id, req.body);

        console.log(id);
        
        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({message: "Mod not found"});
        }

        const events = mod.events;
        const userIds = mod.userId;

        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            const user = await User.findById(userId);

            console.log("Modifying %s", user.name);
            
            // If member doesn't exist
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            // Remove every event within the mod from the user
            for (let j = 0; j < events.length; j++) {
                const eventId = events[j];
                user.events.pull(eventId);
                const deletedEvent = await Event.findByIdAndDelete(eventId);

                if (!deletedEvent) {
                    return res.status(404).json({message: "Event not found for deletion"});
                } 
                console.log("Event %s on %s deleted", deletedEvent.name, deletedEvent.dueDate.toDateString());
            }

            // Remove the mod from the user
            user.mods.pull(id);
            await user.save();
        }
        
        console.log("Mod %s deleted successfully", mod.moduleCode);
        res.status(200).json({message: "Mod deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const mod = await Mod.findById(id);

        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({message: "Mod not found"});
        }

        console.log("Mod found");

        // TODO: Find a way to create events based on given class, year, sem
        // Use a temp event/mod for start of Sem 1, and refer to that mod for creation of future mods/events
        const userId = req.body.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        console.log("User found");

        const events = mod.events;
        const weeks = mod.weeks;

        console.log("weeks found");

        const yearSplit = "-";
        let splitPosition = 0;

        // Find position of the 2 years in year string
        while (splitPosition < mod.year.length) {
            if (mod.year.charAt(splitPosition) == yearSplit) {
                break;
            }
            splitPosition++;
        }

        const yearSem1 = mod.year.slice(0, splitPosition);
        const yearSem2 = mod.year.slice(splitPosition + 1);

        console.log("Year 1 is %d", yearSem1);
        console.log("Year 2 is %d", yearSem2);

        // Sem 1 year dates
        const aySem1Start = new Date(yearSem1, 0, 1);
        const aySem1End = new Date(yearSem1, 11, 31, 23, 59, 59);

        // Sem 2 year dates
        const aySem2Start = new Date(yearSem2, 0, 1);
        const aySem2End = new Date(yearSem2, 11, 31, 23, 59, 59);
        
        const ayStartEvent = await Event.findById("68667030a93852c53e910021");

        console.log("Event %s found", ayStartEvent.name);

        const ayStartRRule = await ayStartEvent.rRule;
        const ayStartDate = rrulestr(ayStartRRule).between(aySem1Start, aySem1End);

        console.log(ayStartDate);

        var semStart = ayStartDate[0];

        // Sets semStart to respective dates for sem 1/2
        const sem = mod.semester;
        console.log("Semester %s", sem);
        switch (sem) {
            case "1":
                semStart.setDate(semStart.getDate() + 7); 
                break;
            case "2":
                semStart.setDate(semStart.getDate() + (22 * 7)); 
                break;
            default:
                console.log("Sem starts at %s", semStart);
                break;
        }
        
        var classDay = 0;

        switch (mod.day) {
            case "Monday":
                classDay = 0; 
                break;
            case "Tuesday":
                classDay = 1;
                break;
            case "Wednesday":
                classDay = 2;
                break;
            case "Thursday":
                classDay = 3;
                break;
            case "Friday":
                classDay = 4;
                break;
            case "Saturday":
                classDay = 5;
                break;
            case "Sunday":
                classDay = 6;
                break;
            default:
                classDay = 0;
                break;
        }

        await weeks;

        let eventName = mod.moduleCode;
        if (mod.lessonType) {
            eventName = eventName + " " + mod.lessonType;
        }
        if (mod.classNo) {
            eventName = eventName + " " + mod.classNo;
        }

        function convertHoursToMs(time) {
            const hours = time.slice(0, 2);
            const mins = time.slice(2);
            return (hours * 3600 * 1000) + (mins * 60 * 1000);
        }

        // Creates an event at the given date for each week, counting from start of sem
        // Add them into given user's events array
        for (let i = 0; i < weeks.length; i++) {
            var week = weeks[i];
            const eventStart = new Date(semStart);

            // Account for midterm reading week (between week 6 and 7)
            if (week >= 7) {
                week++;
            }

            // Account for no orientation week (week 0) in Sem 2
            if (mod.semester == 2) {
                week--;
            }

            eventStart.setDate(eventStart.getDate() + classDay + (week * 7));
            eventStart.setTime(eventStart.getTime() + convertHoursToMs(mod.startTime));
            console.log("Lesson starts on %s", eventStart);

            const eventEnd = new Date(semStart);
            eventEnd.setDate(eventEnd.getDate() + classDay + (week * 7));
            eventEnd.setTime(eventEnd.getTime() + convertHoursToMs(mod.endTime));
            console.log("Lesson ends on %s", eventEnd);

            const event = await Event.create( { 
                "name": eventName,
                "description": mod.description,
                "owner": user,
                "dueDate": eventStart,
                "endDate": eventEnd
             } );

            user.events.push(event);
            events.push(event);

            console.log("Event for week %d created", week);
        }        

        user.save();
        await mod.set({ isComplete: true });
        await mod.save();

        console.log("Status updated");

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllMods, 
    getModById,
    getModUsers,
    postMod,
    putMod,
    patchMod,
    deleteMod,
    updateStatus
}