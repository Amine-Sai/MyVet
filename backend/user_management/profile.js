const user = require('../modules/users')
const product = require('../modules/product')
const {getUser} = require('../auth/auth')
const {sellfetch} = require('../product_managment/items')

const findUser = async(req,res)=>{
    try {
        const {id} = req.params
        const userr = user.findOne({id})
        if (userr){
            if (userr.seller = true){
                const items = sellfetch(userr._id)
                if (items){
                    res.status(200).json({user,items})
                }
            }
            else{
                res.status(200).json({user})
            }
        }
        else {
            res.status(404).json({msg:"user not found"})
        }
    } catch (error) {
        res.status(500).json({msg: "error occurred."})
    }
}


const searchUser = async(req,res)=>{
    try {
        const {username} = req.body
        const users = user.find({username})
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