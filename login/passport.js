var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FitbitStrategy = require('../lib').FitbitOAuth2Strategy;
var passport = require('passport');
var keys = require('../test/keys');
var app = express();
var unirest = require('unirest');
var moment = require('moment');

app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session({
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());

// NOTE: If you test the code out, will need to provide your own clientID and clientSecret for FitBit
// https://dev.fitbit.com/reference/web-api/basics/#overview

// http://localhost:8080/auth/fitbit/callback for local test
// https://ihealth-tester.herokuapp.com/ for Heroku
var fitbitStrategy = new FitbitStrategy({
  clientID: keys.fitBits.CLIENT_ID,
  clientSecret: keys.fitbits.CLIENT_SECRET,
  scope: ['activity','heartrate','location','profile'],
  callbackURL: "http://localhost:8080/auth/fitbit/callback"
}, function(accessToken, refreshToken, profile, done) {
  // TODO: save accessToken here for later use
  done(null, {
    accessToken: accessToken,
    refreshToken: refreshToken,
    profile: profile
  });

});

passport.use(fitbitStrategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var fitbitAuthenticate = passport.authenticate('fitbit', {
  successRedirect: '/auth/fitbit/success',
  failureRedirect: '/auth/fitbit/failure'
});

app.get('/auth/fitbit', fitbitAuthenticate);
app.get('/auth/fitbit/callback', fitbitAuthenticate);

app.get('/auth/fitbit/success', function(req, res, next) {
  res.send(req.user);
});

app.get('/auth/fitbit/activity', function(req, res, next) {
  var req = unirest("GET", "https://api.fitbit.com/1/user/3BLB34/activities/date/2017-11-01.json");

  req.headers({
    "postman-token": "afed1d27-f049-fe9c-8e91-b01b047b7c39",
    "cache-control": "no-cache",
    "authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzQkxCMzQiLCJhdWQiOiIyMkNLVEYiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJybG9jIHJociByYWN0IHJwcm8iLCJleHAiOjE1MTAxMTMxMDQsImlhdCI6MTUxMDA4NDMwNH0.zja1o_Gga-IhqSZZcaJf8KljNWSBih_zDPpgeMRyQCY`
  });
  
  req.end(function (res) {
    if (res.error) throw new Error(res.error);
  
    console.log(res.body);
  });
  
});

app.listen(8080);
