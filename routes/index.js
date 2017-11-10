var express = require('express');
var router = express.Router();
var passport = require('passport');

module.exports = function (app) {
    /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  router.get('/protected', function (req, res, next) {
    passport.authenticate('jwt', function (err, user, info) {
      if (err) {
        // internal server error occurred
        return next(err);
      }
      if (!user) {
        // no JWT or user found
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      if (user) {
  // authentication was successful! send user the secret code.
        return res
          .status(200)
          .json({ secret: '123' });
      }
    })(req, res, next);
  });
}