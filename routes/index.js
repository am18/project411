var express = require('express');
var router = express.Router();

//var mongoose = require('mongoose');

var request = require('request');
var obj;
var data;
var beers = [];

function search(input) {

    var options = { method: 'GET',
        url: 'http://api.brewerydb.com/v2/search/',
        qs:
        { key: 'fcacff0f686f8721f8831c53d8d5b2d2',
            q: input,
            type: 'beer' },
        headers:
        { 'postman-token': 'f2af4ae2-3be0-0eda-0e25-35fc1e2c0dc2',
            'cache-control': 'no-cache' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        obj = JSON.parse(body);
        data = obj['data'];
        for(i = 0; i < data.length; i++) {
            beers.push(data[i]['name']);
            console.log(beers[i]);
        }
    });
}


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'BeerBuddy' });
});

router.post('/', function(req, res) {
    console.log(req.body.input);
    search(req.body.input);
    res.render('index', { title: 'BeerBuddy', beers: beers });
});

module.exports = router;
