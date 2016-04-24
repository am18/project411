var express = require('express');
var router = express.Router();
var configAuth = require('../config/auth');
var Beer = require('../models/beer');
var Search = require('../models/search');
var Favorite = require('../models/favorite');

//var mongoose = require('mongoose');

var request = require('request');
var obj;
var data;
var userId;


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
            console.log('search mongo database');
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
            console.log('new search term');
            var newSearch = new Search();
            newSearch.term = input;

            newSearch.save(function(err) {
                if (err) {
                    throw err;
                }
            });

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

function addBeersToDatabase(beerObjects) {
    for(var i = 0; i < beerObjects.length; i++) {
        (function (currentBeer) {
            Beer.findOne({ beerId: currentBeer.beerId},
                function(err, beer) {
                    if(!err && !beer) {
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

function addNewFavorite(req) {
    var beerIdTemp = 'FoPVhW';
    Favorite.findOne({ userId: req.user.userId, beerId: beerIdTemp}, function(err, fav){
        if (!err && !fav) {
            var newFav = new Favorite();
            newFav.userId = req.user.userId;
            newFav.beerId = beerIdTemp;

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

function isFavorite(req, beerId, callback) {
    var isFav = false;
    Favorite.findOne({ userId: req.user.userId, beerId: beerId}, function(err, fav){
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



function getFavoriteBeerIds(req, callback) {
    var beerIds = [];
    Favorite.find({ userId: req.user.userId}, function(err, favs){
        if (err) {
            handleError(err);
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

router.get('/favorites', function(req, res) {
    console.log('get favorites request');
    res.json('favorites');
});

router.post('/favorites', function(req, res) {
    console.log('post favorites request');
    console.log(req.body.beerId);
    res.json('favorites');
});

router.get('/get/:input', function(req, res) {
    search(req.params.input, function(beers) {
        res.json(beers);
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    if (typeof req.user != 'undefined') {
        console.log(req.user.userId);
        userId = req.user.userId;
        addNewFavorite(req);
        isFavorite(req, 'FoPVhW', function(isFav){
            console.log(isFav);
        });
    }
    //res.render('index', { title: 'BeerBuddy' });
    res.locals.loggedIn = (req.user) ? true : false;
    res.render('agency', { title: 'BeerBuddy' });
});

router.post('/', function(req, res) {
    if (req.body.input.length > 0) {
        search(req.body.input);
    }
    else {
        // display error using connect-flash
    }
    //res.render('index', { title: 'BeerBuddy', beers: beerObjects });
    res.render('agency', { title: 'BeerBuddy', beers: beerObjects });
});

module.exports = router;