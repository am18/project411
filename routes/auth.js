
module.exports = function (app, passport) {

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { scope: ['email'], successRedirect: '/', failureRedirect: '/login' }));

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}