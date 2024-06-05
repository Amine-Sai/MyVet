const mongoose = require("mongoose");
const blacklist = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  reason: {
    type: String,
    default: "Violating our terms.",
  },
});

const blackList = mongoose.model("blackList", blacklist);
module.exports = blackList;
