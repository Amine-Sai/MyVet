const product = require('../models/products')
const User = require('../models/user')
const cookie = require('../middleware/cookieAuth')
const jwt = require('jsonwebtoken')



// create, get, search with filter, update and delete

exports.createProduct = async(req,res)=>{
    try {
        const {id , seller} = body.cookie.jwt
        if (!id || !seller) { res.status(401).json({msg: "Unauthorized."});
        return;
         }

        else {
            const {name, pic, price, category, colors} = req.body
            const newProduct = new product({
                name: name,
                pic: pic,
                price: price,
                category: category,
                colors: colors,
                sellerid: id,
            })
        await newProduct.save()
        const user = await User.findById({_id : id}) 
        user.items.push({
          _id: savedProduct._id,
          pic,
          price,
          name,
        });
        await user.save();
        res.status(201).json({ msg: "Product created successfully." });
    } 
  } catch (error) {
        res.status(500).json({msg:"error occurred."})
    }
}


exports.getProduct = async(req,res)=>{
        try {
            let {id} = req.params
            const task = await product.findOne({_id: id})
            if(!task) {
                res.status(404).json({msg:'Product unavailable'})
            }
            else{
                res.status(201).json({task})
            }
        } catch (error) {
            res.status(500).json({msg:"error occurred"})
        }
    }



    exports.searchFilter = async (req, res) => {
      try {
        const { category, gender, age, name } = req.body;
    
        // Initialize
        const search = {};
    
        // fiters
        if (category) search.category = category;
        if (gender) search.gender = gender;
        if (age) search.age = age;
    
        // If a name is provided, find substrings within product names that match the query
        if (name) {
          search.name = { $regex: name, $options: 'i' };
        }
    
        let products = await product.find(search).select('name,pic,price');
    
        res.status(200).json({ product });
      } catch (error) {
        res.status(500).json({ msg: "error occured" });
      }
    };


    //updating a product
    const isSeller = async (req, res) => {
        const product = await product.findOne({ id: req.params.id });
        if (!product || product.sellerid !== req.user.id) {
          return false;
        }
        return product; 
        
      };

    exports.updateProduct = async (req, res) => {
          try {
            Product = await isSeller(req, res);

            // update product db
            if (Product || req.body) {
                if (req.body.pic) Product.pic = req.body.pic
                if (req.body.name) Product.name = req.body.name
                await Product.save()
            }
            else return res.status(500).json({err:"not authorized to edit this product"});
      
          // update seller's page
          const seller = await User.findById(Product.seller);
          const itemIndex = seller.items.findIndex(item => item._id.toString() === req.params.id);
          if (itemIndex !== -1) {
            if (req.body.pic) seller.items[itemIndex].pic = req.body.pic;
            if (req.body.name) seller.items[itemIndex].name = req.body.name;
            await seller.save();
          }
      
          res.status(201).json({ updatedProduct });
        } catch (error) {
          res.status(500).json({ msg: error });
        }
      };
    
     // deleting a product

     exports.delProduct = async (req, res) => {
        try {
          Product = await isSeller(req, res);
      
          // delete product db
          if (Product) {
            await Product.remove();
          } else {
            return res.status(500).json({ err: "not authorized to delete this product" });
          }
      
          // delete seller's page
          const seller = await User.findById(Product.seller);
          const itemIndex = seller.items.findIndex(item => item._id.toString() === req.params.id);
          if (itemIndex !== -1) {
            seller.items.splice(itemIndex, 1);
            await seller.save();
          }
      
          res.status(204).json();
        } catch (error) {
          res.status(500).json({ msg: error });
        }
      };



      exports.addComment = async (req, res ) => {
        try {
          cookie.cookieAuth(req,res)
        if (!req.user) return 
        else {
          product = await product.findById({_id : req.params})
          if (!product) {
            res.status(404).json({msg:"No such product found!"});
            return;
          }
          else {
            if (!req.body.rating) return 
            else{ 
              await product.comments.push({
                user: req.user.user,
                content : req.body.content,
                rating : req.body.rating || 0
              })
              productRating(product)
              await product.save();
            }
          }
        }
      } catch (error) {
        res.status(500).json({ msg: error });
      }
    }  


exports.productRating = async (product) => {
  try {
    // Schedule the task to run every week on Sunday

        let sumOfRatings = 0;
        let count = product.comments.length()
        for (const comments of product.comments) {
          if (comments.rating > 0) sumOfRatings += comment.rating
        
      }
        const avgRating = Math.round(sumOfRatings / countOfRatings);

        product.rating = avgRating;
        await product.save();
      
      } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
