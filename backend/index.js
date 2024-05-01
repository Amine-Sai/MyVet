const express = require("express");
const mongoose = require("mongoose");
let bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// routers
const productRouter = require("./routers/productRouter");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const favoritesRouter = require("./routers/favoritesrouter");
const reportRouter = require("./routers/reportRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("", authRouter);
app.use("", productRouter);
app.use("", userRouter);
app.use("", favoritesRouter);
app.use("", reportRouter);

async function run() {
  try {
    mongoose.connect(process.env.MONGO_CONNECTION);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect.");
  }
}
run();
