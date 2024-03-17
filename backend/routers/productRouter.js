const router = require('express').Router();
const {createProduct,
     getProduct,
     searchFilter, 
     updateProduct,
     delProduct } = require('../controllers/productControl');
const cookieAuth = require('../middleware/cookieAuth');

// create a product
router.post('/:sellerid', cookieAuth(req,res), (req,res) => createProduct)

// search & filter 
router.get('/search/:catagory?/:sortby?:price_lowest?:price_highest', (req,res) => searchFilter)

// load product page
router.post('/search',getProduct(req,res,next)) 

//update a single product
router.put('/product/:id', cookieAuth, (req,res) => updateProduct);

//delete a single product
router.delete('/product/:id',cookieAuth,(req,res) => delProduct )

    

module.exports = router;