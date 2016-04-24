var mongoose = require('mongoose');
mongoose.connect('mongodb://project411:beerbuddy@ds013891.mlab.com:13891/beerbuddy');

mongoose.connection.on('open', function () {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});