var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

passport.use(new FitbitStrategy({
  clientID:     '22CK7K',
  clientSecret: '27bc8708da43300618eabc8241a1a9a6',
  callbackURL: "https://ihealth-tester.herokuapp.com/auth/fitbit/callback"
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ fitbitId: profile.id }, function (err, user) {
    return done(err, user);
  });
}
));

app.get('/auth/fitbit',
passport.authenticate('fitbit', { scope: ['activity','heartrate','location','profile'] }
));

app.get( '/auth/fitbit/callback', passport.authenticate( 'fitbit', { 
      successRedirect: '/auth/fitbit/success',
      failureRedirect: '/auth/fitbit/failure'
}));

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});