const Product = require("../models/products");
const User = require("../models/user");

exports.createProduct = async (req, res) => {
  try {
    let des = "";
    if (!req.params.sellerId)
      return res.status(404).json({ message: "Page not found." });
    const user = await User.findById(req.userId);
    if (!user || !user.isSeller)
      return res.status(401).json({ message: "Unauthorized." });
    let { name, pic, price, category, colors, gender, age, description } =
      req.body;
    if (!name || !pic || !price || !age || !gender)
      return res
        .status(501)
        .json({ message: "Please provide the required info for the product." });

    if (!description) des = "";
    else {
      des = description.substring(0, 200);
      if (description.length > 200) {
        des += "...";
      }
    }

    if (!colors) colors = [];
    const colors1 = typeof colors === "string" ? JSON.parse(colors) : colors;

    const newProduct = new Product({
      name: name,
      pic: pic,
      price: price,
      category: category,
      age: age,
      colors: colors1,
      sellerid: req.userId,
      gender: gender,
      description: des,
    });
    await newProduct.save();

    user.products.push({
      _id: newProduct._id,
      name: name,
      pic: pic[0],
      price: price,
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

    const owner = await User.findById(product.sellerid);
    if (!owner) return res.status(500).json({ message: "Error occurred" });
    const { pic, firstName, lastName } = owner;

    const seller = { firstName, lastName, pic };

    let heart = false;
    console.log(req.userId);
    if (req.userId) {
      const user = await User.findById(req.userId);
      if (!user)
        return res.status(401).json({ message: "Invalid token, login again" });
      heart = user.favorites.some((favorites) => favorites.id == productId);
    }

    res.status(200).json({ result: product, isFavorite: heart, seller });
  } catch (error) {
    console.log(error);
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

    let products = await Product.find(search).sort({ price: sortOrder });
    console.log(products);
    if (products.length == 0)
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

    //  console.log(update);

    if (!update) {
      return res.status(400).json({ message: "Please provide some changes" });
    }

    let updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, sellerid: userId },
      { $set: update },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let user = await User.findById(userId);
    if (!user) return console.log("cookie issues bud");
    let arr = user.products;

    for (let prod in arr) {
      if (prod._id == updatedProduct._id) {
        prod.name = updatedProduct.name;
        prod.price = updatedProduct.price;
        prod.pic = updatedProduct.pic[0];
      }
    }

    console.log(user);

    await updatedProduct.save();
    await user.save();
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Occured." });
  }
};

exports.delProduct = async (req, res) => {
  try {
    if (!req.userId || !req.params.productId)
      return res.status(404).json({ message: "page not found" });

    const { productId } = req.params;
    const deleted = await Product.findByIdAndDelete({
      _id: productId,
      sellerid: req.userId,
    });

    if (deleted)
      await User.findByIdAndUpdate(req.userId, {
        $pull: {
          products: {
            _id: productId,
          },
        },
      });
    else
      return res
        .status(500)
        .json({ err: "not authorized to delete this product" });
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
};

exports.addComment = async (req, res) => {
  try {
    if (!req.userId)
      return res
        .status(401)
        .json({ message: "You must be logged in to comment." });

    if (!req.params) return res.status(500).json({ message: "Bad request" });

    let user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized." });

    let product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "product not found!" });
    }
    const { rating, content } = req.body;
    if (!rating) return;
    product.comments.push({
      user: req.userId,
      content: content,
      rating: rating,
      date: Date.now(),
      name: `${user.firstName} ${user.lastName}`,
    });
    productRating(product);
    res.status(200).json({ message: "Comment added!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const productRating = async (product) => {
  if (product.comments.length < 1) return;

  let sumOfRatings = 0;
  let count = product.comments.length;

  for (const comments of product.comments) {
    if (comments.rating > 0) sumOfRatings += comments.rating;
  }
  const avgRating = Math.round(sumOfRatings / count);

  product.rating = avgRating;
  await product.save();
};

exports.homePage = async (req, res) => {
  try {
    // hard coded incoming !!
    const mostSold = await Product.find({}).sort({ sold: 1 }).limit(7);

    const promoted = await Product.find({ promotion: { $gt: 0 } })
      .sort({ sold: 1 })
      .limit(7);
    const Shoe = await Product.find({
      category: { $regex: "shoe", $options: "i" },
    }).sort({ sold: 1 });
    const Pants = await Product.find({
      category: { $regex: "pants", $options: "i" },
    }).sort({ sold: 1 });
    const Hoodie = await Product.find({
      category: { $regex: "hoodie", $options: "i" },
    }).sort({ sold: 1 });
    const TShirt = await Product.find({
      category: { $regex: "TShirt", $options: "i" },
    }).sort({ sold: 1 });
    const Jacket = await Product.find({
      category: { $regex: "Jacket", $options: "i" },
    }).sort({ sold: 1 });
    const Sweater = await Product.find({
      category: { $regex: "Sweater", $options: "i" },
    }).sort({ sold: 1 });
    const Shorts = await Product.find({
      category: { $regex: "Shorts", $options: "i" },
    }).sort({ sold: 1 });
    const Skirt = await Product.find({
      category: { $regex: "Skirt", $options: "i" },
    }).sort({ sold: 1 });
    const Dress = await Product.find({
      category: { $regex: "Dress", $options: "i" },
    }).sort({ sold: 1 });
    const Hidjeb = await Product.find({
      category: { $regex: "Hidjeb", $options: "i" },
    }).sort({ sold: 1 });
    const Jewelry = await Product.find({
      category: { $regex: "Jewelry", $options: "i" },
    }).sort({ sold: 1 });

    res.status(200).json({
      mostSold: mostSold,
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
      Jewelry: Jewelry,
    });
  } catch (error) {
    res.status(500).json({ message: "bad request" });
  }
};
