var express = require('express')
var User = require('../models/user');

// TODO var isAuthenticated = require('../middlewares/isAuthenticated');

var router = express.Router();

// Very hacky test to validate an email format of aaaa@bbbb.cccc TODO 
var validateEmail = function(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}

// Post route for sign up - to save the users details in the database
router.post('/signup', function (req, res, next) {
  var email = req.body.email;
  if (email == "") {
    res.send({err: "Email can't be empty"}); 
    return;
  }
  var password = req.body.password;

  // Validate inputs 
  // Empty email
  if (email === "") {
    res.send({err: "Email can't be empty"}); 
    return;
  }
  // Invalid email format
  if (!validateEmail(email)) {
    res.send({err: "Invalid email format"}); 
    return;
  }
  // Empty password
  if (password === "") {
    res.send({err: "Password can't be empty"}); 
    return;
  }
  var user = new User({ email: email, password: password })
  user.save(function (err, result) {
    if (!err) {
      req.session.user = result.email;
      req.session.save();
      res.send({status: 'ok'}); 
    } else {
      next(err);
    }
  });
});

// Post route for login - to check if the credials match the DB and login if so
router.post('/login', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  // Validate inputs 
  // Empty email
  if (email === "") {
    res.send({err: "Email can't be empty"}); 
    return;
  }
  // Invalid email format
  if (!validateEmail(email)) {
    res.send({err: "Invalid email format"}); 
    return;
  }
  // Empty password
  if (password === "") {
    res.send({err: "Password can't be empty"}); 
    return;
  }

  User.findOne({email: email, password: password }, function (err, result) {
    if (result) {
      req.session.user = result.email
      req.session.save();
      res.send({status: 'ok'});
    } else {
      res.send({err: "No user found with given email and password"}); 
    }
  })  
});

// Get route for logout - removes the users session and re-directs to login up page
router.get('/logout', function (req, res, next) {
  req.session.user = '';
  res.redirect('/');
});

module.exports = router;
