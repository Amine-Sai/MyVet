const User = require("../models/user");

module.exports = async (req, res) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    const id = decodedToken.id;

    if (!buyer) {
      return res.status(404).json({ message: "You must be logged in first" });
    }
    const { action } = req.query;
    const { productId, price, pic, name } = req.body;

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
        $pull: { favorites: req.params.id },
      });
      res.status(200).json({ message: "Favorite removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

