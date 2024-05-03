const admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.createUser = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await admin.findOne({ email: email });
      if (user) {
        res.status(400).json({ message: "User already exists!" });
      } else {
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new admin({
          email: email,
          password: hashedPassword,
          username: "admin",
          salt: salt,
        });
  
        await newUser.save();
        res.send({ message: "User registered." });
      }
    } catch (error) {
      console.log(error);
      res.status(503).json({ message: "Error occured." });
    }
  };