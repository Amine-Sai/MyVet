const User = require("../models/user");
const Product = require("../models/products");

exports.getMySells = async (req, res) => {
    try {
      if (!req.userId)
        return res.status(404).json({ message: "You must be logged in." });
  
      const user = await User.findById(req.userId);
      if (!user || user.mySells.length < 1)
        return res.status(404).json({ message: "No sales available." });
  
      let sells = await Promise.all(
        user.mySells.map(async (sell) => {
          let product = await Product.findById(sell.productId);
          return product
            ? {
                email: sell.email,
                date: sell.date,
                pic: sell.pic,
                phoneNumber: sell.phoneNumber,
                quantity: sell.quantity,
                productId: sell.productId,
                color: sell.color,
                size: sell.size,
              }
            : null;
        })
      );
      sells = sells.filter((sell) => sell !== null);
  
      return res.status(200).json({ mySells: sells });
    } catch (error) {
      res.status(400).json({ message: "Error occurred: " + error });
    }
  };
  

