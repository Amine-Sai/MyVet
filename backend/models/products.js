const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  pic: [
    {
      type: String,
      required: true,
    },
  ],
  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    enum: [
      "Shoe",
      "Pants",
      "Hoodie",
      "TShirt",
      "Jacket",
      "Sweater",
      "Shorts",
      "Skirt",
      "Dress",
      "Hidjeb",
    ], //add types if needed
    required: true,
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Unisex"],
    required: true,
  },

  age: {
    type: String,
    enum: ["Adult", "Kids"],
    required: true,
  },

  sellerid: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  releaseDate: {
    type: Date,
    default: Date.now,
  },

  colors: [
    {
      sizes: [
        {
          value: {
            type: String,
            enum: ["", "S", "M", "L", "XL", "XXL"],
            default: "",
          },
          shoeSize: {
            type: Number,
            default: 0,
            max: 45,
          },

          inStock: {
            type: Number,
            required: true,
            default: 1,
          },
        },
      ],
      color: {
        type: String,
        default: "",
      },
    },
  ],

  

  comments: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        max: 255,
        min: 4,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 0,
      },
    },
  ],

  rating: {
    type: Number,
    default: 1,
    min: 1,
    max: 5,
  },

  promotion: {
    type: Number,
    default: 0,
  },

  sold: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("product", itemSchema);
module.exports = Product;
