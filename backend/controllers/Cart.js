const User = require("../models/user");
const mongoose = require("mongoose");
const Product = require('../models/products'); 

exports.getCart = async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  
  if (!user) return res.status(404).json({ message: "User not found." });
  res.status(200).json({ Cart: user.Cart });
};
/*exports.BuyFromCart = async (req, res) => {
  // cheking if the user exsite////////////////////////////////////////
  const id = req.userId;
  const { productId } = req.params;
  if (!id) return res.status(400).json({ message: "Bad request" });

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  /////////////////////////////////////////////////////////////////////////
  // if the cart is empty then there is no buy button
  let totalPrice = 0;
  for (const { prices, quantity } of user.Cart) {
    const prices = user.Cart;
    if (quantity > stock)
      return res
        .status(400)
        .json({
          message: `Not enough stock for product ${user.Cart.colors.name}`,
        });

    const productPrice = (price - price * product.promotion) * quantity;
    totalPrice += productPrice;
  }
};*/
exports.addtoCart = async (req, res) => {
 try { const { productId, name, color, size, quantity, pic, price } = req.body;
  const user = await User.findById(userId);
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
};
exports.removeProduct = async (req , res) => { 

 try { const { productId,  color, size } = req.body;
  
  
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  
  
  
  
  
  
  const productIndex = this.Cart.findIndex(item =>
  item.productId.toString() === productId.toString() &&
  item.colors.some(colorItem => colorItem.color === color &&
    colorItem.sizes.some(sizeItem => sizeItem.value === size))
);

if (productIndex !== -1) {
  const product = this.Cart[productIndex];
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
    this.Cart.splice(productIndex, 1);
  }

  // Save the user document
  await this.save();
}



 } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}
  }
 exports.refreshprice = async (req , res ) => {
    try {
      const user = await User.findById(req.user.id); 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
     
      for (let product of user.Cart) {
        let totalPrice = 0;
  
       
        for (let colorItem of product.colors) {
          
          for (let sizeItem of colorItem.sizes) {
            
            const productVariant = await Product.findOne({
              productId: product.productId,
              color: colorItem.color,
              size: sizeItem.value
            });
  
            if (productVariant) {
              
              sizeItem.price = productVariant.price;
             
              totalPrice = productVariant.price ;
            } else {
              console.error(`Product variant not found: ${product.productId}, ${colorItem.color}, ${sizeItem.value}`);
            }
          }
        }
  
        product.price = totalPrice;
      }
  
      
      await user.save();
  
      
      res.status(200).json({ message: 'Cart prices refreshed successfully' });
    } catch (error) {
      console.error('Error refreshing cart prices:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
    



  }// resfresh price will be automatically updated when we have get cart but the question is when can i get the reduced price if there promotion 
  // another question will i put the refresh price in the getcart method or in the  router of the id cart 


  exports.BuyproductofCart = async (req , res ) => {
    
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
    



// whats up niggas





  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

  }