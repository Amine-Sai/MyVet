const mongoose = require('mongoose');

const report = new mongoose.Schema({
    reason : {
        type : String,
        enum : [
            "Wrong Item Received",
            "Damaged or Defective Product",
            "Incorrect Size or Fit",
            "Missing Items",
            "Quality Issues",
            "Misleading Product Description",
            "Color Mismatch",
            "Unauthorized Charges",
          ],
        required: true
    },

    id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    body: {
        type: String,
        max : 255,
    },
    sellerId:{
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true,
    },
})

module.exports = mongoose.model('report', report);
