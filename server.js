var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var passport      = require('passport');
var index         = require('./routes/index');
var users         = require('./routes/users');
var manageBGL     = require('./routes/manageBGL');
var User          = require('./models/user');
var Glucose       = require('./models/Glucose');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy   = require('passport-jwt').Strategy;
var ExtractJwt    = require('passport-jwt').ExtractJwt;

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise; 

// Sets up the Express App
// =============================================================
var app = express();

// use for Heroku app if launched or local port 8080
var PORT = process.env.PORT || 8080;


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Make public a static dir
app.use(express.static("public"));

// JWT configration
var options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
options.secretOrKey = '7x0jhxt"9(thpX6'

app.use(passport.initialize());

require("./routes/passport")(app);
app.use('/', index);
app.use('/users', users);
app.use('/bgl', manageBGL);

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_z3ttcl4x:rNRP9n_rQq2rOv9LX9CUWYaO4RjhulNC@ds231245.mlab.com:31245/heroku_z3ttcl4x");
// when testing, use localhost: mongoose.connect("mongodb://localhost/dashboard-health");
// mongodb://tester:tester@ds231245.mlab.com:31245/heroku_z3ttcl4x
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

// Configure Passport to use local strategy for initial authentication.
passport.use('local', new LocalStrategy(User.authenticate()));

// Configure Passport to use JWT strategy to look up Users.
passport.use('jwt', new JwtStrategy(options, function(jwt_payload, done) {
 User.findOne({
   _id: jwt_payload.id
 }, function(err, user) {
   if (err) {
     return done(err, false);
   }
   if (user) {
     done(null, user);
   } else {
     done(null, false);
   }
 })
}))

// FitBit Authentication
app.get("/auth/success", function(req, res) {
  res.sendFile(path.join(__dirname, "success.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});