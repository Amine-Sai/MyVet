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
        res.status(503).json({ msg: "bad request" });
    }
}

const createUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await getUser(req, res);
        if (user) {
            res.status(400).json({msg:'User already exists!'});
        } else {
            const {password, firstName, lastName } = req.body;
            if(password.length <8){
                res.status(400).json({msg: "Password is too short."})
            }else{
                const hashedPassword = await bcrypt.hash(password, process.env.SECRET);
                const newUser = new User({
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
            });
            await newUser.save();
            //redirect
            res.redirect('/login')
        }
    }
    } catch (error) {
        res.status(503).json({msg:'Error',user});
    }
}

const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await getUser(req, res);
      if (!user) {
        res.status(404).json({ msg: 'User not found!' });
      } else 
      {
        const isValidPassword = await bcrypt.compare(password, user.password);
  
        if (!isValidPassword) {
          return res.status(404).json({ message: 'Invalid username or password' });
        }
        // Generate the token
        const token = jwt.sign({ id: user._id}, process.env.JWT_TOKEN, { expiresIn: '2h' });; 
        res.redirect('/home').cookie('jwt',token,{httpOnly : true})
      }
    } catch (error) {
  
      res.status(503).json({ msg: 'Error' });
    }
  };
const userLogout = async (req,res) =>{

    //clearCookie
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    res.clearCookie('jwt').redirect('/login')
}  
  

module.exports = {
    createUser,
    userLogin,
    getUser
}
