const Group = require('../models/group.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');
const Notif = require('../models/notif.model.js');

const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis(process.env.TEST_REDIS_URL, {maxRetriesPerRequest: null});
const notificationQueue = new Queue('notifications', { connection });

// Schedule a group joining notification
async function scheduleJoinGroupNotification(user, group) {
    const { notificationToken } = user;
    const userId = user._id;
    const { _id, admins, members } = group;
    const screen = "Group"

    const notif = await Notif.create({
        expoToken: notificationToken,
        type: "Group",
        screen: screen,
        group: group
    });

    if (!notif) {
        console.warn("Invalid expoToken or screen fields");
        return;
    }

    const adminsString = Array.isArray(admins)
        ? admins.map(id => id?.toString?.())
        : [];
    const membersString = Array.isArray(admins)
        ? members.map(id => id?.toString?.())
        : [];

    const jobData = {
        userId: userId.toString() || "",
        expoToken: notif.expoToken,
        type: "Group",
        title: "Group Notification",
        body: `You have been added to ${group.name}.`,
        info: {
            screen: notif.screen,
            group: {
                _id: group._id.toString(),
                name: group.name || "",
                description: group.description || "",
                admins: adminsString,
                members: membersString,
            }
        }
    }

    await notificationQueue.add('notifications', jobData, {
        jobId: _id.toString(),
    });

    console.log("Group Notification added to queue");
};

// Schedule an upcoming event notification
async function scheduleEventNotification(user, event) {
    try {
        console.log("Scheduling event notif");
        const userId = user._id;
        const { notificationToken } = user;
        const { _id, dueDate, offsetMs } = event;
        const jobId = _id.toString() + "-" + userId.toString();

        const notifTime = new Date(dueDate.getTime() - (8 * 60 * 60 * 1000) - offsetMs);
        console.log(notifTime);
        const now = new Date();
        console.log(now);

        const delayMs = notifTime - now;

        if (delayMs < 0) {
            console.warn("Event has finished");
            return;
        }
        console.log(delayMs);

        var screen = "Indiv Event";

        if (event.group) {
            screen = "Group Event";
        }

        const notif = await Notif.create({
            expoToken: notificationToken,
            type: "Event",
            screen: screen,
            event: event
        });

        if (!notif) {
            console.warn("Invalid fields");
            return;
        }
        console.log("Notif created");

        const members = Array.isArray(event.members)
            ? event.members.map(id => id?.toString?.())
            : [];
        console.log(members);

        const jobData = {
            userId: userId.toString() || "",
            expoToken: notif.expoToken,
            type: "Event",
            title: "Event Notification",
            body: `${event.name || "An event"} will be happening soon.`,
            info: {
                screen: notif.screen,
                event: {
                    _id: event._id?.toString?.(),
                    name: event.name || "",
                    description: event.description || "",
                    owner: event.owner?.toString?.(),
                    members,
                    group: event.group?.toString?.(),
                    dueDate: event.dueDate,
                    endDate: event.endDate,
                    googleId: event.googleId || "",
                    venue: event.venue || ""
                }
            }
        };
        console.log("jobData created");

        await notificationQueue.add('notifications', jobData, {
            delay: delayMs,
            jobId: jobId,
        });

        console.log("Event Notification added to queue");
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Cancel a scheduled event notification
async function cancelEventNotification(user, event) {
    const userId = user._id;
    const { _id, name } = event;
    const jobId = _id.toString() + "-" + userId.toString();

    if (!jobId) {
        console.warn("Invalid event ID %s", jobId);
        return;
    }

    const job = await notificationQueue.getJob(jobId);
    if (job) {
        await job.remove();
        console.log("Job removed from queue");
    } else {
        console.warn("No job found for event '%s'", name);
    }

    const notif = await Notif.findOneAndDelete({eventUserPairString: jobId});
    if (!notif) {
        console.warn("No notification for event '%s' found", name);
    }
    console.log("Notif deleted");
};

// Sends notification when time is reached
async function sendPushNotification({ expoToken, title, body, data }) {
    console.log("Sending notification");
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            to: expoToken,
            sound: 'default',
            title: title,
            body: body,
            data: data,
        }),
    });

    const result = await response.json();
    console.log(result);
};

// Process notifications
const worker = new Worker('notifications', async job => {
    const { userId, type, expoToken, info } = job.data;
    const { screen, event, group } = info;

    if (!expoToken || !type || !screen) {
        console.error("Missing required fields");
        return;
    }

    let title = "Notification";
    let body = "Body Text";
    let data = { screen };

    switch (type) {
        case "Event":
            if (!event) {
                console.warn("Missing event for event-type notification");
                return;
            }
            title = "Event Notification";
            body = `${event.name} will be happening soon.`;
            data.event = event;
            break;

        case "Group":
            if (!group) {
                console.warn("Missing group for group-type notification");
                return;
            }
            title = `Group Notification`;
            body = `You have been added to ${group.name}.`;
            data.group = group;
            break;

        default:
            console.warn("Unknown notification type:", type);
            return;
    }

    const user = await User.findById(userId);

    if (user.notificationsEnabled) {
        console.log('Sending notification:', job.data);
        await sendPushNotification({ expoToken, title, body, data });
        console.log("Notification sent");
    } else {
        console.log("User disabled notifications");
    }
},
    { connection }
);

module.exports = {
    scheduleJoinGroupNotification,
    scheduleEventNotification,
    cancelEventNotification
}