/*
 * This module exists to define a single function that acts as middleware. 
 * It checks if a user is authenticated and if no re-directs the user to 
 * the sign in screen.
 *
 * Author: Rahul Kooverjee for his CIS 197 Final Project Fall 2018
 *
 */
var isAuthenticated = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/?invalidAccess=true")
  }
}

module.exports = isAuthenticated;