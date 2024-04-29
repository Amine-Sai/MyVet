const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const Buyer = require('../models/buyer');
const Product = require('../models/product');

// Create a new favorite list
router.post('/favorites', async (req, res) => {
    const { buyerId, productIds } = req.body;

    try {
        // Check if buyer exists
        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        // Find products by IDs
        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) {
            return res.status(404).json({ message: 'One or more products not found' });
        }

        // Create new favorite list
        const favorite = new Favorite({
            buyer: buyerId,
            products: products.map(product => product._id)
        });

        const newFavorite = await favorite.save();
        res.status(201).json(newFavorite);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all favorite lists
router.get('/favorites', async (req, res) => {
    try {
        const favorites = await Favorite.find().populate('products').populate('buyer');
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get count of buyers for a product
router.get('/favorites/product/:productId/buyer-count', async (req, res) => {
    const productId = req.params.productId;

    try {
        const buyersCount = await Favorite.countDocuments({ products: productId });
        res.json({ count: buyersCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
