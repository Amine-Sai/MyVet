const express = require('express');
const mongoose = require('mongoose');
let bodyParser = require('body-parser')
require('dotenv').config();


// routers

const productRouter = require('./routers/productRouter')
const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')
const favoritesRouter = require('./routers/favoritesrouter')


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/',authRouter)
app.use('/',productRouter)
app.use('/',userRouter)
app.use('/',favoritesRouter)

async function run(){
try {
    mongoose.connect(process.env.MONGO_CONNECTION)
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
} catch (error) {
    console.log("Cannot connect.");
}}
run()


