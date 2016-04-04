var mongoose = require('mongoose');

var beerSchema = mongoose.Schema ({
    id: String,
    name: String,
    description: String,
    abv: String,
    image: String
});

module.exports = mongoose.model('Beer', beerSchema);