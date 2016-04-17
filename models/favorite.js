var mongoose = require('mongoose');

var favoriteSchema = mongoose.Schema ({
    userId: String,
    beerId: String
});

module.exports = mongoose.model('Favorite', favoriteSchema);