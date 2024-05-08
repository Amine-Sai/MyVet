const express = require("express");
//const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../models/user");
//const auth = require("../middleware/auth");

/*      
profile : firstname,last name ,  email, password ; pic 
delete account 
shopping address 
privacy and policy  



*/
exports.updateEmail = async (req, res) => {
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

    res.status(200).json({ message: "password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};// make it until i understand the relation between salt and password 
// in the update password the front will do the confirm password
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
};
