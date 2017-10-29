var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var passport = require('passport');
var unirest = require('unirest');


// Sets up the Express App
// =============================================================
var app = express();
var PORT = 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.get("/", function(req, res) {
//     // These code snippets use an open-source library. http://unirest.io/nodejs
//     unirest.get("https://managebgl-managebgl.p.mashape.com/add?log_type=1&notes=test+value&other=<required>&time=<required>&token=14784--aeb0a9a6fd2d05f9213c5c49f3c74c6e&value=7")
//     .header("X-Mashape-Key", "6jSePifxX0mshxd2XWBWPbHlepblp1Xtffhjsnsd7sZZyeYkRa")
//     .header("Accept", "application/json")
//     .end(function (result) {
//       console.log(result.status, result.headers, result.body);
//   });
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api", function(req, res) {
  // These code snippets use an open-source library. http://unirest.io/nodejs
  unirest.get("https://managebgl-managebgl.p.mashape.com/extract?end_date=2017-10-31+11%3A59%3A59&start_date=2017-10-25+14%3A03%3A00&token=14784-aeb0a9a6fd2d05f9213c5c49f3c74c6e")
  .header("X-Mashape-Key", "6jSePifxX0mshxd2XWBWPbHlepblp1Xtffhjsnsd7sZZyeYkRa")
  .header("Accept", "application/json")
  .end(function (result) {
    console.log(result.status, result.headers, result.body);
    return res.json(result.body);
  });
})

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});