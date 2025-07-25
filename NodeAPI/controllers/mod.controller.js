const { RRule, rrulestr } = require('rrule');
const Mod = require('../models/mod.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');

const { deleteEventFunc } = require('./event.controller.js');
const { syncEventToCalendar, deleteEventFromCalendar } = require('./google.controller.js');
const { sleep } = require('../utils/functions');

// Some functions for usage
function createClass(mod, req) {
    // TODO: Modify weeks so it encompasses both a date range and array of weeks
    // Some mods apparently have it listed on NUSMODS as a date range
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
            venue: req.body.venue,
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
            semStart.setHours(0, 0, 0);
            break;
        case "2":
            semStart.setDate(semStart.getDate() + (22 * 7));
            semStart.setHours(0, 0, 0);
            break;
        default:
            semStart.setDate(mod.startDate);
            break;
    }

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
        const originWeek = weeks[i];
        var week = weeks[i];
        const eventStart = new Date(semStart);

        // For regular sems (not special term)
        if (modClass.semester == 1 || modClass.semester == 2) {
            // Account for midterm reading week (between week 6 and 7)
            if (week >= 7) {
                week++;
            }

            // Account for no orientation week (week 0) in Sem 2
            if (modClass.semester == 2) {
                week--;
            }
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
            "venue": modClass.venue,
            "owner": user,
            "dueDate": eventStart,
            "endDate": eventEnd
        });

        await syncEventToCalendar(user, event);
        user.events.push(event._id);
        events.push(event);

        console.log("Event for week %d created", originWeek);
        await sleep(150);
    }
};

async function leaveClassHelper(user, modClass, mod) {
    const allEvents = modClass.events;
    const promises = [];
    console.log("Modifying %s in class", user.name);

    // Changed to sequential here too due to rate limit
    console.log("Deleting class events");
    const userClassEvents = allEvents.filter(e => e.owner.toString() === user._id.toString());
    for (let i = 0; i < userClassEvents.length; i++) {
        const eventId = userClassEvents[i]._id;
        const event = await Event.findById(eventId);

        // If event doesn't exist
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await deleteEventFunc(event);
        await sleep(150);
    }
    promises.push(user.save());

    await Promise.all(promises);

    console.log("Removing user %s from class %s", user.name, modClass.name);
    await modClass.userId.pull(user);
    await mod.save();
}

async function deleteClassEvents(modClass) {
    const users = modClass.userId;
    const events = modClass.events;
    const promises = [];
    for (let i = 0; i < users.length; i++) {
        const userId = users[i];

        const user = await User.findById(userId);
        console.log("Modifying %s in class", user.name);

        console.log("Deleting class events");
        for (let j = 0; j < events.length; j++) {
            const eventId = events[j]._id;
            const event = await Event.findById(eventId);

            // If event doesn't exist
            if (!event) {
                console.log("Event not found");
                return; 
            }

            promises.push(deleteEventFunc(event));
        }
        promises.push(user.save());
    }

    await Promise.all(promises);
    console.log("class events deleted");
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

const getAllUserClasses = async (req, res) => {
    try {
        // Finds user
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.populate('mods');
        var allOwnedClasses = [];
        const mods = user.mods;

        // Searches every mod the user is in
        for (let i = 0; i < mods.length; i++) {
            const mod = mods[i];
            const ownedClasses = mod.classes.filter(c => c.userId.includes(user._id));
            allOwnedClasses = allOwnedClasses.concat(ownedClasses);
        }

        res.status(200).json(allOwnedClasses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserModClasses = async (req, res) => {
    try {
        const { id } = req.params;

        // Finds user
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Finds mod
        const mod = await Mod.findById(id);
        if (!mod) {
            return res.status(404).json({ message: "Mod not found" });
        }

        const ownedClasses = mod.classes.filter(c => c.userId.includes(user._id));

        res.status(200).json(ownedClasses);
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
            if (req.body.lessonType && req.body.classNo) {
                createClass(mod, req);
            }

            // Update users' mods array
            const userObject = await User.findByIdAndUpdate(
                user,
                { $push: { mods: mod } }
            );

            // If user doesn't exist
            if (!userObject) {
                return res.status(404).json({ message: "User not found" });
            }

            userObject.modCompleted.set(mod._id.toString(), false);

            await userObject.save();
            await mod.save();
        } else if (!mod.userId.includes(user)) {
            // User isn't in mod so update both user and mod to contain this user
            console.log("Adding user %s into mod", user);
            mod.userId.push(user);

            // Update users' mods array
            const userObject = await User.findByIdAndUpdate(
                user,
                { $push: { mods: mod } }
            );

            // If user doesn't exist
            if (!userObject) {
                return res.status(404).json({ message: "User not found" });
            }

            userObject.modCompleted.set(mod._id.toString(), false);

            await userObject.save();
            await mod.save();
        }

        // Find the class with specified info
        if (req.body.lessonType && req.body.classNo) {
            console.log("lessonType and classNo specified");
            const modClass = mod.classes.find(c =>
                c.lessonType == req.body.lessonType
                && c.classNo == req.body.classNo
                && c.day == req.body.day
                && c.startTime == req.body.startTime
                && c.endTime == req.body.endTime
            );

            // Creates class with classInfo as subdoc if class cannot be found
            if (!modClass) {
                createClass(mod, req);
            } else {
                const ClassUserArray = modClass.userId;
                if (!ClassUserArray.includes(user)) {
                    modClass.userId.push(user);
                    console.log("User %s added to %s %s", user, modClass.lessonType, modClass.classNo);
                }
            }
            await mod.save();
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
            // Changed to sequential because of rate limit
            const promises = [];
            for (let j = 0; j < modClasses.length; j++) {
                // delete class events
                const modClass = modClasses[j];
                await deleteClassEvents(modClass);
            }

            // Remove the mod from the user
            promises.push(user.mods.pull(id));
            promises.push(user.modCompleted.delete(mod._id.toString()));

            await Promise.all(promises)
            await user.save();
        }

        console.log("Mod %s deleted successfully", mod.moduleCode);
        res.status(200).json({ message: "Mod deleted successfully" });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: error.message });
    }
};

const leaveMod = async (req, res) => {
    try {
        console.log("Leaving mod");
        const { id } = req.params;

        // Find user
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User found");

        // Find mod
        const mod = await Mod.findById(id);
        if (!mod) {
            return res.status(404).json({ message: "Mod not found" });
        }
        console.log("Mod found");        
        
        await mod.populate("classes.events");

        const modClasses = mod.classes.filter(c => c.userId.includes(user._id));   
        console.log(modClasses);
        // const promises = [];

        for (let i = 0; i < modClasses.length; i++) {
            const modClass = mod.classes[i];
            await leaveClassHelper(user, modClass, mod);
        }

        // Not using in parallel because we're hitting Google Cloud API's rate limit
        // await Promise.all(promises); 

        console.log("Removing user from mod");
        mod.userId.pull(user);
        await mod.save();
        console.log("User removed from mod");

        console.log("Removing mod from user");
        user.mods.pull(mod);
        user.modCompleted.delete(mod._id.toString());
        await user.save();
        console.log("Mod removed from user");

        res.status(200).json({ message: "Mod left successfully" });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: error.response?.data || error.message });
    }
}

const leaveClass = async (req, res) => {
    try {
        console.log("Leaving class");
        const { id } = req.params;

        // Find user
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User found");

        // Find mod
        const mod = await Mod.findById(id);
        if (!mod) {
            return res.status(404).json({ message: "Mod not found" });
        }
        console.log("Mod found");

        await mod.populate("classes.events");

        const modClass = mod.classes.find(c =>
            c.lessonType == req.body.lessonType
            && c.classNo == req.body.classNo
            && c.day == req.body.day
            && c.startTime == req.body.startTime
            && c.endTime == req.body.endTime
        );

        console.log("Deleting class events owned by user %s", user.name);
        await leaveClassHelper(user, modClass, mod);
        console.log("Owned class events deleted");

        res.status(200).json({ message: "Class left successfully" });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: error.response?.data || error.message });
    }
}

const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const mod = await Mod.findById(id);
        const modClass = mod.classes.find(c =>
            c.lessonType == req.body.lessonType
            && c.classNo == req.body.classNo
            && c.day == req.body.day
            && c.startTime == req.body.startTime
            && c.endTime == req.body.endTime
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
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: error.response?.data || error.message });
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
        await mod.populate("classes.events");

        for (let i = 0; i < userClasses.length; i++) {
            const modClass = userClasses[i];
            // Delete all classes events first, before adding them back in
            await leaveClassHelper(user, modClass, mod);
            await createEventsForClass(mod, modClass, user);
        }

        await Promise.all(promises);
        await user.modCompleted.set(mod._id.toString(), true);
        await mod.save();
        await user.save();

        console.log("Status updated");
        
        res.status(200).json({ message: "Status updated"});
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllMods,
    getModById,
    getModUsers,
    getModClasses,
    getAllUserClasses,
    getUserModClasses,
    postMod,
    putMod,
    patchMod,
    deleteMod,
    deleteClass,
    leaveMod,
    leaveClass,
    updateStatus
}