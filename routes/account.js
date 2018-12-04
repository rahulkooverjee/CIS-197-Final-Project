/*
 * This module defines all of the routes for all account related functionality including signing up
 * loggin in, and logging out
 *
 * Author: Rahul Kooverjee for his CIS 197 Final Project Fall 2018
 *
 */

// Imports 
var express = require('express');
var User = require('../models/user');
var bcrypt = require('bcrypt');
var isAuthenticated = require('../middlewares/isAuthenticated');

var router = express.Router();

// Helper function that checks if an email is of the form something@domain.extension using a regular expression. 
var validateEmail = function(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}

/*
-----------------------------------------------------------------------------------------------------
Routes 
-----------------------------------------------------------------------------------------------------
*/

// Post route for sign up - to save the users details in the database
router.post('/signup', function (req, res, next) {
  // Get parameters from request
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

  // First check if there are any users with the same email
  User.findOne({email: email }, function (err, result) {
    // If there is a user with the same email, don't allow account creation
    if (result) {
      res.send({err: "User with that email already exists"}); 
    } else {
      // Create a secure (salted hash) password
      bcrypt.hash(password, 10, function(err, hash) {
        // Store User in database using the hashed password
        if (hash) {
          var user = new User({ email: email, password: hash })
          user.save(function (err, result) {
            if (!err) {
              req.session.user = result.email;
              req.session.save();
              res.send({status: 'ok'}); 
            } else {
              next(err);
            }
          });
        } else {
          res.send({err: "Error saving, please try again"}); 
        }
      });
    }
  })  
});

// Post route for login - to check if the credials match something in the DB and login if so
router.post('/login', function (req, res, next) {
  // Get parameters from request
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

  // Get the user with the given email and compare the hashed password to the given password
  User.findOne({email: email }, function (err, result) {
    if (result) {
      var hash = result.password;
      bcrypt.compare(password, hash, function(err, valid) {
          if (valid === true) {
            req.session.user = email;
            req.session.save();
            res.send({status: 'ok'});
          } else {
            res.send({err: "Incorrect password"}); 
          }
      });
    } else {
      res.send({err: "No user found with given email and password"}); 
    }
  })  
});

// Get route for logout - removes the users session and re-directs to login up page
// Only works if the user is already logged in
router.get('/logout', isAuthenticated, function (req, res, next) {
  req.session.user = '';
  res.redirect('/');
});

/*
 * -----------------------------------------------------------------------------------------------------
 * THIS STUFF BELOW IS FOR DEBUGGING - REMOVE OUT BEFORE SUBMISSION
 * -----------------------------------------------------------------------------------------------------
 */
// Get route for logout - removes the users session and re-directs to login up page
router.get('/allUsers', function (req, res, next) {
  User.find({}, function (err, result) {
    if (result) {
      console.log(result)
    } 
  })  
});


module.exports = router;
