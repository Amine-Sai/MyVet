const User = require("../models/user");

exports.userPage = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error occurred." });
  }
};

exports.myArticles = async (req, res) => {
  try {
    const { userId } = req.header;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Page not found." });
    if (!user.isSeller)
      return res
        .status(404)
        .json({ message: "Upgrade to seller to get this feature." });
    res.status(200).json({ articles: user.products });
  } catch (error) {
    res.status(500).json({ message: "Error occurred." });
  }
};

exports.upgradeRequest = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
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
