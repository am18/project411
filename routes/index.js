var express = require('express');
var router = express.Router();
var configAuth = require('../config/auth');
var Beer = require('../models/beer');
var Search = require('../models/search');

//var mongoose = require('mongoose');

var request = require('request');
var obj;
var data;
var beerNames = [];
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
                    console.log(beers);
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
                    newBeer.id = data[i]['id'];
                    newBeer.name = data[i]['name'];
                    newBeer.description = data[i]['description'];
                    newBeer.abv = data[i]['abv'];
                    if (data[i].hasOwnProperty('labels')) {
                        newBeer.image = data[i]['labels']['large'];
                    }

                    beerObjects.push(newBeer);
                    console.log(beerObjects[i].name);
                }
                console.log("here");
                addBeersToDatabase(beerObjects);
            });

        }
    });
}

function addBeersToDatabase(beerObjects) {

    for (i = 0; i < beerObjects.length; i++) {
        console.log(beerObjects[i].id);
        // check if beer is already in database
        Beer.count({id: beerObjects[i].id}, function(err, count){
            if (err) {
                handleError(err);
            }
            if (count == 0) {
                // add new beer to database
                var newBeer = new Beer();
                newBeer.id = beerObjects[i].id;
                newBeer.name = beerObjects[i].name;
                newBeer.description = beerObjects[i].description;
                newBeer.abv = beerObjects[i].abv;
                newBeer.image = beerObjects[i].image;

                beerObjects[i].save(function(err) {
                    if (err) {
                        throw err;
                    }
                });

            }
            else {
                // beer is already in database
            }
        });
    }

}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'BeerBuddy' });
});

router.post('/', function(req, res) {
    console.log(req.body.input);
    if (req.body.input.length > 0) {
        search(req.body.input);
    }
    else {
        // display error using connect-flash
    }
    res.render('index', { title: 'BeerBuddy', beers: beerNames });
});

module.exports = router;
