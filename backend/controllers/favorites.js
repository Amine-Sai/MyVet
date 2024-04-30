const User = require("../models/user");

exports.createFavorite = async (req, res) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    id = decodedToken.id;

    if (!buyer) {
      return res.status(404).json({ message: "You must be logged in first" });
    }

    const { productId, price, pic, name } = req.body;

    const user = await User.find({ _id: id });
    await user.favorites.push({
      _id: productId,
      price,
      name,
      pic,
    });

    await User.save();
    res.status(201).json({ msg: `${name} is now in your favorites` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.unfavorite = async (req, res) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    id = decodedToken.id;
    let user = User.findById(id);
    const itemIndex = user.favorites.findIndex(
      (item) => item._id.toString() == req.params.id
    );
    if (itemIndex !== -1) {
      user.favorites.splice(itemIndex, 1);
      await user.save();
    }
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};
