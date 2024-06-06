const User = require("../models/user");
const Product = require("../models/products");

exports.getCart = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ message: "you must be logged in." });
    const user = await User.findById(req.userId);
    if (!user || user.Cart.length < 1)
      return res.status(404).json({
        message: "Cart is empty ",
        Cart: [],
      });

    let Carts = await Promise.all(
      user.Cart.map(async (cartItem) => {
        let productCart = await Product.findById(cartItem.productId);
        return productCart
          ? {
              colors: cartItem.colors,
              price: productCart.price * (1 - productCart.promotion),
              name: productCart.name,
              quantity: cartItem.quantity,
              pic: productCart.pic[0],
              productId: productCart._id,
            }
          : null;
      })
    );
    Carts = Carts.filter(Boolean);

    return res.status(200).json({ Cart: Carts });
  } catch (error) {
    res.status(500).json({ message: "Error occured." });
  }
};

exports.addtoCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Bad request" });
    const { productId } = req.params;
    const { colors, quantity } = req.body;

    if (!colors || !colors.color || !colors.sizes)
      return res.status(500).json({ message: "Bad request." });

    if (quantity < 1 || !quantity) quantity = 1;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product || product.sellerid == userId)
      return res.status(404).json({ message: "page not found." });

    const inCart = user.Cart.some(
      (cartItem) =>
        cartItem.productId == productId &&
        cartItem.colors.color == colors.color &&
        cartItem.colors.sizes.value == colors.sizes.value &&
        cartItem.colors.sizes.shoeSize == colors.sizes.shoeSize
    );
    if (!inCart) {
      user.Cart.push({
        quantity: quantity,
        productId: productId,
        colors: colors,
        price: product.price,
        name: product.name,
        pic: product.pic[0],
      });
    } else {
      user.Cart.map((cartItem) => {
        if (
          cartItem.productId == productId &&
          cartItem.colors.color == colors.color &&
          cartItem.colors.sizes.value == colors.sizes.value &&
          cartItem.colors.sizes.shoeSize == colors.sizes.shoeSize
        )
          cartItem.quantity += quantity;
        return cartItem;
      });
    }
    await user.save();
    res.status(201).json({ message: `${product.name} added to your cart` });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occurred" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Bad request" });

    const { productId } = req.params;
    const { colors } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productIndex = user.Cart.findIndex(
      (cartItem) =>
        cartItem.productId == productId &&
        cartItem.colors.color == colors.color &&
        cartItem.colors.sizes.value == colors.sizes.value &&
        cartItem.colors.sizes.shoeSize == colors.sizes.shoeSize
    );

    if (productIndex !== -1) {
      user.Cart.splice(productIndex, 1);
      await user.save();
      return res.status(200).json({ message: "Product removed from cart" });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error occurred" });
  }
};

exports.buyFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res.status(401).json({ message: "You must be logged in." });

    const user = await User.findById(userId);
    if (!user || user.Cart.length < 1)
      return res.status(404).json({ message: "Cart is empty." });

    let totalPrice = 0;

    // Loop through each item in the user's cart
    for (const cartItem of user.Cart) {
      const product = await Product.findById(cartItem.productId);
      if (!product)
        return res.status(404).json({
          message: `Product with ID ${cartItem.productId} not found.`,
        });

      const productColor = product.colors.find(
        (colors) => colors.color == cartItem.colors.color
      );

      console.log("Product:", productColor);

      if (!productColor) {
        return res.status(404).json({
          message: `${product.name} with ${cartItem.colors.color} color ran out of stock`,
        });
      }

      const size = productColor.sizes.find(
        (size) =>
          (size.shoeSize == cartItem.colors.sizes.shoeSize ||
            size.value == cartItem.colors.sizes.value) &&
          size.inStock >= cartItem.quantity
      );

      if (!size) {
        return res
          .status(404)
          .json({ message: `${product.name} ran out of stock` });
      }

      // Decrease stock quantity
      size.inStock -= cartItem.quantity;

      // Calculate item price
      const itemPrice =
        product.price * (1 - (product.promotion || 0)) * cartItem.quantity;
      totalPrice += itemPrice;

      const seller = await User.findById(product.sellerid);

      if (!seller) {
        return res
          .status(404)
          .json({ message: `Seller not found for product ${product.name}` });
      }
      seller.mySells.push({
        name: product.name,
        productId: product._id,
        pic: product.pic[0], // Assuming the product has the pic array
        price: itemPrice,
        status: "pending",
        date: new Date(), // Current date as the default value
        color: cartItem.colors[0].color,
        size: cartItem.colors[0].sizes[0].value,
        shoeSize: cartItem.colors[0].sizes[0].shoeSize,
        email: user.email, // Add buyer's email
        phoneNumber: user.phoneNumber, // Add buyer's phone number
        quantity: cartItem.quantity,
      });

      // Add to myOrders
      user.myOrders.push({
        name: cartItem.name,
        productId: cartItem.productId,
        pic: cartItem.pic || "",
        price: itemPrice,
        status: "pending",
        date: new Date(),
        color: cartItem.colors.color,
        size: cartItem.colors.sizes.value,
        shoeSize: cartItem.colors.sizes.shoeSize,
      });
    }

    // Save the changes to all products
    await Promise.all(
      user.Cart.map((cartItem) =>
        Product.findById(cartItem.productId).then((product) => product.save())
      )
    );

    // Clear the user's cart after purchase
    user.Cart = [];
    await user.save();

    res
      .status(200)
      .json({ message: "Purchase successful", totalPrice: totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" + error });
  }
};
