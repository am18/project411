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

var results= [{ _id: 571431,
  beerId: 'KJ3Cky',
  name: 'Magic Brown',
  description: 'Springtime is tricky for us, especially in Seattle. The first week of April brought near freezing weather and recently it has been warm and pleasant. We decided to cover all bases and made a brown and hoppy pale.  However, Magic Brown itself can fit the schizophrenic weather perfectly.  It is dark and malty for the cold, but it’s body is light enough that it will be great on a warmer day as well. Unlike the typical “brown,” we built this brown up to have some more residual malt character by adding some extra munich, caramunich, and other specialty malts, but keeping the overall alcohol content and roast character down.',
  abv: undefined },
{ _id: 571431,
  beerId: 'OwxwuV',
  name: 'Magic Mirror',
  description: 'Imperial Kottbüsser Style Ale\r\nOnce upon a time German beer was only deemed pure if it contained the four orthodox ingredients of brewing: water, barley, hops, and yeast. During this time, an ale known as Köttbusser was outlawed because it contained oats, honey, and molasses. Over the centuries since its prohibition, Köttbusser became a lost brewing style. At Grimm Brothers, we’ve created an imperial version of this beer and named it Magic Mirror.   Magic Mirror is the antithesis ale to Snow Drop, brewed with more grains, honey and molasses and aged in oak, this beer is a malty big light colored ale.  It has just enough hops to balance the sweetness but leave a refreshing oak flavor on your tongue.',
  abv: '9.5',
  image: 'https://s3.amazonaws.com/brewerydbapi/beer/OwxwuV/upload_yFSgc6-large.png' },
{ _id: 571431,
  beerId: 'UT2x2r',
  name: 'Blue Magic',
  description: undefined,
  abv: '4.5',
  image: 'https://s3.amazonaws.com/brewerydbapi/beer/UT2x2r/upload_Pui10X-large.png' },
{ _id: 571431,
  beerId: 'IadpoA',
  name: 'Hippie Magic',
  description: 'Dirty hippies need to be rooted out & destroyed. Drinking this delicious French farmhouse ale helps accomplish this feat. How? We don’t know, but this brew is filled with malty earthy goodness (just like hippies). Don’t forget kids; Jerry Berry’s dead.',
  abv: '6' },
{ _id: 571431,
  beerId: 'spJLZI',
  name: 'Magic Lagyr',
  description: 'Brewed for lager drinkers who don\'t like the harsher taste of most premium lagers.\r\n\r\nMagic is brewed with the finest floor malted barley, the best German lager hops, quality Danish lager yeast and clear clean Welsh water.\r\n\r\nPainstakingly developed and trialled for over a year to enable us to bring to you an outstanding, classic, full flavoured but wonderfully clean finishing premium WELSH lager.',
  abv: '5' },
{ _id: 571431,
  beerId: 'lq5i9m',
  name: 'Fresh Magic',
  description: undefined,
  abv: '5.7' },
{ _id: 571431,
  beerId: 'j6F284',
  name: 'Magic Sticke',
  description: 'Traditional German Strong Alt beer. This beer was traditionally brewed by German brewers once or twice a year as a “Secret” recipe.  This beer is brewed with pilsner malts and was lagered for about 5 weeks.  It has a very smooth malty taste with slight bitterness. The Magic Sticke is currently a taproom exclusive.',
  abv: '6.5' },
{ _id: 571431,
  beerId: 'z3HPhk',
  name: 'Magic Beaver',
  description: 'Belgian beer meets American and New Zealand Hops, they live happily ever after. Named after the Magic Beaver pond on the farm\'s property, LCCB\'s Pale Ale is a combination of Belgian Pilsner Malt, authentic Belgian yeast and American and New Zealand hops. Delicious and easy to drink.',
  abv: '5.5',
  image: 'https://s3.amazonaws.com/brewerydbapi/beer/z3HPhk/upload_qawlGl-large.png' },
{ _id: 571431,
  beerId: 'TSmBJo',
  name: 'Magic Trick',
  description: undefined,
  abv: '6' },
{ _id: 571431,
  beerId: 'JMoPDQ',
  name: 'Strawberry Magic',
  description: 'Come alive to crisp apple hard cider blended with the fresh taste of strawberries, soft and deep red, backed by mouth watering sweetness and a delicate hint of tartness. This is Strawberry Magic Hard Cider kicked up with a hint of Saturday night. We blend it a little differently around here. If you’ve never tried it, get ready for confetti.',
  abv: '5',
  image: 'https://s3.amazonaws.com/brewerydbapi/beer/JMoPDQ/upload_SZTSuP-large.png' },
{ _id: 571431,
  beerId: 'GdU5Je',
  name: 'Magic Hefeweizen',
  description: 'Unfiltered German Hefeweizen named for the late Jimmy Wilson, Captain of the log canoe Magic.  Medium bodied golden wheat ale with a creamy mouthfeel.  Slight fruit and clove in both the flavor and aroma due to the special hefeweizen yeast used in this ale.',
  abv: '5' },
{ _id: 571431,
  beerId: 'g7dyYe',
  name: 'Magic Brew',
  description: undefined,
  abv: undefined },
{ _id: 571431,
  beerId: 'JhIw72',
  name: 'Magic Ghost',
  description: undefined,
  abv: '8' },
{ _id: 57143,
  beerId: '1j3YAj',
  name: 'Trail Magic',
  description: 'Something different in every mouthful, this beer is inspired by the odd mishmash that is trail mix - chocolate, nuts, and dried fruit - to celebrate the pioneering spirit of those who opt to hike the Appalachian Trail from Georgia to Maine. We use fresh ingredients and a complementary grain bill to accentuate the various flavors.',
  abv: '6.5',
  image: 'https://s3.amazonaws.com/brewerydbapi/beer/1j3YAj/upload_4C7EDV-large.png' },
{ _id: 571,
  beerId: 'G2T8e5',
  name: 'Black Magic',
  description: 'Fruit Stout',
  abv: '5.8' },
{ _id: 571431,
  beerId: 'f4TCcj',
  name: 'Magic Alex',
  description: 'Our triple IPA, brewed specially for the 2015 Washington Hop Mob Roadshow. We named this beer after the infamous Beatles sycophant who promised to outfit Apple Studios with an over-the-top set of equipment that included a 72-track tape machine and a sonic force field to isolate Ringo’s drums. We dedicate this over-the-top triple IPA to Magic Alex.',
  abv: undefined },
{ _id: 571431,
  beerId: '6C0LkO',
  name: 'Jester Magic',
  description: 'There’s no illusion, here at JW Lees Brewery we consider our range of beers to be somewhat magical and none more so than Jester Magic. Fall under the Jester’s spell this spring and enjoy this light hearted ale with its unique enchanted flavour. This mystic elixir is a treat for the tongue and its light-bodied nature makes it a taste sensation. Jester Magic is brewed with Jester hops to give it a distinctly sweet, satisfying flavour. You’d be a fool not to try this light, fruity and enchanting ale.',
  abv: '4.2' },
{ _id: 571431,
  beerId: 'B3HyFL',
  name: 'Midnight Magic',
  description: 'Formerly Black Magic.\r\nGhost River Midnight Magic (Seasonal) has a pronounced toasted malt flavor that creates a smooth roasted flavor without the bite found in a typical stout or porter. The end result is a dark beer with great flavor and drinkability.',
  abv: undefined },
{ _id: 571431,
  beerId: 'aN0H2P',
  name: 'Black Magic Stout',
  description: 'Black Magic is a traditional dry Irish stout. It is carbonated with nitrogen, and pours very much like a Guinness. Dry roasted flavors are prominent, with hints of chocolate and coffee on the finish.',
  abv: '4.8' },
{ _id: 571431,
  beerId: 'MUJ9ZH',
  name: 'Little Magic Pale Ale',
  description: 'A dry, accessible Pale Ale. Bright and hoppy, Little Magic features Sterling and Crystal hops, which impart a spicy, floral character. This crisp ale pours with a rocky head and a golden tangerine color.',
  abv: '6' },
{ _id: 571431,
  beerId: 'HktnHV',
  name: 'Black Magic Porter',
  description: 'Brewed as a classic brown porter with rich caramel and chocolate flavors.',
  abv: '5' },
{ _id: 571431,
  beerId: 'pp06pT',
  name: 'Magic City Pale Ale',
  description: 'Magic City Pale Ale is a balanced American Pale Ale.  Our Pale Ale is brewed with Amarillo hops and it gives this beer an excellent balance between the hop character and malt backbone.  It has a nice aroma with hits of malt sweetness.  It has a light to medium body.  We wanted to create a Pale Ale that was much different than our IPA and could be a great addition to our portfolio. This beer pairs with a wide range of foods.  It can go great with a  Salad as well as a Burger.  \r\nServe this beer in a nonic pint glass.',
  abv: '5.6',
  image: 'https://s3.amazonaws.com/brewerydbapi/beer/pp06pT/upload_e7mWbE-large.png' },
{ _id: 571431,
  beerId: '9WMu0L',
  name: 'Magic In the Ivy',
  description: undefined,
  abv: '5.7',
  image: 'https://s3.amazonaws.com/brewerydbapi/beer/9WMu0L/upload_RnMhNC-large.png' },
{ _id: 571431,
  beerId: 'L8JSWv',
  name: 'Hexerei White Magic Witbier',
  description: 'A traditional witbier that we brew to style with a balance of soft white wheat and malts that offer a slight sweetness and distinct citrus orange aroma and flavors with the additions of coriander and sweet orange peel. Hexerei is then filtered over blood oranges for an enhanced citrus flavor experience that is extremely refreshing.',
  abv: '5',
  image: 'https://s3.amazonaws.com/brewerydbapi/beer/L8JSWv/upload_lYy79o-large.png' },
{ _id: 571431,
  beerId: 'LDo4fA',
  name: 'Puff The Magic Cyser',
  description: 'Puff the Magic Cyser is a collaborative barrel aged product between Vander Mill and New Holland Brewing Company.\r\n\r\nThis cyser is fermented with Michigan wildflower honey to complete dryness and then aged in New Holland Dragon\'s Milk barrels for 8 months.  The richness from the stout and depth of the barrel flavor make this product very complex.  A hint of the honey and acidity of the cider round out the profile.',
  abv: '8.5',
  image: 'https://s3.amazonaws.com/brewerydbapi/beer/LDo4fA/upload_R2fNu8-large.png' },
{ _id: 571431,
  beerId: 'j6iosm',
  name: 'Black Magic RyePA',
  description: undefined,
  abv: '6.8' }];

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
                else if (beers) {
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

router.get('/get', function(req, res) {
    search("miller", function(beers) {
        res.json(beers);
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    if (typeof req.user != 'undefined') {
        console.log(req.user.userId);
        addNewFavorite(req);
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