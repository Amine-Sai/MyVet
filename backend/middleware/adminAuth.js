const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

module.exports = async (req, res, next) => {
  const token = req.headers.jwt;

  if (!token) return res.redirect("/admin/login");

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

    // exp check
    if (decodedToken.exp <= Date.now() / 1000) {
      return res.sendStatus(401).end();
    }
    const admin = await Admin.findById(decodedToken.id);
    if (!admin) return res.status(401).json({ message: "Unauthorized." });
    req.AdminId = decodedToken.id;

    next();
  } catch (err) {
    res.clearCookie("jwt");
    return;
  }
};
