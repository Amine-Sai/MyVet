const mongoose = require('mongoose');
const validator = require('validator');
const Item = require('./item');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, 'Enter a valid email!'],
  },
  password: {
    type: String,
    required: [true, 'Enter a valid password!'],
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  seller: {
    type: Boolean,
    default: false,
  },
  pic: String,
  joinDate: {
    type: Date,
    default: Date(),
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);