// Run npm install
// npm run dev for dev server
// 
// Authentication:
// Call backend API, route to Oauth
// Call exposed endpoint in backend, which routes to frontend
// Send frontend an 'ok', which routes to Oauth login screen

// Deploy on AWS by Milestone 2 to connect frontend to backend remotely

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/user.model.js');
const Event = require('./models/event.model.js');
const userRoute = require('./routes/user.route.js');
const eventRoute = require('./routes/event.route.js');
const app = express();


const PORT = process.env.PORT;
const mongoUri = process.env.MONGODB_URI;


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);


// Testing commands
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Connection
mongoose.connect("mongodb+srv://admin:1IzQgnVdhN080w9h@backend.q8evqiu.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Backend")
.then(() => {
    console.log("Connected to database!");
})
.catch(() => {
    console.log("Connection failed!");
});