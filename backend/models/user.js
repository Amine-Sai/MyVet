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
    default: Date.now(),
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
      id: {
        type: mongoose.Types.ObjectId,
      },
    },
  ],

  Cart: [
    {
      colors: {
        sizes: {
          value: {
            type: String,
            enum: ["S", "M", "L", "XL", "XXL", ""],
          },
          ShoeSize: {
            type: Number,
            default: 0,
            max: 45,
          },
        },
        color: {
          type: String,
        },
      },

      price: {
        type: Number,
      },

      name: {
        type: String,
      },

      quantity: {
        type: Number,
        default: 1,
      },

      pic: {
        type: String,
      },

      productId: {
        type: mongoose.Types.ObjectId,
      },
    },
  ],
  mySells: [
    {
      email: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now(),
      },

      phoneNumber: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      productId: {
        type: mongoose.Types.ObjectId,
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
    },
  ],
  myOrders: [
    {
      name: {
        type: String,
      },
      productId: {
        type: mongoose.Types.ObjectId,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "on the way ", "shipped", "delivered", "bought"], //add types if needed
      },
    },
  ],
  salt: {
    type: String,
    required: true,
  },

  upgradeRequest: {
    type: Boolean,
    default: false,
  },

  resetPassword: {
    string: {
      type: String,
      default: "b69be89d982eed865b7bb9cdc5d18b671fc6e7601cd" + Date.now(),
    },
    attempts: {
      type: Number,
      default: 0,
    },
    cooldown: {
      type: Date,
      default: Date.now(),
    },
    expiresIn: {
      type: Date,
      default: Date.now(),
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
