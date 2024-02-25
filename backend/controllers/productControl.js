const product = require('../modules/products')
const User = require('../models/user')
const userId = req.user

    const getProduct = async(req,res)=>{
        try {
            let {id} = req.params
            const task = await product.findOne({_id: id})
            if(task === null) {
                res.status(404).json({msg:'Product unavailable'})
                next()
            }
            else{
                res.status(201).json({task})
            }
        } catch (error) {
            res.status(500).json({msg:"error occurred"})
        }
    }

    const createProduct = async(req,res)=>{
        try {
            const user = User.findById(userId)
            if(!user || user.seller != true) throw res.status(401).json({msg: "Unauthorized."})
            else{
                const {name,pic,price,category,colors} = req.body
                const newProduct = new product({
                    name,
                    pic,
                    price,
                    category,
                    colors,
                    userId,
                })
                await newProduct.save()
            }
        } catch (error) {
            res.status(500).json({msg:"error occurred."})
        }
    }
    const catFetch = async (req,res)=>{
        try {
            const {category} = req.body
            let product = product.find({category})
            if (product.length){
                res.status(200).json({product})
            }
            else {
                res.status(404).json({msg :"product not found."})
            }
        } catch (error) {
            res.status(500).json({msg:"error occured"})
        }
    }
    const sellFetch = async (req,res)=>{
        try {
            const {id} = req.body
            let product = product.find({sellerid: id})
            if (product.length){
                res.status(200).json({product})
            }
            else {
                res.status(404).json({msg :"no products found."})
            }
        } catch (error) {
            res.status(500).json({msg:"error occured"})
        }
    }

    //updating a product
    const isSeller = async (req, res ,next) => {  const product = await product.findOne({id: req.params.id})
        if (!product) return res.status(404).json({ msg: 'Product not found.' });
        if (product.sellerid !== req.user.id) return res.status(401).json({ msg: 'Unauthorized.' });
        next();
      };

    const updateProduct = async (req, res) => {
        try {
          await isSeller(req, res);
          const updatedProduct = await product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
          res.status(201).json({ updatedProduct });
        } catch (error) {
          res.status(500).json({ msg: error });
        }
      };  
    

     // deleting a product

    const delProduct = async(req,res)=>{
        try {
          await isSeller(req, res);
          const updatedProduct = await product.findoneAndDelete({ _id: req.params.id }, req.body, { new: true });
          res.status(201).json({ updatedProduct });
        } catch (error) {
          res.status(500).json({ msg: error });
        }
      };  

    module.exports = {
        getProduct,
        createProduct,
        catFetch,
        sellFetch,
        updateProduct,
        delProduct
    }
    