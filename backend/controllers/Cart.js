const User = require("../models/user");
const mongoose = require("mongoose");
const Product = require("../models/products");

exports.getCart = async (req, res) => {
  if (!req.userId) return res.status(404).json({ message: "User not found." });

  const userId = req.userId;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found." });
  res.status(200).json({ Cart: user.Cart });
};

/*exports.BuyFromCart = async (req, res) => {

  if(!req.userId) return res.status(404).json({ message: "User not found." });
  if (req.params) return res.status(400).json({ message: "Bad request" });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  
  // if the cart is empty then there is no buy button
  let totalPrice = 0;
  for (const { price, quantity } of user.Cart) {
    let product = await Product.findById(req.params);
    if (!product) {
      res.status(500).json({msg: "Error occured"});
      continue;
    }
    if (quantity > stock)
      {
        quantity = stock;
        return res
        .status(400)
        .json({
          message: `Not enough stock for product ${user.Cart.colors.name}`,
        });}

    let productPrice = (price - price * product.promotion) * quantity;
    totalPrice += productPrice;
  }
  res.status(200).json({Total: totalPrice})
};*/
exports.addtoCart = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(404).json({ message: "User not found." });

    const {
      productId,
      name,
      color,
      size,
      quantity,
      pic, // pic is a string not an array
      price,
    } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const inCart = user.Cart.some((prod) => prod.productId == productId);
    if (!inCart) {
      user.Cart.push({
        colors: { color, size },
        name: name,
        pic: pic,
        price: price,
        quantity: quantity || 1,
        productId: productId,
      });
      res.status(201).json({
        message: `${name} added to the cart`,
      });
    } else {
      user.Cart = user.Cart.map((product) => {
        if (product.productId === productId) {
          product.quantity++;
        }
        return product;
      });
    }

    await user.save();
    res
      .status(200)
      .json({ message: "Product added/updated in the cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.refreshprice = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    for (let product of user.Cart) {
      let totalPrice = 0;

      for (let colorItem of product.colors) {
        for (let sizeItem of colorItem.sizes) {
          const productVariant = await Product.findOne({
            productId: product.productId,
            color: colorItem.color,
            size: sizeItem.value,
          });

          if (productVariant) {
            sizeItem.price = productVariant.price;

            totalPrice = productVariant.price;
          } else {
            console.error(
              `Product variant not found: ${product.productId}, ${colorItem.color}, ${sizeItem.value}`
            );
          }
        }
      }

      product.price = totalPrice;
    }

    await user.save();

    res.status(200).json({ message: "Cart prices refreshed successfully" });
  } catch (error) {
    console.error("Error refreshing cart prices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; // resfresh price will be automatically updated when we have get cart but the question is when can i get the reduced price if there promotion
// another question will i put the refresh price in the getcart method or in the  router of the id cart

exports.BuyproductofCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let totalPrice = 0;

    for (let product of user.Cart) {
      for (let colorItem of product.colors) {
        for (let sizeItem of colorItem.sizes) {
          const productVariant = await Product.findOne({
            productId: product.productId,
            color: colorItem.color,
            size: sizeItem.value,
          });

          if (productVariant) {
            sizeItem.price = productVariant.price;
            totalPrice += productVariant.price * sizeItem.quantity;

            productVariant.colors.inStock -= sizeItem.quantity;
          } else {
            console.error(
              `Product variant not found: ${product.productId}, ${colorItem.color}, ${sizeItem.value}`
            );
          }
        }
      }
    }
    user.Cart = [];
    await user.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
