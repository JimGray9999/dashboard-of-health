var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");
var unirest = require('unirest');

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise; 

// Sets up the Express App
// =============================================================
var app = express();
// use for Heroku app if launched
var PORT = process.env.PORT || 8080;

var Glucose = require('./models/Glucose');

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_z3ttcl4x:rNRP9n_rQq2rOv9LX9CUWYaO4RjhulNC@ds231245.mlab.com:31245/heroku_z3ttcl4x");
// when testing, use localhost: mongoose.connect("mongodb://localhost/dashboard-health");
// production, use Heroku: mongoose.connect("mongodb://heroku_z3ttcl4x:rNRP9n_rQq2rOv9LX9CUWYaO4RjhulNC@ds231245.mlab.com:31245/heroku_z3ttcl4x");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api", function(req, res) {
  // These code snippets use an open-source library. http://unirest.io/nodejs
  unirest.get("https://managebgl-managebgl.p.mashape.com/extract?end_date=2017-10-31+11%3A59%3A59&start_date=2017-10-25+14%3A03%3A00&token=14784-aeb0a9a6fd2d05f9213c5c49f3c74c6e")
  .header("X-Mashape-Key", "6jSePifxX0mshxd2XWBWPbHlepblp1Xtffhjsnsd7sZZyeYkRa")
  .header("Accept", "application/json")
  .end(function (result) {
    
    var testResults = {};
    
    for (i = 0 ; i < result.body.logs.length ; i++) {
      if(result.body.logs[i].logtype_id === 1) {
        testResults.value = Math.round((result.body.logs[i].value * 18)); // reading conversion - mmol * 18 = mg/dL
        testResults.notes = result.body.logs[i].notes;
        testResults.time = result.body.logs[i].time;
        testResults.log_type = result.body.logs[i].logtype_id;
      }
      var newGlucose = new Glucose(testResults);
  
      newGlucose.save(function(err, doc) {
        if(err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    }
    console.log(result.body.logs);
    return res.json(result.body);

  });
})

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});