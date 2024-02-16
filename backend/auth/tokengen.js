const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id}, process.env.JWT_TOKEN, {
    expiresIn: '3h',
  });
};

module.exports = generateToken;