var express = require('express');
var router = express.Router();
var configAuth = require('../config/auth');
var Beer = require('../models/beer');
var Search = require('../models/search');
var Favorite = require('../models/favorite');
var User = require('../models/user');

var request = require('request');
var obj;
var data;
var userId;

// take search input and return results
function search(input, callback) {
    var beerObjects = [];
    var options = { method: 'GET',
        url: 'http://api.brewerydb.com/v2/search/',
        qs:
        { key: configAuth.breweryDB.apiKey,
            q: input,
            type: 'beer' },
        headers:
        { 'postman-token': 'f2af4ae2-3be0-0eda-0e25-35fc1e2c0dc2',
            'cache-control': 'no-cache' } };

    Search.findOne({'term': input}, function(err, search){
        if (err) {
            handleError(err);
        }
        if (search){
            // get all beers with search.term
            Beer.find({ name: new RegExp(input+'+', "i")}, function(err, beers){
                if (err) {
                    handleError(err);
                }
                else if (beers.length != 0) {
                    for (i = 0; i < beers.length; i++) {
                        beerObjects.push(beers[i]);
                    }
                }
                else {
                    console.log('no beers found');
                }
                callback(beerObjects);
            });
        }
        else {
            // add new search term to database
            var newSearch = new Search();
            newSearch.term = input;

            newSearch.save(function(err) {
                if (err) {
                    throw err;
                }
            });

            // make request to breweryDB api and get beers
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                obj = JSON.parse(body);
                data = obj['data'];
                if(data != undefined) {
                  for(i = 0; i < data.length; i++) {
                      var newBeer = new Beer();
                      newBeer.beerId = data[i]['id'];
                      newBeer.name = data[i]['name'];
                      newBeer.description = data[i]['description'];
                      newBeer.abv = data[i]['abv'];
                      if (data[i].hasOwnProperty('labels')) {
                          newBeer.image = data[i]['labels']['large'];
                      }
                      beerObjects.push(newBeer);
                  }
                  callback(beerObjects);
                  addBeersToDatabase(beerObjects);
                } else {
                    callback(beerObjects);
                }
            });
        }
    });
}

// save beers to database
function addBeersToDatabase(beerObjects) {
    for(var i = 0; i < beerObjects.length; i++) {
        (function (currentBeer) {
            Beer.findOne({ beerId: currentBeer.beerId},
                function(err, beer) {
                    if(!err && !beer) {
                        // add new beer to database
                        var newBeer  = new Beer();
                        newBeer.beerId = currentBeer.beerId;
                        newBeer.name = currentBeer.name;
                        newBeer.description = currentBeer.description;
                        newBeer.abv = currentBeer.abv;
                        newBeer.image = currentBeer.image;
                        newBeer.save(function(err) {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                    else if(!err) {
                        // beer is already in database
                    }
                    else {
                        console.log('ERROR: ' + err);
                    }
                }
            );
        })(beerObjects[i]);
    }
}

// add a new favorite beer if it is not already a favorite
function addNewFavorite(req, beerId) {
    Favorite.findOne({ userId: req.user.userId, beerId: beerId}, function(err, fav){
        if (!err && !fav) {
            var newFav = new Favorite();
            newFav.userId = req.user.userId;
            newFav.beerId = beerId;

            newFav.save(function(err) {
                if (err) {
                    throw err;
                }
            });
        }
        else if (!err) {
            // favorite is already in database
        }
        else {
            console.log('ERROR: ' + err);
        }
    });
}

// return true if the beer is already a favorite, return false if it isn't
function isFavorite(userId, beerId, callback) {
    var isFav = false;
    Favorite.findOne({ userId: userId, beerId: beerId}, function(err, fav){
        if (!err && !fav) {
            // this beer is not a favorite
            isFav = false;
        }
        else if (!err) {
            // this beer is a favorite
            isFav = true;
        }
        else {
            console.log('ERROR: ' + err);
        }
        callback(isFav);
    });
}

// get the beer ids of all favorites
function getFavoriteBeerIds(userId, callback) {
    var beerIds = [];
    Favorite.find({ userId: userId}, function(err, favs){
        if (err) {
            console.log(err);
        }
        else if (favs) {
            for (i = 0; i < favs.length; i++) {
                beerIds.push(favs[i]['beerId']);
            }
        }
        else {
            // no favorites found
            console.log('no favorites found');
        }
        callback(beerIds);
    });
}

// use the beer ids to get full beer info of all favorites
function getFavorites(beerIds, callback) {
    var beers = [];
    var count = beerIds.length;
    for(var i = 0; i < beerIds.length; i++) {
        (function (id) {
            Beer.findOne({ beerId: id}, function(err, beer) {
                    if (err) {
                        handleError(err);
                    }
                    else if(beer) {
                        count--;
                        beers.push(beer);
                        if (count <= 0) {
                            callback(beers);
                        }
                    }
                    else {
                        // no favorite beers found
                    }
                }
            );
        })(beerIds[i]);
    }
}

// facebook request to get ids of all friends that also use Beer Buddy
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

// use friend ids to get full user info for all friends
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


router.get('/favorites', function(req, res) {
    if (typeof req.user != 'undefined') {
        console.log('user is' + req.user.userId);
        getFavoriteBeerIds(req.user.userId, function(beerIds) {
            console.log(beerIds);
            getFavorites(beerIds, function(beers) {
                console.log(beers);
                res.json(beers);
            });
        });
    }
});

router.get('/favorites/:userId', function(req, res) {
    if (typeof req.user != 'undefined') {
        getFavoriteBeerIds(req.params.userId, function(beerIds) {
            console.log(beerIds);
            getFavorites(beerIds, function(beers) {
                console.log(beers);
                res.json(beers);
            });
        });
    }
});

router.post('/favorites', function(req, res) {
    console.log('post favorites request');
    console.log(req.body.beerId);
    addNewFavorite(req, req.body.beerId);
    if (typeof req.user != 'undefined') {
        getFavoriteBeerIds(req, function(beerIds) {
            console.log(beerIds);
            getFavorites(beerIds, function(beers) {
                console.log(beers);
                res.json(beers);
            });
        });
    }
});

router.get('/get/:input', function(req, res) {
    search(req.params.input, function(beers) {
        res.json(beers);
    });
});

router.get('/facebook/friends', function(req, res) {
    console.log('get friends');
    if (typeof req.user != 'undefined') {
        getFriendIds(req, function(friendIds) {
            console.log(friendIds);
            getFriends(friendIds, function(friends){
                console.log(friends);
                res.json(friends);
            });
        });
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.locals.user = req.user;
    res.locals.loggedIn = (req.user) ? true : false;
    res.render('agency', { title: 'BeerBuddy' });
});

module.exports = router;