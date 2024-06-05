const bcrypt = require("bcryptjs");
const User = require("../models/user");
const blackList = require("../models/blacklist");
const jwt = require("jsonwebtoken");
const Math = require("mathjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.createUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ message: "User already exists!" });

    // check if user in black list
    const inBlack = await blackList.findOne({ email: email });
    if (inBlack)
      return res
        .status(400)
        .json({ message: "You're banned for violating our terms." });

    const { password, firstName, lastName, phoneNumber } = req.body;
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      products: [],
      favorites: [],
      Cart: [],
      Mysells: [],
      myorders: [],
      salt: salt,
    });

    await newUser.save();
    res.send({ message: "User registered." });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: "Error occured." });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not found!" });
    const { password } = req.body;
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(404).json({ message: "Invalid username or password" });
    }

    // Generate the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "2d",
    });

    res.status(200).json({
      jwt: token,
      user: {
        id: user._id,
        pic: user.pic,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isSeller: user.isSeller,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: "Error" });
  }
};
const generateOTP = () => {
  return ("" + Math.random()).substring(2, 7);
};

// password reset
const emailVerification = async (email, code) => {
  const transporterr = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "aa.denai@esi-sba.dz", //admin email
      pass: "xngp nddv ujmb ogmw", // admin pass
    },
  });

  const mailOptions = {
    from: "aa.denai@esi-sba.dz",
    to: email,
    subject: "Reset password",
    text: `Your verification code is: ${code}`,
  };
  transporterr.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.passResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not found." });
    console.log(user.resetPassword.attempts);
    if (
      user.resetPassword.attempts < 4 ||
      user.resetPassword.cooldown <= Date.now()
    ) {
      user.resetPassword.attempts++;
      console.log("can reset this time");
      const resetToken = generateOTP();
      user.resetPassword.string = resetToken;
      console.log("can reset this time", resetToken);
      user.resetPassword.expiresIn = Date.now() + 30 * 60 * 1000; // 30 minute timeout
      await emailVerification(email, resetToken);
    } else if (user.resetPassword.attempts >= 4) {
      console.log("can't reset this time");
      user.resetPassword.cooldown = Date.now() + 5 * 60 * 1000; // 5 minute cooldown
    }
    await user.save();
    res.json({ message: "Password reset email sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending password reset email." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ "resetPassword.string": token });
    if (!user || user.resetPassword.expiresAt > Date.now())
      return res.status(404).json({ message: "Invalid reset token" });

    if (user.resetPassword.expiresIn < Date.now()) {
      return res.status(400).json({ message: "Reset token has expired." });
    }

    const hashedPassword = await bcrypt.hash(password, user.salt);
    user.password = hashedPassword;
    user.resetPassword.attempts = 0;
    await user.save();
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password." });
  }
};

exports.userLogout = async (req, res) => {
  res.status(204).json({ jwt: "" });
};
