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
        enum : ["Shoe", "Vest", "Pants", "Accessories", "Hoodie", "T-Shirt"],   //add types if needed
        required : true
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
              ShoeSize: {
                type: Number,
                default: 0,
                max: 45,
              },

              inStock: {
                type:Number,
                required: true
              },
            }
           ],
        },
      ],

      comments : [
        {
          user : {
          type: mongoose.Types.ObjectId,
          ref: "User"
          },
          content : {
            type: String,
            max : 255,
            min : 4
          },
          rating : {
           type: Number,
           required: true,
           min: 1,
           max : 5,
           default: 0
          },
        }
      ],

      rating : {
        type: Number,
        default: 1,
        min: 1,
        max : 5,
      }
  }
);

const Product = mongoose.model('product',itemSchema)
module.exports =Product