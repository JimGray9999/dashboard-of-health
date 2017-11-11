var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var passport     = require('passport');
var router       = express.Router();
var jwt          = require('jsonwebtoken');
var User         = require('../models/user');

var secret       = '7x0jhxt"9(thpX6';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// direct user to register new account
router.post('/register', function (req, res) {
  User.register(new User({ email: req.body.email }), req.body.password, function (err, user) {
    if (err) {
      return res.status(400).send({ error: 'Email address in use.' })
    }
    res.status(200).send({ user: user.id });
  });
});

// user login
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    if (user) {
      var token = jwt.sign({ id: user._id, email: user.email }, secret);
      return res
        .status(200)
        .json({ token });
    }
  })(req, res, next);
});

module.exports = router;

// test curl line: login:
// curl -H 'cache-control: no-cache' -H 'content-type: application/json' -X POST https://ihealth-tester.herokuapp.com/users/login  -d '{"username": "me@test.com", "password": "testing"}'
// or https://ihealth-tester.herokuapp.com/users/login
// http://localhost:8080/users/login

// test curl line: authorizaton:
// curl -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMDYxYjYyNjUwNWQ2MjhhNDA1YzZjZSIsImVtYWlsIjoibWVAdGVzdC5jb20iLCJpYXQiOjE1MTAzNTg2NTl9.FI5YL6OYZH-q9WjShCIJVobr__2EzF9iO9jJzI9Xhyo" -X GET http://localhost:8080/protected
// or https://ihealth-tester.herokuapp.com/users/register/protected

// test curl line: registration:
// curl -H "Content-Type: application/json" -X POST -d '{"email": "me@test.com", "password": "testing"}' https://localhost:8080/users/register
// or https://ihealth-tester.herokuapp.com/users/register