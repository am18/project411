
module.exports = function (app, passport) {

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { scope: ['email', 'user_friends'], successRedirect: '/', failureRedirect: '/login' }));

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user.userId);
        return next();
    }

    res.redirect('/');
}