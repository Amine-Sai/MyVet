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
  username: {
    type: String,
    required : true
  },

  salt: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("admin", adminSchema);
