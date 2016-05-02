var mongoose = require('mongoose');
var configAuth = require('./auth');

mongoose.connect(configAuth.mongo.mlab);

mongoose.connection.on('open', function () {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});