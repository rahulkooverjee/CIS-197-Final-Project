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

  var mode = 'today'; // Hacky, but we'll use a string to track which tasks to show

  // Get the tasks from the DB initially, then get them again every 5 seconds 
  getTasks()
  setDeadlineToToday();
 // setInterval(getTasks, 5000); TODO this

  // Set the max height of the tasks box to be 90% of the browser window size
  $('#tasks-box').css('max-height', $(window).height() * 0.85);
  $('#tasks-box').css('overflow', 'scroll');


  // Function that gets all tasks from the database - today's, previous, and future 
  function getTasks() {
    $.ajax({
      url: '/api/getTodaysTasks',
      type: 'GET',
      success: function(res) {
        todaysTasks = res;
        renderTasks();
      }
    });
    $.ajax({
      url: '/api/getPreviousTasks',
      type: 'GET',
      success: function(res) {
        previousTasks = res;
        // Sort so the MOST recent is first 
        previousTasks.sort((a, b) => b.deadline.localeCompare(a.deadline));
      }
    });
    $.ajax({
      url: '/api/getFutureTasks',
      type: 'GET',
      success: function(res) {
        futureTasks = res;
        // Sort so the LEAST recent is first 
        futureTasks.sort((a, b) => a.deadline.localeCompare(b.deadline));
      }
    })
  };

  // Set the deadline input on the add task form to be today's date by default 
  function setDeadlineToToday() {
    var now = new Date();
    var month = (now.getMonth() + 1);               
    var day = now.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = now.getFullYear() + '-' + month + '-' + day;
    $('#deadline-input').val(today);
  }

  // Function to render tasks
  function renderTasks() {
    var tasksBeingViewed = [];
    if (mode === 'future') tasksBeingViewed = futureTasks;
    if (mode === 'today') tasksBeingViewed = todaysTasks;
    if (mode === 'prev') tasksBeingViewed = previousTasks;

    var htmlToShow = '';
    for (i in tasksBeingViewed) {
      var task = tasksBeingViewed[i];
      htmlToShow += '<div class="task-item" id="task-item-' + task._id + '">';
      htmlToShow += '<h4 class="task-description task-item-content">' + task.description + '</h4>';
      htmlToShow += '<h6 class="task-item-content"><i> Due: ' + task.deadline + '</i></h6>';
      htmlToShow += '<h5 class="task-item-content"><i>Priority: </i>' +  task.priority + '</h5>';
      htmlToShow += '<h5 class="task-item-content"><i>Category: </i>' +  task.category + '</h5>';
      htmlToShow += '<div class="task-item-controls" id="task-item-controls-' + task._id + '">';
      htmlToShow += '<div class="row header-row task-status-row">';
      htmlToShow += '<div class="col-md-6" style="text-align:left">';
      var completeText = task.complete ? 'Complete' : 'Incomplete';
      htmlToShow += '<h5 class="task-status">' + completeText + '</h5></div>';
      htmlToShow += '<div class="col-md-6" style="text-align:right">';
      htmlToShow += '<button type="button" class="btn btn-danger btn-xs task-item-control-btn" id="delete-task-btn-' + task._id + '">Delete</button> ';
      var completeButtonHtml = '<button type="button" class="btn btn-success btn-xs task-item-control-btn" id="complete-task-btn-' + task._id + '">Mark Complete</button>'; 
      if (task.complete) {
        completeButtonHtml = '<button type="button" class="btn btn-warning btn-xs task-item-control-btn" id="complete-task-btn-' + task._id + '">Mark Incomplete</button>'; 
      }
      htmlToShow += completeButtonHtml;
      htmlToShow += '</div></div></div></div>';

      
    }
    $('#task-item-div').html(htmlToShow);

    // Change the color
    for (i in tasksBeingViewed) {
    }
    // Add click listenders for buttons 
    for (i in tasksBeingViewed) {

      

      var task = tasksBeingViewed[i];
      if (task.complete) {
        // Change the background color of complete tasks 
        $('#task-item-' + task._id).css('background-color', 'rgba(0,0,0,.5)');
        $('#task-item-controls-' + task._id).css('background-color', 'rgba(0,0,0,.5)');
      }
      (function(task, i){
        
        /**
         * Delete  button
         */
        $('#delete-task-btn-' + task._id).on('click', function () {
          $.post('api/deleteTask', {'tid': task._id}, function(data) {
            if (data.status === 'ok') {
              // Remove the deleted task from the list
              if (mode === 'future') {
                futureTasks.splice(i, 1);
                renderTasks();
              }
              if (mode === 'today') {
                todaysTasks.splice(i, 1);
                renderTasks();
              }
              if (mode === 'prev') {
                previousTasks.splice(i, 1);
                renderTasks();
              }
            }
          });
        });


        
        // Handle posting comments
        $('#complete-task-btn-' + task._id).on('click', function () {
          // Toggle completion
          $.post('api/toggleTaskCompletion', {'tid': task._id}, function(data) {
            if (data.status === 'ok') {
              // Remove the deleted task from the list
              if (mode === 'future') {
                futureTasks[i].complete = !futureTasks[i].complete;
                renderTasks();
              }
              if (mode === 'today') {
                todaysTasks[i].complete = !todaysTasks[i].complete;
                renderTasks();
              }
              if (mode === 'prev') {
                previousTasks[i].complete = !previousTasks[i].complete;
                renderTasks();
              }
            }
          });
        });
      }(task, i)) 
     } 

  }

  // Show today's tasks
  $('#today-task-button').on('click', function () {
    mode = 'today';
    renderTasks();
  });

  // Show previous tasks
  $('#previous-task-button').on('click', function () {
    mode = 'prev';
    renderTasks();
  });

  // Show future tasks
  $('#future-task-button').on('click', function () {
    mode = 'future'
    renderTasks();
  });

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
    var taskDetails = {
      description: $('#description-input').val(),
      deadline: $('#deadline-input').val(),
      priority: $('input[name=priority]:checked', '#add-task-form').val(),
      category: $('#category-input').val(),
      collaborators: $('#collaborators-input').val(),
    }
    $.post('api/addTask', taskDetails, function(data) {
      if (data.status === 'ok') {
        // Hide the modal
        $('.modal').css('display', 'none');
        // Clear any inputs 
        $('#description-input').val('');
        $('#collaborators-input').val('');
        setDeadlineToToday();
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