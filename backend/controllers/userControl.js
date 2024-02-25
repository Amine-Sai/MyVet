const User = require('../models/user')

exports.userPage = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id).populate('items');
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ msg: "User not found." });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error occurred." });
    }
  };


exports.searchUser = async(req,res)=>{
    try {
        const {username} = req.body
        const users = User.find({username})
        if (users) {
            res.status(200).json({result: users})
        } 
        else{
            res.status(404).json({msg:"user not found"})
        }
    } catch (error) {
        res.status(500).json({msg: "error occurred."})
    }
}