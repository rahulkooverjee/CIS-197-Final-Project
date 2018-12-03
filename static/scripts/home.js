$(document).ready(function () {

  var tasks = [];

  getTasks()
  setInterval(getTasks, 5000);
  function getTasks() {
    $.ajax({
      url: '/api/getTasks',
      type: 'GET',
      success: function(res) {
        tasks = res;
        showTasks();
      }
    })
  };

  function showTasks() {
    $('#tasks').html(
        tasks.map((i) => '<div data-id="' + i._id + '">' + i.description + ' ' + i.complete + '</div>').join('')
    )
  }

// TESTING - TODO DELETE
   $('#testBtn').on('click', function () {
    console.log('tootl')
    $.post('api/toggleTaskCompletion', {tid: '5c049a26663b95720fd6f751'}, function(data) {
      if (data.status === 'ok') {
        $('.modal').css('display', 'none');
      }
      else {
        $('#err-message').text('ERROR: ' + data.err);
      }
    });
  })


  // Set the deadline input to be today's date by default 
  var now = new Date();
  var month = (now.getMonth() + 1);               
  var day = now.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  var today = now.getFullYear() + '-' + month + '-' + day;
  $('#deadline-input').val(today);

  // Open the add task model
  $('#add-task-button').on('click', function () {
    $('.modal').css('display', 'block');
  })

  // Close the add task model
  $('#cancel-task-button').on('click', function () {
    $('.modal').css('display', 'none');
  })


  $('#add-task-form').submit(function(e) {
    e.preventDefault();
    // If trying to login 
    $.post('api/addTask', $("#add-task-form").serialize(), function(data) {
      if (data.status === 'ok') {
        $('.modal').css('display', 'none');
      }
      else {
        $('#err-message').text('ERROR: ' + data.err);
      }
    });
  });

  $(this).addClass("current").siblings().removeClass("active");
});