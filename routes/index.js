var express = require('express');
var router = express.Router();

//var mongoose = require('mongoose');

var request = require("request");
var obj;
var options = { method: 'GET',
    url: 'http://api.brewerydb.com/v2/search/',
    qs:
    { key: 'fcacff0f686f8721f8831c53d8d5b2d2',
        q: 'miller',
        type: 'beer' },
    headers:
    { 'postman-token': 'f2af4ae2-3be0-0eda-0e25-35fc1e2c0dc2',
        'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    obj = JSON.parse(body);
    //console.log(obj.totalResults);
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
