const User = require("../models/user");

module.exports = async (req, res) => {
  try {
    const id = req.userId;
    const { action } = req.query;
    const { productId } = req.params;
    const { price, pic, name } = req.body;

    console.log(id, action, productId);
    if (!action || !id) return res.status(400).json({ msg: "Bad request" });

    if (action === "favorite") {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ msg: "User not found" });

      console.log(user);
      const isFavorite = user.favorites.some(
        (favorite) => favorite._id.toString() == productId
      );

      if (!isFavorite) {
        user.favorites.push({
          _id: id,
          pic,
          name,
          price,
        });
        console.log(user);

        await user.save();
        res.status(201).json({ msg: `${name} is now in your favorites` });
      } else {
        return res
          .status(400)
          .json({ msg: "Product already in your favorites" });
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
    res.status(400).json({ msg: "Error occurred" });
  }
};
