const report = require("../models/report");
const User = require("../models/user");
require("dotenv").config();

emailVerification = async (email, report) => {
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
    subject: "report",
    text: `report id: ${report} `,
  };

  transporterr.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = async (req, res) => {
  try {
    if (!req.userId)
      return res
        .status(401)
        .json({ message: "You must be Logged in to send a report." });

    const user = await User.findById(req.userId);
    if (!user)
      return res
        .status(500)
        .json({ message: "Bad request, try to login again." });

    const { reason, body, sellerId } = req.body;

    const Report = new report({
      reason: reason,
      id: req.userId,
      body: body,
      sellerId: sellerId,
    });
    await Report.save();

    emailVerification(process.env.ADMIN_EMAIL, Report._id);
    res
      .status(200)
      .json({ message: "Report sent, we'll respond to it as soon as we can." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
};
