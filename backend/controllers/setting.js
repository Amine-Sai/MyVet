const express = require("express");
//const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../models/user");
//const auth = require("../middleware/auth");

/*      
profile : firstname,last name ,  email, password ; pic 
delete account 
shopping address 
privacy and policy  



*/
/*exports.updateEmail = async (req, res) => {
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    req.user.email = email;
    await req.user.save();

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateFirstname = async (req, res) => {
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName } = req.body;
    req.user.firstName = firstName;

    await req.user.save();

    res.status(200).json({ message: "First name updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateLastname = async (req, res) => {
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lastName } = req.body;

    req.user.lastName = lastName;
    await req.user.save();

    res.status(200).json({ message: "Last name updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });
const { password} = req.password;
const salt = await bcrypt.genSalt(10);
hashedPassword = await bcrypt.hash(password, salt);
req.user.password = hashedPassword ;
req.user.salt = salt;

    res.status(200).json({ message: "password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updatePic = async (req, res) => {
  try {


    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pic } = req.body;
    req.user.pic = pic;
    await req.user.save();

    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};*/


exports.updateUser = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ message: "you must be logged in." });
    const user = await User.findById(req.userId);
   console.log(req.userId);
   console.log(user.firstName );
    const { firstName ,  email ,lastName, password ,pic} = req.body;

    if (email) user.email = email;
   if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      user.salt = salt;
    }
    if (pic) user.pic = pic;


    
   await user.save();
    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
