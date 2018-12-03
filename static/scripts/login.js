$(document).ready(function () {
  // Set login mode to be true
  loginMode = true;
  var inputBoxTitle = 'Login';;
  var toggleButtonText = 'Sign Up Instead';

  // Toggle between login and signup modes
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

  $('#login-signup-form').submit(function(e) {
    e.preventDefault();
    // If trying to login 
    if (loginMode) {
      var routeToPostTo = 'account/login';
    } else { // otherwise trying to sign up
      routeToPostTo = 'account/signup';
    }
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