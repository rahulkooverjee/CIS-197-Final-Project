/*
 * This module handles all JS related functionality for home.html (the home page)
 *
 * Author: Rahul Kooverjee for his CIS 197 Final Project Fall 2018
 *
 */

$(document).ready(function () {

  // Lists of tasks
  var todaysTasks = [];
  var previousTasks = []; 
  var futureTasks = []; 

  // Get the tasks from the DB initially, then get them again every 5 seconds 
  getTasks()
  setInterval(getTasks, 5000);

  // Function that gets all tasks from the database - today's, previous, and future 
  function getTasks() {
    $.ajax({
      url: '/api/getTodaysTasks',
      type: 'GET',
      success: function(res) {
        todaysTasks = res;
        showTodayTasks();
      }
    });
    $.ajax({
      url: '/api/getPreviousTasks',
      type: 'GET',
      success: function(res) {
        previousTasks = res;
        showPreviousTasks();
      }
    });
    $.ajax({
      url: '/api/getFutureTasks',
      type: 'GET',
      success: function(res) {
        futureTasks = res;
        showFutureTasks();
      }
    })
  };

  // Set the deadline input on the add task form to be today's date by default 
  var now = new Date();
  var month = (now.getMonth() + 1);               
  var day = now.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  var today = now.getFullYear() + '-' + month + '-' + day;
  $('#deadline-input').val(today);

  // Function to show today's tasks by modifying the HTML of the page
  function showTodayTasks() {
    $('#today-tasks').html(
        todaysTasks.map((i) => '<div data-id="' + i._id + '">' + i.description + ' | ' + i.deadline + ' | ' + i.priority+ ' | ' + i.category+ ' | ' + i.complete + '</div>').join('')
    )
  }

  // Function to show today's tasks by modifying the HTML of the page
  function showPreviousTasks() {
    $('#previous-tasks').html(
        previousTasks.map((i) => '<div data-id="' + i._id + '">' + i.description + ' | ' + i.deadline + ' | ' + i.priority+ ' | ' + i.category+ ' | ' + i.complete + '</div>').join('')
    )
  }

  // Function to show today's tasks by modifying the HTML of the page
  function showFutureTasks() {
    $('#future-tasks').html(
        futureTasks.map((i) => '<div data-id="' + i._id + '">' + i.description + ' | ' + i.deadline + ' | ' + i.priority+ ' | ' + i.category+ ' | ' + i.complete + '</div>').join('')
    )
  }

  // Open the add task model
  $('#add-task-button').on('click', function () {
    $('.modal').css('display', 'block');
  })

  // Close the add task model
  $('#cancel-task-button').on('click', function () {
    $('.modal').css('display', 'none');
  })

  // Submit the add task form when add task button is pressed
  $('#add-task-form').submit(function(e) {
    e.preventDefault(); // prevents refresh
    $.post('api/addTask', $("#add-task-form").serialize(), function(data) {
      if (data.status === 'ok') {
        $('.modal').css('display', 'none');
      }
      else {
        $('#err-message').text('ERROR: ' + data.err);
      }
    });
  });

/*
-----------------------------------------------------------------------------------------------------
THIS STUFF BELOW IS FOR DEBUGGING - REMOVE OUT BEFORE SUBMISSION
-----------------------------------------------------------------------------------------------------
*/
// TESTING - TODO DELETE
   $('#testBtn').on('click', function () {
    console.log('tootl')/*
    $.post('api/toggleTaskCompletion', {tid: '5c049a26663b95720fd6f751'}, function(data) {
      if (data.status === 'ok') {
        $('.modal').css('display', 'none');
      }
      else {
        $('#err-message').text('ERROR: ' + data.err);
      }
    }); */
  })
});