const router = require('express').Router();
const {createProduct,getProduct,
     catFetch, 
     sellFetch,
     updateProduct,
     delProduct } = require('../controllers/productControl');
const cookieAuth = require('../middleware/cookieAuth');

router.post('/product/:id', cookieAuth, createProduct)

         // product search and filter
router.get('/search', cookieAuth, (req, res, next) => {
  
    if (action === 'getProduct') {
      getProduct(req, res, next);
    } else if (action === 'catFetch') {
      catFetch(req, res, next);
    } else if (action === 'sellFetch') {
      sellFetch(req, res, next);
    } else {
      res.status(400).json({ msg: 'Invalid action' });
    }
});

//update a single product
router.put('/product/:id', cookieAuth, updateProduct);

//delete a single product

router.delete('/product/:id',cookieAuth,delProduct )

    

module.exports = router;