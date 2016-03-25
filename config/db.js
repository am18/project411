var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/beerbuddy');

mongoose.connection.on('open', function () {
    console.log('Connected to mongo server.');
    // Test user model
    //var User = require('../models/user');
    //
    //var testUser = User({
    //    id: 'test',
    //    firstName: 'test',
    //    lastName: 'test',
    //    email: 'test'
    //});
    //
    //testUser.save(function (err) {
    //    if (err) return handleError(err);
    //    console.log("test user created");
    //});
});
mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});
