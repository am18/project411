var User = require('../models/user');
var configAuth = require('./auth');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (passport) {

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        console.log("deserialize");
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'name', 'emails']
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({'userId': profile.id}, function(err, user){
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    }
                    else {
                        var newUser = new User();
                        newUser.userId = profile.id;
                        newUser.token = accessToken;
                        newUser.firstName = profile.name.givenName;
                        newUser.lastName = profile.name.familyName;
                        newUser.email = profile.emails[0].value;

                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            else {
                                return done(null, newUser);
                            }
                        });
                    }
                });
                console.log('logged in');
            });
        }
    ));
};

