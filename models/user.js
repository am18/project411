var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id: String,
    token: String,
    firstName: String,
    lastName: String,
    email: String
});

module.exports = mongoose.model('User', userSchema);