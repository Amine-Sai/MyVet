const router = require('express').Router();
const {createProduct,
     getProduct,
     searchFilter, 
     updateProduct,
     delProduct } = require('../controllers/productControl');
const cookieAuth = require('../middleware/cookieAuth');
const {dataValidator} = require('../middleware/validator')


// create a product
router.post('/:sellerid',[dataValidator, cookieAuth], (req,res) => createProduct)

// search & filter 
router.get('/search/:category&:gender&:age', (req,res) => searchFilter)

// load product page
router.post('/search',(req,res)=> getProduct) 

//update a single product
router.put('/product/:id', [dataValidator, cookieAuth], (req,res) => updateProduct);

//delete a single product
router.delete('/product/:id',[dataValidator, cookieAuth],(req,res) => delProduct )

    

module.exports = router;