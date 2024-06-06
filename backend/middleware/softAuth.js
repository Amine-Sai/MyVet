const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    console.log("middle ware is excuting"); // looks like it isn't
    if (req.headers.jwt) {
      const token = req.headers.jwt;
      const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

      req.userId = decodedToken.id;
    }
    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token." });
  }
};
