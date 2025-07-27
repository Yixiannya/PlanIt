// Run npm install
// npm run dev for dev server
// 
// Authentication:
// Call backend API, route to Oauth
// Call exposed endpoint in backend, which routes to frontend
// Send frontend an 'ok', which routes to Oauth login screen

// Deployed on Render to connect frontend to backend remotely

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const IORedis = require('ioredis');

const userRoute = require('./routes/user.route.js');
const eventRoute = require('./routes/event.route.js');
const groupRoute = require('./routes/group.route.js');
const modRoute = require('./routes/mod.route.js');
const authRoute = require('./routes/auth.route.js');
const googleRoute = require("./routes/google.route.js");

const app = express();

const PORT = process.env.PORT;
const mongoUri = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);
app.use("/api/groups", groupRoute);
app.use("/api/mods", modRoute);
app.use('/', authRoute);
app.use('/api/google', googleRoute);

// Initialise server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Connection to MongoDB
mongoose.connect(mongoUri)
.then(() => {
    console.log("Connected to database!");
})
.catch(() => {
    console.log("Connection failed!");
});

// Test connection for Redis
const redis = new IORedis(process.env.TEST_REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});