const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    pic: {
        type:String,
        required: true      
    },
    price: {
        type: Number,
        required: true
    },

    category : {
        type: String,
        required : true
    },

    rating : {
    type: Number,
    default: 0,
    },

    sellerid: {
        type: String,
        required: true 
    },
    date:
    {
        type : Date,
        default : Date()
    },
    colors: {
        sizes : {
            value : ["S","M","L","XL","XXL"],
            inStock: Number
        },
        type: [],
        required: true,
    },
}
);


module.exports = mongoose.model('product',itemSchema)
