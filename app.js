const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const user = require('./api/routes/user');
const dashboard = require('./api/routes/dashboard');
const auth = require("./api/middleware/auth");

const app = express();

mongoose.connect('MongoDB Atlas URI here !');

mongoose.connection.on('error', err => {
    console.log('Error in establishing connection with MongoDB');
})
mongoose.connection.on('connected', connected => {
    console.log('Connected to MongoDB Successfully');
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/user', user);
app.use('/dashboard', auth, dashboard);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Page Not Found'
    })
})

module.exports = app;
