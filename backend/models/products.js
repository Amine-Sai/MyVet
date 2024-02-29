const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    pic: 
        [{      
        type:String,
        required: true 
        }],
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

    gender: {
      type : String, 
      enum : ["Male","Female"],
      required : true
    },
    age: { 
      type : String, 
      enum : ["Adult","kids"],
      required : true
    },
    sellerid: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    releaseDate:
    {
        type : Date,
        default : Date.now
    },
    
    colors: [
        {
          sizes: [
            {
              value: { 
                type: String, 
                enum: ['S', 'M', 'L', 'XL', 'XXL'],
                required: true,
              },
              inStock: {
                type:Number,
                required: true
              },
            }
           ],
        },
      ],
  }
);

const Product = mongoose.model('product',itemSchema)
module.exports =Product