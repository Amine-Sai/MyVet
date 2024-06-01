const User = require("../models/user");
const Product = require("../models/products");

exports.getCart = async (req, res) => {
  if (!req.userId)
    return res.status(404).json({ message: "you must be logged in." });
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
            name: productCart.name,
            price: productCart.price * (1 - productCart.promotion),
            quantity: productCart.quantity,
            pic: productCart.pic[0],
            productId: productCart._id,
          }
        : null;
    })
  );
  const filteredCart = Carts.filter(Boolean);
  user.Cart = filteredCart;
  await user.save();

  return res.status(200).json({ Cart: filteredCart });
};

/*exports.addtoCart = async (req, res) => {
 try { const { productId, name, color, size, quantity, pic, price } = req.body;
 if (!req.userId)
  return res.status(404).json({ message: "you must be logged in." });
const user = await User.findById(req.userId);
console.log(user);


  if (!user) return res.status(404).json({ message: "User not found." });

  const existingProductIndex = user.Cart.findIndex(item =>
    item.productId.toString() === productId.toString() &&
    item.colors.some(colorItem => colorItem.color === color &&
      colorItem.sizes.some(sizeItem => sizeItem.value === size))
  );

  if (existingProductIndex !== -1) {
    // Product exists in the cart with the same color and size, increase quantity
    const existingProduct = user.Cart[existingProductIndex];
    const existingColorIndex = existingProduct.colors.findIndex(item => item.color === color);
    const existingSizeIndex = existingProduct.colors[existingColorIndex].sizes.findIndex(item => item.value === size);
    existingProduct.colors[existingColorIndex].sizes[existingSizeIndex].quantity += quantity;
    existingProduct.price += (price * quantity);
  } else {
    // Product does not exist in the cart, add new product
    user.Cart.push({
      productId: productId,
      colors: [{
        color: color,
        sizes: [{
          value: size,
          quantity: quantity
        }]
      }],
      price: price * quantity,
      name: name,
      pic: pic
    });
  }
  await user.save();
    res.status(200).json({ message: 'Product added/updated in the cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};*/
/*exports.removeProduct = async (req, res) => {
  try {
    const { productId, color, size } = req.body;
    const userId = req.userId; 
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const productIndex = user.Cart.findIndex(item =>
      item.productId.toString() === productId.toString() &&
      item.colors.some(colorItem => colorItem.color === color &&
        colorItem.sizes.some(sizeItem => sizeItem.value === size))
    );

    if (productIndex !== -1) {
      const product = user.Cart[productIndex];
      const colorIndex = product.colors.findIndex(item => item.color === color);
      const sizeIndex = product.colors[colorIndex].sizes.findIndex(item => item.value === size);

      // If quantity is greater than 0, decrement quantity
      if (product.colors[colorIndex].sizes[sizeIndex].quantity > 0) {
        product.colors[colorIndex].sizes[sizeIndex].quantity--;
        product.price -= product.colors[colorIndex].sizes[sizeIndex].price;
      }

      // If quantity becomes 0, remove the product from the cart
      if (product.colors[colorIndex].sizes[sizeIndex].quantity === 0) {
        product.colors[colorIndex].sizes.splice(sizeIndex, 1);
        if (product.colors[colorIndex].sizes.length === 0) {
          product.colors.splice(colorIndex, 1);
        }
      }

      // If all colors/sizes of the product are removed, remove the product from the cart
      if (product.colors.length === 0) {
        user.Cart.splice(productIndex, 1);
      }

      // Save the user document
      await user.save();
      res.status(200).json({ message: 'Product removed from cart successfully' });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};*/
/*exports.getCart = async (req, res) => {
  if (!req.userId) {
    return res.status(404).json({ message: "You must be logged in." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user || user.Cart.length < 1) {
      return res.status(404).json({ message: "Cart is empty." });
    }

    let Carts = await Promise.all(
      user.Cart.map(async (cartItem) => {
        let productCart = await Product.findById(cartItem.productId);
        if (productCart) {
          return {
            productId: productCart._id,
            pic: productCart.pic[0],
            price: productCart.price * (1 - productCart.promotion),
            name: productCart.name,
            colors: cartItem.colors,
            quantity: cartItem.colors.reduce((total, color) =>
              total + color.sizes.reduce((sum, size) => sum + size.quantity, 0), 0)
          };
        } else {
          return null;
        }
      })
    );

    const filteredCart = Carts.filter(Boolean);
    user.Cart = filteredCart;
    await user.save();

    return res.status(200).json({ Cart: filteredCart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};*/

exports.addtoCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Bad request" });
    const { productId } = req.params;
    const { colors } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "product not found." });

    const isinCart = user.Cart.some(
      (cartItem) =>
        cartItem.id == productId &&
        cartItem.colors.color == colors.color &&
        cartItem.colors.sizes == colors.sizes
    );
    if (!isinCart) {
      user.Cart.push({
        productId: productId,
        colors: colors,
      });
      res.status(201).json({
        message: `${product.name} is now in your Cart`,
      });
    } else {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: {
            Cart: {
              productId: productId,
              colors: colors,
            },
          },
        }
      );
      res.status(200).json({ message: `${product.name} removed from Cart` });
    }
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
