const Admin = require("../models/admin");
const User = require("../models/user");
const Product = require("../models/products");
const blackList = require("../models/blacklist");
const bcrypt = require("bcryptjs");
const Math = require("mathjs");
require("dotenv").config();

sendMail = async (email, code) => {
  const transporterr = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: `${process.env.ADMIN_EMAIL}`,
      pass: `${process.env.password}`,
    },
  });

  const mailOptions = {
    from: `${process.env.ADMIN_EMAIL}`,
    to: email,
    subject: "Request to make a new admin",
    text: `Your verification code is: ${code}`,
  };

  transporterr.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const generateOTP = () => {
  return ("" + Math.random()).substring(2, 7);
};

exports.newAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await admin.findOne({ email: email });
    if (user) return res.status(400).json({ message: "User already exists!" });
    const code = generateOTP();
    await sendMail(email, code);
    res.status(200).json({ message: "Email sent!" });
  } catch (error) {
    res.status(500).json({ message: "Error occured" });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password)
      return res.status(401).json({ message: "Invalid input." });
    const user = await Admin.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: "admin already exists!" });

    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new Admin({
      email: req.body.email,
      password: hashedPassword,
      username: "admin",
      salt: salt,
    });

    await newUser.save();
    res.send({ message: "Admin added." });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: "Error occured." });
  }
};

// exports.searchUser = async (req, res) =>{
//   try {
//     const {email}
//   }
// }

exports.adminLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email });
    if (!admin) return res.status(404).json({ message: "Admin not found!" });
    const { password } = req.body;
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(404).json({ message: "Invalid username or password" });
    }

    // Generate the token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    res.status(200).json({
      jwt: token,
      admin: {
        id: admin._id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: "Error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ message: "Not authorized." });
    const admin = Admin.findById(req.userId);
    if (!admin) return res.status(401).json({ message: "Not authorized." });

    const update = req.body;

    if (!update)
      return res.status(400).json({ message: "please provide some changes" });

    const updated = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: update },
      { new: true }
    );
    if (!updated) return res.status(500).json({ message: "error occured." });
    const userId = updated.sellerid;
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        items: {
          pic: updated.pic,
          price: updated.price,
          name: updated.name,
        },
      },
    });
    return res.status(201).json({ message: "Changed applied!" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    await User.findByIdAndUpdate(product.sellerid, {
      $pullAll: {
        favorites: [{ id: productId }],
        products: [{ _id: productId }],
      },
    });
    res.status(201).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error occured" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    // add user to black list
    const blacklist = new blackList({
      email: user.email,
      phoneNumber: user.phoneNumber,
      reason: req.body.reason || "Violating our terms",
    });
    await blacklist.save();

    if (user.isSeller) await Product.deleteMany({ sellerId: user._id });
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error occured" });
  }
};

// array of the products, i get another array of edit which is an object

// products = [{_id,name,pic,price}] ||  edits [{indice: integer, change : newProduct'd Id }]

exports.editHome = async (req, res) => {
  try {
    const { products, edit } = req.body;
    for (let i = 0; i < edit.length(); i++) {
      let prod = await Product.findById(edit[i].change);
      if (!prod) continue;
      let newProduct = {
        _id: prod._id,
        name: prod.name,
        pic: prod.pic,
        price: prod.price,
      };
      products[edit[i].indice] = newProduct;
    }
    res.status(200).json({ message: "Home Updated." });
  } catch (error) {
    res.status(500).json({ message: "Error occured" });
  }
};

exports.upgradeToSeller = async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await User.findOneAndUpdate(userId, {
      $set: (isSeller = true),
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: "User upgraded to seller" });
  } catch (error) {
    res.status(500).json({ message: "Error occured" });
  }
};

exports.sellerRequests = async (req, res) => {
  try {
    const user = User.find({ upgradeRequest });
    res.status(200).json({ users: user });
  } catch (error) {}
};
