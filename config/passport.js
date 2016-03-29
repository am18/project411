var User = require('../models/user');
var configAuth = require('./auth');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (passport) {

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {

        }
    ));
};

