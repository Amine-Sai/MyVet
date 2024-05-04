const Product = require("../models/products");
const product = require("../models/products");
const User = require("../models/user");

exports.createProduct = async (req, res) => {
  try {
    const { userId, isSeller } = req;
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
    const product = await Product.findById(productId);

    if (!product)
      return res.status(404).json({ message: "Product unavailable" });

    let heart = false;
    if (req.userId) {
      const user = await User.findOne({
        _id: product.sellerid,
        favorites: { $elemMatch: { _id: mongoose.Types.ObjectId(productId) } },
      });
      if (user) heart = true;
    }

    res.status(200).json({ result: product, isFavorite: heart });
  } catch (error) {
    res.status(500).json({ message: "Error occurred" });
  }
};

exports.searchFilter = async (req, res) => {
  try {
    const { category, gender, age, sort, name } = req.query;
    // Initialize
    const search = {};
    if (name) {
      search.name = { $regex: `.*${name}.*`, $options: "i" };
    }
    if (category) {
      search.category = { $regex: category, $options: "i" };
    }

    if (gender) {
      search.gender = { $regex: gender, $options: "i" };
    }

    if (age) {
      search.age = { $regex: age, $options: "i" };
    }
    let sortOrder = 1;
    if (sort == "d") sortOrder = -1;

    if (!search) return;

    let products = await product.find(search).sort({ price: sortOrder });

    if (!products)
      return res.status(404).json({ message: "No products found." });
    res.status(200).json({ result: products });
  } catch (error) {
    res.status(500).json({ message: "Bad request" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { userId } = req;
    const { productId } = req.params;
    const update = req.body;

    if (!update) {
      return res.status(400).json({ message: "Please provide some changes" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, sellerId: userId },
      { $set: update },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await User.updateOne(
      { _id: userId, "products._id": productId },
      {
        $set: {
          "products.$.pic": updatedProduct.pic,
          "products.$.price": updatedProduct.price,
          "products.$.name": updatedProduct.name,
        },
      }
    );

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delProduct = async (req, res) => {
  try {
    const { userId } = req;
    const deleted = await Product.findOneAndDelete({
      _id: req.params.productId,
      sellerId: userId,
    });

    if (deleted)
      await User.updateOne(
        { _id: product.sellerid },
        {
          $pullAll: {
            favorites: [{ _id: mongoose.Types.ObjectId(productId) }],
            products: [{ _id: mongoose.Types.ObjectId(productId) }],
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
    const { productId } = req.body;
    let prod = product.findById(productId);
    let count = prod.comments.length();
    for (const comments of prod.comments) {
      if (comments.rating > 0) sumOfRatings += prod.comment.rating;
    }
    const avgRating = Math.round(sumOfRatings / count);

    prod.rating = avgRating;
    await product.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.homePage = async (req, res) => {
  try {
    const promoted = await product.find({ promotion: { $gt: 0 } }).limit(7);
    const Shoe = await product.find({
      category: { $regex: "shoe", $options: "i" },
    });
    const Pants = await product.find({
      category: { $regex: "pants", $options: "i" },
    });
    const Hoodie = await product.find({
      category: { $regex: "hoodie", $options: "i" },
    });
    const TShirt = await product.find({
      category: { $regex: "T-Shirt", $options: "i" },
    });
    const Jacket = await product.find({
      category: { $regex: "Jacket", $options: "i" },
    });
    const Sweater = await product.find({
      category: { $regex: "Sweater", $options: "i" },
    });
    const Shorts = await product.find({
      category: { $regex: "Shorts", $options: "i" },
    });
    const Skirt = await product.find({
      category: { $regex: "Skirt", $options: "i" },
    });
    const Dress = await product.find({
      category: { $regex: "Dress", $options: "i" },
    });
    const Hidjeb = await product.find({
      category: { $regex: "Hidjeb", $options: "i" },
    });

    res.status(200).json({
      promoted: promoted,
      Shoe: Shoe,
      Pants: Pants,
      Hoodie: Hoodie,
      TShirt: TShirt,
      Jacket: Jacket,
      Sweater: Sweater,
      Shorts: Shorts,
      Skirt: Skirt,
      Dress: Dress,
      Hidjeb: Hidjeb,
    });
  } catch (error) {
    res.status(500).json({ message: "bad request" });
  }
};
