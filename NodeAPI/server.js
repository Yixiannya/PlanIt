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

const userRoute = require('./routes/user.route.js');
const eventRoute = require('./routes/event.route.js');
const authRoute = require('./routes/auth.route.js');

const app = express();

const PORT = process.env.PORT;
const mongoUri = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);
app.use('/', authRoute);

// Initialise server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', async (req, res) => {
  res.send('<a href="/auth/google">Sign in with Google</a>');
});

// Connection to MongoDB
mongoose.connect(mongoUri)
.then(() => {
    console.log("Connected to database!");
})
.catch(() => {
    console.log("Connection failed!");
});