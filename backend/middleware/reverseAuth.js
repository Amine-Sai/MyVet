module.exports = (req, res, next) => {
  const token = req.headers.jwt;
  if (!token) {
    return next();
  }
  return res.status(401).json({ message: "Already authenticated" });
};
