var express = require('express');
var router = express.Router();
var request = require('request');

var User = require('../models/user');

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

function getFriends(friendIds, callback) {
    // use friendIds to query mongoose for user objects
    var friends = [];
    var count = friendIds.length;
    for(var i = 0; i < friendIds.length; i++) {
        (function (id) {
            User.findOne({ userId: id}, function(err, user) {
                    if (err) {
                        handleError(err);
                    }
                    else if(user) {
                        count--;
                        friends.push(user);
                        console.log(friends);
                        // doesn't work if all users are not in database
                        if (count <= 0) {
                            callback(friends);
                        }
                    }
                    else {
                        // no friends found
                    }
                }
            );
        })(friendIds[i]);
    }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (typeof req.user != 'undefined') {
        getFriendIds(req, function(friendIds) {
            console.log(friendIds);
            getFriends(friendIds, function(friends){
                console.log(friends);
            });
        });
    }
    else {
        // error message
        // you must login to access friends page
    }
    res.render('friends');
});

module.exports = router;