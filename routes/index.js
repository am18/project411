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
                    var id = data[i]['id'];
                    var name = data[i]['name'];
                    var description = data[i]['description'];
                    var abv = data[i]['abv'];
                    if (data[i].hasOwnProperty('labels')) {
                        var image = data[i]['labels']['large'];
                    }

                    beerNames.push(name);
                    console.log(beerNames[i]);

                    // check if beer is already in database
                    Beer.findOne({'id': id}, function(err, beer){
                        if (err) {
                            handleError(err);
                        }
                        if (beer) {
                            // beer is already in database
                        }
                        else {
                            // add new beer to database
                            var newBeer = new Beer();
                            newBeer.id = id;
                            newBeer.name = name;
                            newBeer.description = description;
                            newBeer.abv = abv;
                            newBeer.image = image;

                            newBeer.save(function(err) {
                                if (err) {
                                    throw err;
                                }
                            });
                        }
                    });
                }
            });
        }
    });
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
