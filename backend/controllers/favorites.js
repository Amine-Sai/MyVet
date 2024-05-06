const User = require("../models/user");
const Product = require("../models/products");
const mongoose = require("mongoose");

exports.toggleFavorite = async (req, res) => {
  try {
    const id = req.userId;
    const { productId } = req.params;

    if (!id) return res.status(400).json({ message: "Bad request" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "product not found." });

    const prodId = new mongoose.Types.ObjectId(productId);
    const isFavorite = user.favorites.some((favorite) =>
      favorite._id.equals(prodId)
    );

    if (!isFavorite) {
      user.favorites.push({
        _id: productId,
        pic: product.pic,
        name: product.name,
        price: product.price(1 - product.promotion),
      });

      await user.save();
      res.status(201).json({
        message: `${name} is now in your favorites`,
      });
    } else {
      await User.findByIdAndUpdate(id, {
        $pull: {
          favorites: {
            _id: productId,
          },
        },
      });
      res.status(200).json({ message: `${name} removed from favorites` });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occurred" });
  }
};

exports.getFavorites = async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.status(200).json({ favorites: user.favorites });
};
