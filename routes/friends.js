var express = require('express');
var router = express.Router();
var request = require('request');

function getFriendIds(req, callback) {
    var friendIds = [];

    var options = { method: 'GET',
        url: 'https://graph.facebook.com/me/friends/',
        qs: { access_token: req.user.token },
        headers:
        { 'postman-token': '0a5cad48-27c9-3e0a-6f3e-d1b5b860b2f1',
            'cache-control': 'no-cache' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var obj = JSON.parse(body);
        var data = obj['data'];
        for (i = 0; i < data.length; i++) {
            friendIds.push(data[i]['id']);
        }
        callback(friendIds);
    });
}

function getFriends(friendIds) {
    // use friendIds to query mongoose for user objects
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (typeof req.user != 'undefined') {
        getFriendIds(req, function(friendIds) {
            console.log(friendIds);
            getFriends(friendIds);
        });
    }
    else {
        // error message
        // you must login to access friends page
    }
    res.render('friends');
});

module.exports = router;