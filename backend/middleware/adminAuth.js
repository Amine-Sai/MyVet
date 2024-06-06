const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

module.exports = async (req, res, next) => {
  const token = req.headers.jwt;

  if (!token) return res.status(401).json({ message: "unauthorized" }).end();

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

    // exp check
    if (decodedToken.exp <= Date.now() / 1000) {
      return res
        .status(401)
        .json({ message: "cookie expired, please login again." })
        .end();
    }
    const admin = await Admin.findById(decodedToken.id);
    if (!admin) return res.status(401).json({ message: "Unauthorized." });
    req.userId = decodedToken.id;

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error occured" });
  }
};
