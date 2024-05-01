const product = require("../models/products");
const User = require("../models/user");
const cookie = require("../middleware/cookieAuth");

exports.createProduct = async (req, res) => {
  try {
    const { userId, isSeller } = req;
    if (userId != req.params.sellerid || !isSeller) {
      return res.status(401).json({ msg: "Unauthorized." });
    } else {
      const { name, pic, price, category, colors } = req.body;
      const newProduct = new product({
        name: name,
        pic: pic,
        price: price,
        category: category,
        colors: colors,
        sellerid: userId,
      });
      await newProduct.save();
      const user = await User.findById({ _id: userId });
      user.items.push({
        _id: newProduct._id,
        pic,
        price,
        name,
      });
      await user.save();
      res.status(201).json({ msg: "Product created successfully." });
    }
  } catch (error) {
    res.status(500).json({ msg: "error occurred." });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await product.findById(id);
    if (!task) {
      res.status(404).json({ msg: "Product unavailable" });
    } else {
      res.status(201).json({ result: task });
    }
  } catch (error) {
    res.status(500).json({ msg: "error occurred" });
  }
};

exports.searchFilter = async (req, res) => {
  try {
    const { category, gender, age, name } = req.query;

    // Initialize
    const search = {};

    // fiters
    if (category) search.category = category;
    if (gender) search.gender = gender;
    if (age) search.age = age;

    if (name) {
      search.name = { $regex: name, $options: "i" };
    }

    let products = await product
      .find(search)
      .select("name", "pic", "price", "_id");

    res.status(200).json({ result: products });
  } catch (error) {
    res.status(500).json({ msg: "error occured" });
  }
};

//updating a product
const isSeller = async (req, res) => {
  if (!products || products.sellerid !== req.userId) return false;

  return product;
};

exports.updateProduct = async (req, res) => {
  try {
    const update = req.body;
    const userId = req.userId;
    const productId = req.params._id;

    if (Object.keys(update).length > 0) {
      const updated = await Product.findOneAndUpdate(
        { _id: productId, sellerId: userId },
        { $set: update },
        { new: true }
      );
      // update in seller's page
      if (Object.keys(updated).length > 0)
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
      return res.status(400).json({ msg: "please provide some changes" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

exports.delProduct = async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({
      _id: req.params.id,
      sellerId: req.userId,
    });
    if (Object.keys(deleted).length > 0)
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
    res.status(500).json({ msg: error });
  }
};

exports.addComment = async (req, res) => {
  try {
    cookie.cookieAuth(req, res);
    if (!req.user) return;
    else {
      product = await product.findById({ _id: req.params });
      if (!product) {
        res.status(404).json({ msg: "product not found!" });
        return;
      } else {
        if (!req.body.rating) return;
        else {
          await product.comments.push({
            user: req.user.user,
            content: req.body.content,
            rating: req.body.rating || 0,
          });
          productRating(product);
          await product.save();
        }
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

exports.productRating = async (product) => {
  try {
    let sumOfRatings = 0;
    let count = product.comments.length();
    for (const comments of product.comments) {
      if (comments.rating > 0) sumOfRatings += comment.rating;
    }
    const avgRating = Math.round(sumOfRatings / count);

    product.rating = avgRating;
    await product.save();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
