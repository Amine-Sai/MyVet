// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let bodyParser = require('body-parser')
const router = require('./controllers/router')


// Create Express app
const app = express();
const PORT = 3000;
//body parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(router)

async function run(){
try {
    mongoose.connect('mongodb://localhost:27017/login')
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
} catch (error) {
    console.log("err");
}}
run()


