var express = require('express');
var router = express.Router();
var configAuth = require('../config/auth');
var Beer = require('../models/beer');
var Search = require('../models/search');

//var mongoose = require('mongoose');

var request = require('request');
var obj;
var data;
var beerObjects = [];

function search(input) {

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
            Beer.find({'name': new RegExp(input+'+', "i")}, function(err, beers){
                if (err) {
                    handleError(err);
                }
                if (beers) {
                    for (i = 0; i < beers.length; i++) {
                        beerObjects.push(beers[i]);
                    }
                }
                else {
                    console.log('no beers found');
                }
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
                addBeersToDatabase(beerObjects);
            });

        }
    });
}

function addBeersToDatabase(beerObjects) {
    for(var i = 0; i < beerObjects.length; i++) {
        //var currentBeer = beerObjects[i]; dont need this now
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
                        console.log("ERROR: " + err);
                    }
                }
            );
        })(beerObjects[i]);
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    if (typeof req.user != 'undefined') {
        console.log(req.user.userId);
    }
    res.render('index', { title: 'BeerBuddy' });
});

router.post('/', function(req, res) {
    if (req.body.input.length > 0) {
        search(req.body.input);
    }
    else {
        // display error using connect-flash
    }
    res.render('index', { title: 'BeerBuddy', beers: beerObjects });
});

module.exports = router;
