module.exports = (req, res, end) => {
  const token = req.headers.jwt;
  if (!token) {
    return end();
  }
  return res.status(401).json({ message: "Already authenticated" });
};
