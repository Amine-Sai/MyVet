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

    if (quantity < 1 || !quantity) quantity = 1;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "product not found." });

    const inCart = user.Cart.some(
      (cartItem) =>
        cartItem.id == productId &&
        cartItem.colors.color == colors.color &&
        cartItem.colors.sizes.value == colors.sizes.value &&
        cartItem.colors.sizes.ShoeSize == colors.sizes.ShoeSize
    );
    if (!inCart) {
      user.Cart.push({
        quantity: quantity,
        productId: productId,
        colors: colors,
      });
    } else {
      user.Cart.map((cartItem) => {
        if (cartItem.productId == productId) cartItem.quantity += quantity;
        return cartItem;
      });
    }
    res.status(201).json({ message: `${product.name} added to your cart` });
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occurred" });
  }
};

/* exports.BuyproductofCart = async (req , res ) => {


    
  try { const user = await User.findById(req.user.id); 
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let totalPrice = 0;

    for (let product of user.Cart) {
      

     
      for (let colorItem of product.colors) {
        
        for (let sizeItem of colorItem.sizes) {
          
          const productVariant = await Product.findOne({
            productId: product.productId,
            color: colorItem.color,
            size: sizeItem.value
          });

          if (productVariant) {
            
            sizeItem.price = productVariant.price;
            totalPrice += productVariant.price * sizeItem.quantity;

          productVariant.colors.inStock -= sizeItem.quantity;
          } else {
            console.error(`Product variant not found: ${product.productId}, ${colorItem.color}, ${sizeItem.value}`);
          }
        }
      }
    }
     user.Cart = [];
     await user.save();
    









  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

  }*/


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
        cartItem.colors.sizes.ShoeSize == colors.sizes.ShoeSize
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