const jwt = require("jsonwebtoken");
const math = require("mathjs");
module.exports = async (req, res, next) => {
  if (req.headers.jwt) {
    const token = req.headers.jwt;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

      // Check if token has expired
      if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
        req.userId = null;
      } else {
        req.userId = decodedToken.id;
      }
    } catch (err) {
      console.error(err);
      req.userId = null;
    }
  } else {
    req.userId = null;
  }
  next();
};
