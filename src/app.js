const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./config/db');
const wordRoutes = require('./api/routes/wordRoutes');
const userUtils = require('./utils/userUtils');
const app = express();

app.use(express.json());
app.set('json spaces', 2);

console.log(userUtils.generateUUID());
mongoose.connect(dbConfig.MONGODB_URI).then(() => console.log("Connected to MongoDB"))
    .catch(error => console.error("Unable to connect to MongoDB", error));


app.use('/api', wordRoutes);


module.exports = app;