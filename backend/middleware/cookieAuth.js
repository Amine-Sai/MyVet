const jwt = require("jsonwebtoken");
const Math = require("mathjs");

module.exports = async (req, res, next) => {
  if (!req.headers.jwt) {
    res.status(401).json({ message: "Login Required." });
    res.end();
    return;
  }

  const token = req.headers.jwt;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

    // Check if token has expired
    if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: "Token has expired." });
    }

    req.userId = decodedToken.id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token." });
  }
};
