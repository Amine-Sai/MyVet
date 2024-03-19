const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('Favorite', favoriteSchema);
