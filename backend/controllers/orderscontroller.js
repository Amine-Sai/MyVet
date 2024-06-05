const User = require("../models/user");
const Product = require("../models/products");

/*exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Bad request" });

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "product not found." });

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
      res.status(200).json({
        message: `${product.name} removed from favorites`,
        isFavorite: !isFavorite,
      });
    }
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occurred" });
  }
};*/

exports.getmyOrders = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(404).json({ message: "you must be logged in." });
    const user = await User.findById(req.userId);
    console.log(user.myOrders);
    if (!user || user.myOrders.length < 1)
      return res.status(404).json({ message: "Page not available" });

    let orders = await Promise.all(
      user.myOrders.map(async (order) => {
        let ord = await Product.findById(order.productId);
        return ord
          ? {
            name: order.name,
            productId: order.productId,
            pic: order.pic, 
            price: order.price,
            status: order.status,
            date: order.date, 
            color: order.color,
            size: order.size,
            shoeSize : order.shoeSize,
            }
          : null;
      })
    );
   orders = orders.filter((ord) => ord!== null);
    
    return res.status(200).json({ myOrders: orders });
  } catch (error) {
    res.status(400).json({ message: "Error occurred" + error});
  }
};