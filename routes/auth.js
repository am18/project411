
module.exports = function (app, passport) {

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { scope: ['email', 'user_friends'], successRedirect: '/', failureRedirect: '/login' }));

};