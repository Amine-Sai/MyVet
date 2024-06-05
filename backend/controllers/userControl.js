const User = require("../models/user");

const adminMail = async (email, phoneNumber, pic) => {
  const transporterr = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "aa.denai@esi-sba.dz", //admin email
      pass: "xngp nddv ujmb ogmw", // admin pass
    },
  });

  const mailOptions = {
    from: "aa.denai@esi-sba.dz",
    to: email,
    subject: "Upgrade request",
    text: `Mail: ${email}, Phone number: ${phoneNumber}, Registre Commerce validation: ${pic}`,
  };
  transporterr.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.userPage = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ message: "You must be logged in." });

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      pic: user.pic,
      isSeller: user.isSeller,
      _id: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred." });
  }
};

exports.myArticles = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized." });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Page not found." });
    if (!user.isSeller)
      return res
        .status(404)
        .json({ message: "Upgrade to seller to get this feature." });
    res.json({ data: user.products, message: "Articles retrieved." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred." });
  }
};

exports.upgradeRequest = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ message: "you must be logged in." });
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.upgradeRequest)
      return res
        .status(409)
        .json({ message: "You've already requested an upgrade." });
    user.upgradeRequest = true;

    const { pic } = req.body;
    await adminMail(user.email, user.phoneNumber, pic || "No image provided.");
    await user.save();

    res
      .status(200)
      .json({ message: "Request sent! We'll keep you updated in your email." });
  } catch (error) {
    res.status(500).json({ message: "Error occurred." });
  }
};
