var mongoose = require('mongoose');

var searchSchema = mongoose.Schema ({
    term: String
});

module.exports = mongoose.model('Search', searchSchema);
