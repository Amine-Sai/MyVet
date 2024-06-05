module.exports = (req, res, end) => {
  if (!req.headers.jwt) {
    return end();
  }
  return res.status(401).json({ message: "Already authenticated" });
};
