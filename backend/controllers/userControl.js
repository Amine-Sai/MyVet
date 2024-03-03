const User = require('../models/user')

exports.userPage = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ msg: "User not found." });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error occurred." });
    }
  };

exports.userRating = async (req, res) => {
  try {
    const { id } = req.params;

  } catch (error) {
    res.status(500).json({ msg: "Error occurred." }); 
  }
}

//   exports.sellerSearch = async (req,res)=>{
//     try {
//         const {firstName, lastName} = req.body
//         let seller = User.find({firstName,lastName})
//         if (seller) {
//             res.status(200).json({users_found: seller})
//         } 
//         else{
//             res.status(404).json({msg:"user not found"})
//         }
//     } catch (error) {
//         res.status(500).json({msg:"error occured"})
//     }
// }