const admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../models/products");


exports.createAdmin = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await admin.findOne({ email: email });
      if (user) {
        res.status(400).json({ message: "User already exists!" });
      } else {
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new admin({
          email: email,
          password: hashedPassword,
          username: "admin",
          salt: salt,
        });
  
        await newUser.save();
        res.send({ message: "User registered." });
      }
    } catch (error) {
      console.log(error);
      res.status(503).json({ message: "Error occured." });
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

exports.deleteProduct = async (req,res) =>{
  try {
    const {productId} = req.params
    await Product.findOneAndDelete(productId)
    res.status(201).json({message: "Product deleted successfully"})
  } catch (error) {
    res.status(500).json({message: "Error occured"})
  }
}