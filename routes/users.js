var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

var secret = '7x0jhxt"9(thpX6';

module.exports = function(app) {
    /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.post('/users/register', function (req, res) {
    User.register(new User({ email: req.body.email }), req.body.password, function (err, user) {
      if (err) {
        return res.status(400).send({ error: 'Email address in use.' })
      }
      res.status(200).send({ user: user.id });
    });
  });

  router.post('/users/login', function (req, res, next) {
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
};

// test curl line: login:
// curl -X POST http://localhost:8080/users/login -H 'cache-control: no-cache' -H 'content-type: application/json' -d '{"username": "me@testing.org", "password": "testtest123"}'

// test curl authorizaton:
// curl -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMDRlNWFlYjY0NDU3MDliODVhOWNlZSIsImVtYWlsIjoibWVAdGVzdGluZy5vcmciLCJpYXQiOjE1MTAyNzc0Njh9.LdBHIXX7QATgFRzERjW0TiQRiP4h5zFc6j7MSvwfICw" -X GET http://localhost:8080/protected