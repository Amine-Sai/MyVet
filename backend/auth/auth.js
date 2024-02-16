const bcrypt = require('bcryptjs');
const User = require('../modules/users');
const generateToken = require('./tokengen')
const jwt = require('jsonwebtoken')

const getUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        res.status(500).json({ msg: "bad request" });
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const user = await getUser(req, res);
        if (user) {
            res.status(400).json({msg:'User already exists!'});
        } else {
            if(password.length <8){
                res.status(400).json({msg: "Password is too short."})
            }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email,
                password: hashedPassword,
                firstName,
                lastName,
            });
            await newUser.save();
            const accessToken = jwt.sign(user,process.env.JWT_TOKEN)
            //redirect
            res.status(201).json({ message: 'User registered successfully' });
        }
    }
    } catch (error) {
        res.status(500).json({msg:'Error',user});
    }
}

const userLogin = async (req, res) => {

    try {
  
      const { email, password } = req.body;
  
      const user = await getUser(req, res);
  
      if (!user) {
  
        res.status(404).json({ msg: 'User not found!' });
  
      } else {
  
        const isValidPassword = await bcrypt.compare(password, user.password);
  
        if (!isValidPassword) {
  
          return res.status(404).json({ message: 'Invalid username or password' });
  
        }
        // Generate the token

        const token = generateToken(user,process.env.JWT_TOKEN); 
  
        res.status(200).json({ message: 'Login successful', token });
  
      }
  
    } catch (error) {
  
      res.status(500).json({ msg: 'Error' });
  
    }
  
  };
  

module.exports = {
    createUser,
    userLogin,
    getUser
}
