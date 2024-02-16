const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let bodyParser = require('body-parser')
const router = require('./routers/router')
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(router)

async function run(){
try {
    mongoose.connect(process.env.MONGO_CONNECTION)
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
} catch (error) {
    console.log("err");
}}
run()


