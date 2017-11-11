var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var path     = require('path');

    /* GET home page. */
  router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, "index.html"));
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
        res.sendFile(path.join(__dirname, "success.html"));      
        return res
          .status(200)
          .json({ secret: '123' });
          
      }
    })(req, res, next);
  });


module.exports = router;