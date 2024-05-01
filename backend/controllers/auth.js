const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400).json({ msg: "User already exists!" });
    } else {
      const { password, firstName, lastName } = req.body;
      const hashedPassword = password;
      const salt = await bcrypt.genSalt(10);
      await bcrypt.hash(password, salt);
      const newUser = new User({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        products: [],
        favorites: [],
        salt: salt
      });

      await newUser.save();
      res.send({ msg: "user registered in" });
    }
  } catch (error) {
    console.log(error);
    res.status(503).json({ msg: "Error occured." });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    } else {
      const { password } = req.body;
      const isValidPassword = user.password == password;
      // await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res
          .status(404)
          .json({ message: "Invalid username or password" });
      }
      // Generate the token
      const token = jwt.sign(
        { id: user._id, seller: user.isSeller },
        process.env.JWT_TOKEN,
        { expiresIn: "2d" }
      );

      res.cookie({ jwt: token }).send({ user });
    }
  } catch (error) {
    console.log(error);
    res.status(503).json({ msg: "Error" });
  }
};

exports.userLogout = async (req, res) => {
  res.clearCookie("jwt").redirect("/login");
};
