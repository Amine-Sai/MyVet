const jwt = require('jsonwebtoken');

exports.cookieAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decodedToken.id;

    // Check if the token has expired
    if (decodedToken.exp <= Date.now() / 1000) {
      res.clearCookie('jwt');
      return res.redirect('/login');
    }

    next();
  } catch (err) {
    res.clearCookie('jwt');
    return res.redirect('/login');
  }
};