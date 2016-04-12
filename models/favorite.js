var mongoose = require('mongoose');

var favoriteSchema = mongoose.Schema ({
    beerId: String,
    userId: String
});

module.exports = mongoose.model('Favorite', favoriteSchema);