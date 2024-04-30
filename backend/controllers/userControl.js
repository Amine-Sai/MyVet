const User = require("../models/user");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Error occurred." });
  }
};
