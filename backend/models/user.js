const mongoose = require("mongoose");
const validator = require("validator");

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
      id: {
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

      id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
  ],
  // salt : {
  //   type : String,
  //   default :
  //   // required: true
  // }
});

module.exports = mongoose.model("User", userSchema);
