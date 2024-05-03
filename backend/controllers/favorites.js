const User = require("../models/user");
const mongoose = require("mongoose");

exports.toggleFavorite = async (req, res) => {
  try {
    const id = req.userId;
    const { action } = req.query;
    const { productId } = req.params;
    const { price, pic, name } = req.body;

    if (!action || !id) return res.status(400).json({ message: "Bad request" });

    if (action == "favorite") {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const prodId = new mongoose.Types.ObjectId(productId);
      const isFavorite = user.favorites.some((favorite) =>
        favorite._id.equals(prodId)
      );

      if (!isFavorite) {
        user.favorites.push({
          _id: productId,
          pic,
          name,
          price,
        });

        await user.save();
        res.status(201).json({ message: `${name} is now in your favorites` });
      } else {
        return res
          .status(400)
          .json({ message: "Product already in your favorites" });
      }
    } else {
      await User.findByIdAndUpdate(id, {
        $pull: {
          favorites: {
            _id: productId,
          },
        },
      });
      res.status(200).json({ message: "Favorite removed successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occurred" });
  }
};

exports.getFavorites = async (req, res) => {
  const userId = req.userId;ص
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.status(200).send(user.favorites);
};
