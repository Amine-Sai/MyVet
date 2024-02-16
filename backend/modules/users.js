const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, validate: [validator.isEmail,'Enter a valid email!']  },
    password: {type : String, required: [true,'Enter a valid password!']},
    firstName :{type:  String, required: true},
    lastName: {type:String, required: true},
    //check account type.
    seller : {type : Boolean, default: false},
    pic: String,
    joinDate :{ type : Date, default: Date()}
});


module.exports = mongoose.model('User',userSchema)
