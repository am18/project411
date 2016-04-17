var express = require('express');
var router = express.Router();

var Favorite = require('../models/favorite');
var Beer = require('../models/beer');

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


/* GET users listing. */
router.get('/', function(req, res, next) {
    if (typeof req.user != 'undefined') {
        getFavoriteBeerIds(req, function(beerIds) {
            getFavorites(beerIds, function(beers) {
                console.log(beers);
                res.render('profile');
            });
        });
    }
    else {
        // error message
        // you must login to access friends page
        res.redirect('back');
    }
});

module.exports = router;
