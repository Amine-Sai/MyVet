const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Enter a valid password!"],
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  isSeller: {
    type: Boolean,
    default: false,
  },
  pic: {
    type: String,
    default: "/default/pic", // change later
  },
  joinDate: {
    type: Date,
    default: Date(),
  },
  phoneNumber: {
    type: String,
    required: true,
  },

  products: [
    {
      pic: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      _id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
  ],
  favorites: [
    {
      pic: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      _id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
  ],
  salt: {
    type: String,
    required: true
  },

  upgradeRequest: {
    type: Boolean,
    default : true
  }
});

module.exports = mongoose.model("User", userSchema);
