// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var cheerio = require('cheerio');
var request = require('request');
var moment = require('moment');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get("/query", function (req, res) {
  var url = 'https://soripe.com/menu-listing.php';
  var today = moment();
  var responseSent = false;
  request(url, function(error, response, html) {
    var $ = cheerio.load(html);
    var boxes = $('.vendor-box').each(function(box) {
      var text = $(this).find('a').text();
      var dateStr = text.split(':');
      if (dateStr.length < 2) {
        return;
      }
      var datePieces = dateStr[0].split(' ');
      var month = datePieces[0];
      var day = parseInt(datePieces[1]);
      var date = moment(new Date([month, day, today.year()].join()));

      if (today.day() === date.day() && today.month() === date.month()) {
        var text = $(this).find('.location').text().toLowerCase();
        var salmonFound = text.search('salmon') !== -1;
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send({salmonFound});
        
        responseSent = true;
        
        return false;
      }
    });
    
    if (!responseSent) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send({salmonFound: false});
    }
  });
});
