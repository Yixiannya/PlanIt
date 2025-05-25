const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user.model.js');
const Event = require('./models/event.model.js');
const userRoute = require('./routes/user.route.js');
const eventRoute = require('./routes/event.route.js');
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);


// Testing commands
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
    res.send("Hello from Node API Server Updated");
});


// Connection
mongoose.connect("mongodb+srv://admin:1IzQgnVdhN080w9h@backend.q8evqiu.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Backend")
.then(() => {
    console.log("Connected to database!");
})
.catch(() => {
    console.log("Connection failed!");
});