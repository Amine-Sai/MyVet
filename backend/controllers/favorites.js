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
    if (!product) return res.status(404).json({ message: "product not found." });
    
    const isFavorite = user.favorites.some(
      (favorite) => favorite.id == productId
    );
    if (!isFavorite) {
      user.favorites.push({
        id: productId,
      });
      res.status(201).json({
        message: `${product.name} is now in your favorites`,
        isFavorite: !isFavorite,
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
        .json({ 
          message: `${product.name} removed from favorites`,
          isFavorite: !isFavorite,
      });
    }
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occurred" });
  }
};

exports.getFavorites = async (req, res) => {
  if (!req.userId)
    return res.status(404).json({ message: "you must be logged in." });
  const user = await User.findById(req.userId);
  console.log(user);
  if (!user || user.favorites.length < 1)
    return res.status(404).json({ message: "Page not available" });

  let favs = await Promise.all(
    user.favorites.map(async (favorite) => {
      let prod = await Product.findById(favorite.id);
      return prod
        ? {
            id: prod._id,
            pic: prod.pic[0],
            price: prod.price * (1 - prod.promotion),
            name: prod.name,
          }
        : null;
    })
  );
  const filteredFavs = favs.filter(Boolean);
  user.favorites = filteredFavs;
  await user.save();

  return res.status(200).json({ favorites: filteredFavs });
};