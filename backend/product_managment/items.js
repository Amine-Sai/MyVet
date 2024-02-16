 const product = require('../modules/products')

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
            const {name,pic} = req.body
            const sellerid = user._id
            const newProduct = new product({
                name,
                pic,
                sellerid,
            })
            await newProduct.save()
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
            let product = product.find({_id: id})
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


    const updateProduct = async (req, res) => {
        try {
            let {id} = req.params;
            const result = await product.findOneAndUpdate({username}, req.body);
            
            (result === null)
                ? res.status(404).json({msg:'product not found'})
                : res.status(201).json({msg:'Updated successfully!'});
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    };
    
    const delProduct = async(req,res)=>{
        try {
            let {id} = req.params;
            const result = await product.findOneAndDelete({_id:id},req.body);
    
            (result === null) 
                ? res.status(404).json({msg:'product not found'})
                : res.status(201).json({msg:'deleted succesfully!'})
        } catch (error) {
            res.status(500).json({msg:error})
        }
    }

    module.exports = {
        getProduct,
        createProduct,
        catFetch,
        sellFetch,
        updateProduct,
        delProduct
    }
    