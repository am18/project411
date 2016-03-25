var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    email: String
});

module.exports = mongoose.model('User', userSchema);