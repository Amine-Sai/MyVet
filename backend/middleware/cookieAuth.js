const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.jwt;

  if (!token) {
    end();
    return res.status(401).json({ message: "Login Required." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

    // exp check
    if (decodedToken.exp <= Date.now() / 1000) {
      return res.sendStatus(401).end();
    }
    req.userId = decodedToken.id;
    next();
  } catch (err) {
    return res.sendStatus(401).end();
  }
};
