const User = require("../models/user");

module.exports = async (req, res) => {
  try {
    const id = req.userId;
    const { action, productId } = req.query;
    const { price, pic, name } = req.body;

    if (action == "favorite") {
      await User.findByIdAndUpdate(id, {
        $addToSet: {
          favorites: {
            _id: productId,
            price,
            name,
            pic,
          },
        },
      });

      res.status(201).json({ msg: `${name} is now in your favorites` });
    } else {
      await User.findByIdAndUpdate(id, {
        $pull: {
          favorites: {
            _id: req.params.id,
          },
        },
      });
      res.status(200).json({ message: "Favorite removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ msg : "technical error" });
  }
};
