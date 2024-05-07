const User = require("../models/user");
const Product = require("../models/products");

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Bad request" });
    const { productId } = req.params;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "product not found." });

    const isFavorite = user.favorites.some(
      (favorite) => favorite.id == productId
    );
    if (!isFavorite) {
      user.favorites.push({
        id: productId,
        pic: product.pic[0],
        name: product.name,
        price: product.price * (1 - product.promotion),
      });
      res.status(201).json({
        message: `${product.name} is now in your favorites`,
      });
    } else {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: {
            favorites: {
              id: productId,
            },
          },
        }
      );
      res
        .status(200)
        .json({ message: `${product.name} removed from favorites` });
    }
    console.log();
    await user.save();
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
