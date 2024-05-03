const product = require("../models/products");
const User = require("../models/user");
const cookie = require("../middleware/cookieAuth");

exports.createProduct = async (req, res) => {
  try {
    const { userId, isSeller } = req;
    console.log(userId, req.params.sellerId, isSeller);
    if (userId != req.params.sellerId || !isSeller)
      return res.status(401).json({ message: "Unauthorized." });
    const { name, pic, price, category, colors, gender, age } = req.body;
    const newProduct = new product({
      name: name,
      pic: pic,
      price: price,
      category: category,
      colors: colors,
      sellerid: userId,
      gender: gender,
      age: age,
    });

    await newProduct.save();
    const user = await User.findById({ _id: userId });
    user.products.push({
      id: newProduct._id,
      pic,
      price,
      name,
    });

    await user.save();
    res.status(201).json({ message: "Product created successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occurred." });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const task = await product.findById(productId);

    if (!task) return res.status(404).json({ message: "Product unavailable" });

    res.status(201).json({ result: task });
  } catch (error) {
    res.status(500).json({ message: "error occurred" });
  }
};

exports.searchFilter = async (req, res) => {
  try {
    var { category, gender, age } = req.query;
    const { name } = req.body;

    // Initialize
    const search = {};
    if (name) {
      search.name = { $regex: `.*${name}.*`, $options: "i" };

      if (category) {
        search.category = { $regex: category, $options: "i" };
      }

      if (gender) {
        search.gender = { $regex: gender, $options: "i" };
      }

      if (age) {
        search.age = { $regex: age, $options: "i" };
      }
      console.log(search);
      let products = await product.find(search);
      return res.status(200).json({ result: products });
    }
    res.status(500).json({ message: "bad request" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const update = req.body;
    const userId = req.userId;
    const productId = req.params.productId;

    if (update) {
      const updated = await Product.findOneAndUpdate(
        { _id: productId, sellerId: userId },
        { $set: update },
        { new: true }
      );

      // update in seller's page

      if (updated)
        await User.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $addToSet: {
              items: {
                pic: updated.pic,
                price: updated.price,
                name: updated.name,
              },
            },
          }
        );
    } else {
      return res.status(400).json({ message: "please provide some changes" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.delProduct = async (req, res) => {
  try {
    const { userId } = req;
    const deleted = await User.findOneAndDelete({
      _id: req.params.productId,
      sellerId: userId,
    });
    if (deleted)
      await User.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $pull: {
            items: {
              id: req.params.id,
            },
          },
        }
      );
    else
      return res
        .status(500)
        .json({ err: "not authorized to delete this product" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.addComment = async (req, res) => {
  try {
    const userId = req;
    if (!userId) return;
    else {
      product = await product.findById({ _id: req.params });
      if (!product) {
        res.status(404).json({ message: "product not found!" });
        return;
      }
      const { rating, content } = req.body;
      if (!rating) return;
      await product.comments.push({
        user: userId,
        content: content,
        rating: rating || 0,
      });
      productRating(product);
      await product.save();
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.productRating = async (product) => {
  try {
    let sumOfRatings = 0;
    let count = product.comments.length();
    for (const comments of product.comments) {
      if (comments.rating > 0) sumOfRatings += product.comment.rating;
    }
    const avgRating = Math.round(sumOfRatings / count);

    product.rating = avgRating;
    await product.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
