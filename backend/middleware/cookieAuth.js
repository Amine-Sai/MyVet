const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) return res.redirect("/login");

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

    // exp check
    if (decodedToken.exp <= Date.now() / 1000) {
      res.clearCookie("jwt");
      return res.redirect("/login");
    }

    req.userId = decodedToken.id;
    req.isSeller = decodedToken.seller;

    next();
  } catch (err) {
    res.clearCookie("jwt");
    return;
  }
};
