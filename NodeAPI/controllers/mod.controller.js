const { RRule, rrulestr } = require('rrule');
const Mod = require('../models/mod.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');

const { deleteEventFunc } = require('./event.controller.js');
const { syncEventToCalendar, deleteEventFromCalendar } = require('./google.controller.js');

// Some functions for usage
function createClass(mod, req) {
    mod.classes.push(
        {
            lessonType: req.body.lessonType,
            classNo: req.body.classNo,
            description: req.body.description,
            year: req.body.year,
            semester: req.body.semester,
            day: req.body.day,
            startDate: req.body.startDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            weeks: req.body.weeks,
            userId: req.body.userId
        }
    );

    console.log("%s %s created", req.body.lessonType, req.body.classNo);
};

async function createEventsForClass(mod, modClass, user) {
    const events = modClass.events;
    const weeks = modClass.weeks;

    console.log("weeks found");

    const yearSplit = "-";
    let splitPosition = 0;

    // Find position of the 2 years in year string
    while (splitPosition < modClass.year.length) {
        if (modClass.year.charAt(splitPosition) == yearSplit) {
            break;
        }
        splitPosition++;
    }

    const yearSem1 = modClass.year.slice(0, splitPosition);
    const yearSem2 = modClass.year.slice(splitPosition + 1);

    console.log("Year 1 is %d", yearSem1);
    console.log("Year 2 is %d", yearSem2);

    // Sem 1 year dates
    const aySem1Start = new Date(yearSem1, 0, 1);
    const aySem1End = new Date(yearSem1, 11, 31, 23, 59, 59);

    const ayStartEvent = await Event.findById("68667030a93852c53e910021");

    console.log("%s found", ayStartEvent.name);

    const ayStartRRule = await ayStartEvent.rRule;
    const ayStartDate = rrulestr(ayStartRRule).between(aySem1Start, aySem1End);

    console.log(ayStartDate);

    var semStart = ayStartDate[0];

    // Sets semStart to respective dates for sem 1/2
    const sem = modClass.semester;
    console.log("Semester %s", sem);
    switch (sem) {
        case "1":
            semStart.setDate(semStart.getDate() + 7);
            break;
        case "2":
            semStart.setDate(semStart.getDate() + (22 * 7));
            break;
        default:
            break;
    }
    semStart.setHours(0, 0, 0);

    console.log("Sem starts at %s", semStart);

    var classDay = 0;

    switch (modClass.day) {
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
    console.log(weeks);

    let eventName = mod.moduleCode;
    if (modClass.lessonType) {
        eventName = eventName + " " + modClass.lessonType;
    }
    if (modClass.classNo) {
        eventName = eventName + " " + modClass.classNo;
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
        if (modClass.semester == 2) {
            week--;
        }

        eventStart.setDate(eventStart.getDate() + classDay + (week * 7))
        eventStart.setTime(eventStart.getTime() + convertHoursToMs(modClass.startTime));
        console.log("Lesson starts on %s", eventStart);

        const eventEnd = new Date(semStart);
        eventEnd.setDate(eventEnd.getDate() + classDay + (week * 7));
        eventEnd.setTime(eventEnd.getTime() + convertHoursToMs(modClass.endTime));
        console.log("Lesson ends on %s", eventEnd);

        const event = await Event.create({
            "name": eventName,
            "description": mod.description,
            "owner": user,
            "dueDate": eventStart,
            "endDate": eventEnd
        });

        await syncEventToCalendar(user, event);
        user.events.push(event);
        events.push(event);

        console.log("Event for week %d created", week);
    }
};

async function deleteClassEvents(modClass) {
    const users = modClass.userId;
    const events = modClass.events;
    const promises = [];
    for (let i = 0; i < users.length; i++) {
        const userId = users[i];

        const user = await User.findById(userId);
        console.log("Modifying %s in class", user.name);

        for (let j = 0; j < events.length; j++) {
            const eventId = events[j]._id;
            promises.push(deleteEventFunc(eventId));
        }
        promises.push(user.save());
    }

    await Promise.all(promises);
}

const getAllMods = async (req, res) => {
    try {
        const mods = await Mod.find({});
        res.status(200).json(mods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getModById = async (req, res) => {
    try {
        const { id } = req.params;
        const mod = await Mod.findById(id);

        if (!mod) {
            return res.status(404).json({ message: "Mod not found" });
        }

        res.status(200).json(mod);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getModUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const users = await Mod.findById(id, '-_id userId').populate('userId');

        // If mod doesn't exist
        if (!users) {
            return res.status(404).json({ message: "Mod not found" });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getModClasses = async (req, res) => {
    try {
        const { id } = req.params;
        const classes = await Mod.findById(id, '-_id classes');

        // If mod doesn't exist
        if (!classes) {
            return res.status(404).json({ message: "Mod not found" });
        }

        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        });

        if (!mod) {
            console.log("Creating new mod");
            mod = await Mod.create(req.body);

            // Creates class with classInfo as subdoc
            createClass(mod, req);

            await mod.save();
        } else if (!mod.userId.includes(user)) {
            // User isn't in mod so update both user and mod to contain this user
            console.log("Adding user %s into mod", user);
            mod.userId.push(user);

            await mod.save();
        }

        // Find the class with specified info
        const modClass = mod.classes.find(c =>
            c.lessonType == req.body.lessonType
            && c.classNo == req.body.classNo
        );

        // Creates class with classInfo as subdoc if class cannot be found
        if (!modClass) {
            createClass(mod, req);
            mod.set({isComplete: false});
        } else {
            const ClassUserArray = modClass.userId;
            if (!ClassUserArray.includes(user)) {
                modClass.userId.push(user);
                console.log("User %s added to %s %s", user, modClass.lessonType, modClass.classNo);
                mod.set({isComplete: false});
            }
        }
        mod.save();

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
        res.status(500).json({ message: error.message });
    }
};

const putMod = async (req, res) => {
    try {
        const { id } = req.params;
        const mod = await Mod.findByIdAndUpdate(id, req.body);

        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({ message: "Mod not found" });
        }

        // Check mod again
        const updatedMod = await Mod.findById(id);
        res.status(200).json(updatedMod);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controls to patch a mod
const patchMod = async (req, res) => {
    try {
        const updateObject = req.body; // e.g. {name: "John", group: "Doe"}
        const { id } = req.params;
        const mod = await Mod.findByIdAndUpdate(id, { $set: updateObject });

        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({ message: "Mod not found" });
        }

        // Check mod again
        const updatedMod = await Mod.findById(id);
        res.status(200).json(updatedMod);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controls to delete a mod
const deleteMod = async (req, res) => {
    try {
        const { id } = req.params;
        const mod = await Mod.findByIdAndDelete(id, req.body);

        console.log(id);

        // If mod doesn't exist
        if (!mod) {
            return res.status(404).json({ message: "Mod not found" });
        }

        const modClasses = mod.classes;
        const userIds = mod.userId;

        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            const user = await User.findById(userId);

            console.log("Modifying %s", user.name);

            // If member doesn't exist
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Remove every event within the mod from the user
            const promises = [];
            for (let j = 0; j < modClasses.length; j++) {
                // delete class events
                const modClass = modClasses[j];
                promises.push(deleteClassEvents(modClass));
            }

            // Remove the mod from the user
            user.mods.pull(id);
            await Promise.all(promises)
                .then(p => user.save());
        }

        console.log("Mod %s deleted successfully", mod.moduleCode);
        res.status(200).json({ message: "Mod deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const mod = await Mod.findById(id);
        const modClass = mod.classes.find(c =>
            c.lessonType == req.body.lessonType
            && c.classNo == req.body.classNo
        );
        const modClassId = modClass._id;

        // delete class events
        console.log("Deleting class events");
        await deleteClassEvents(modClass);
        console.log("Class Events deleted");

        await mod.classes.pull(modClassId);
        mod.save();
        res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;

        // Find mod
        const mod = await Mod.findById(id);
        if (!mod) {
            return res.status(404).json({ message: "Mod not found" });
        }
        console.log("Mod found");

        // Find user
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User found");

        // Use a temp event/mod for start of Sem 1, and refer to that mod for creation of future mods/events
        
        const userClasses = await mod.classes.filter(c => c.userId.includes(userId));
        console.log(userClasses);

        const promises = [];
        for (let i = 0; i < userClasses.length; i++) {
            const modClass = userClasses[i];
            promises.push(createEventsForClass(mod, modClass, user));
        }

        await Promise.all(promises)
            .then(promise => mod.set({ isComplete: true }))
            .then(promise => mod.save())
            .then(promise => user.save());

        console.log("Status updated");
        
        res.status(200).json(user.events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllMods,
    getModById,
    getModUsers,
    getModClasses,
    postMod,
    putMod,
    patchMod,
    deleteMod,
    deleteClass,
    updateStatus
}