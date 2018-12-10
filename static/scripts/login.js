/*
 * This module handles all JS related functionality for index.html (the sign in page)
 *
 * Author: Rahul Kooverjee for his CIS 197 Final Project Fall 2018
 *
 */

$(document).ready(function () {
  // Set the mode to be login (as opposed to sign up) be default 
  loginMode = true;
  var inputBoxTitle = 'Login';;
  var toggleButtonText = 'Sign Up Instead';

  // Toggle between login and signup modes when the toggle button is clicked 
  $('#toggle-button').on('click', function () {
    loginMode = !loginMode;
    if (loginMode) {
      inputBoxTitle = 'Login';
      toggleButtonText = 'Sign Up Instead';
    } else {
      inputBoxTitle = 'Sign Up';
      toggleButtonText = 'Login Instead';
    }

    // Change the text of the title 
    $('#form-title').text(inputBoxTitle);
    $('#toggle-button').text(toggleButtonText);
    $('#submit-button').val(inputBoxTitle);
  })

  // Post the username and password details 
  $('#login-signup-form').submit(function(e) {
    e.preventDefault(); // prevents refresh
    // If trying to login 
    if (loginMode) {
      var routeToPostTo = 'account/login';
    } else { // otherwise trying to sign up
      routeToPostTo = 'account/signup';
    }
    // Post to the API route, if succesful then redirect to the homepage
    $.post(routeToPostTo, $("#login-signup-form").serialize(), function(data) {
      if (data.status === 'ok') {
        window.location = "/home"
      }
      else {
        $('#err-message').text('ERROR: ' + data.err);
      }
    });
  });

});