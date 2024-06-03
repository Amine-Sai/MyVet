const User = require("../models/user");

exports.userPage = async (req, res) => {
  try {
    if (!req.params)
      return res.status(401).json({ message: "you must be logged in." });
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      pic: user.pic,
      isSeller: user.isSeller,
      _id: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred." });
  }
};

exports.myArticles = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized." });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Page not found." });
    if (!user.isSeller)
      return res
        .status(404)
        .json({ message: "Upgrade to seller to get this feature." });
    res.json({ data: user.products, message: "Articles retrieved." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred." });
  }
};

exports.upgradeRequest = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ message: "you must be logged in." });
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.upgradeRequest)
      return res
        .status(409)
        .json({ message: "You've already requested an upgrade." });
    user.upgradeRequest = true;
    await user.save();
    res
      .status(200)
      .json({ message: "Request sent! We'll keep you updated in your email." });
  } catch (error) {
    res.status(500).json({ message: "Error occurred." });
  }
};
