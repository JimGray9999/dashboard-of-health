var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('./models/user');

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

require("./login/passport.js")(app);
require("./routes/index")(app);
require("./routes/users")(app);

// Database configuration with mongoose
mongoose.connect("mongodb://tester:tester@ds231245.mlab.com:31245/heroku_z3ttcl4x");
// when testing, use localhost: mongoose.connect("mongodb://localhost/dashboard-health");
// production, use Heroku: mongoose.connect("mongodb://heroku_z3ttcl4x:rNRP9n_rQq2rOv9LX9CUWYaO4RjhulNC@ds231245.mlab.com:31245/heroku_z3ttcl4x");
var db = mongoose.connection;
  
// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');

});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// FitBit Authentication
app.get("/auth/success", function(req, res) {
  res.sendFile(path.join(__dirname, "success.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});