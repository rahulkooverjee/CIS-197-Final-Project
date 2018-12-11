/*
 * This module handles all JS related functionality for home.html (the home page)
 *
 * Author: Rahul Kooverjee for his CIS 197 Final Project Fall 2018
 *
 */

$(document).ready(function () {

  /*
  -----------------------------------------------------------------------------------------------------
  Variables Declerations
  -----------------------------------------------------------------------------------------------------
  */
  // Lists of previous, current, and future tasks
  var todaysTasks = [];
  var previousTasks = [];
  var futureTasks = []; 
  
  // Hacky, but we'll use a string to track which tasks to show
  var mode = 'today'; 

  // Also hacky, but use the ejs content to get the email of the user logged in
  var userLoggedIn = $('#task-header').text();
  userLoggedIn = userLoggedIn.substring(8, userLoggedIn.length);

  // Booleans for filiters
  var hasCompleteFilter = false;
  var completeFilter = false;
  var hasPriorityFilter = false;
  var priorityFilter = '';
  var hasCategoryFilter = false;
  var categoryFilter = '';

  /*
  -----------------------------------------------------------------------------------------------------
  Initial function calls when the page loads
  -----------------------------------------------------------------------------------------------------
  */
  getTasks(); // Get the tasks from the DB initially
  setDeadlineToToday(); // Set deadline of modal to be today

  // Set the max height of the tasks box to be 90% of the browser window size
  $('#tasks-box').css('max-height', $(window).height() * 0.85);
  $('#tasks-box').css('overflow', 'scroll');

  /*
  -----------------------------------------------------------------------------------------------------
  Function declerations
  -----------------------------------------------------------------------------------------------------
  */
  // Function that gets all tasks from the database - today's, previous, and future 
  function getTasks () {
    $.get('/api/getTodaysTasks', function (data) {
      todaysTasks = data;
      renderTasks(); // Show today's tasks
    });
    $.get('/api/getPreviousTasks', function (data) {
      previousTasks = data;
      // Sort so the MOST recent is first 
      previousTasks.sort((a, b) => b.deadline.localeCompare(a.deadline));
    });
    $.get('/api/getFutureTasks', function (data) {
      futureTasks = data;
      // Sort so the LEAST recent is first 
      futureTasks.sort((a, b) => a.deadline.localeCompare(b.deadline));
    });
  }

  // Set the deadline input on the add task form to be today's date by default 
  function setDeadlineToToday () {
    var today = new Date();
    $('#deadline-input').val(formatDateString(today));
  }

  // Formats a date as YYYY-MM-DD
  function formatDateString (date) {
    var month = (date.getMonth() + 1);               
    var day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    var dateString = date.getFullYear() + '-' + month + '-' + day;
    return dateString;
  }

  // Function to render tasks
  function renderTasks () {
    // Set which tasks to render
    var tasksBeingViewed = [];
    if (mode === 'future') tasksBeingViewed = futureTasks;
    if (mode === 'today') tasksBeingViewed = todaysTasks;
    if (mode === 'prev') tasksBeingViewed = previousTasks;

    // If there's no tasks to show, show that message
    if (!tasksBeingViewed || tasksBeingViewed.length == 0) {
      var noTaskHtml = '<h2>No Tasks</h2>';
      $('#task-item-div').html(noTaskHtml);
      return;
    }

    // Create HTML to add to the page
    var htmlToShow = '';
    for (let i in tasksBeingViewed) {
      let task = tasksBeingViewed[i];
      // Process filiters 
      // Complete filter 
      if (hasCompleteFilter && task.complete !== completeFilter) {
        continue;
      }
      // Priority filter 
      if (hasPriorityFilter && task.priority !== priorityFilter) {
        continue;
      }
      // Category filter 
      if (hasCategoryFilter && task.category !== categoryFilter) {
        continue;
      }

      htmlToShow += '<div class="task-item" id="task-item-' + task._id + '">';
      htmlToShow += '<h4 class="task-description task-item-content">' + task.description + '</h4>';
      htmlToShow += '<h6 class="task-item-content"><i> Due: ' + task.deadline + '</i></h6>';
      htmlToShow += '<h5 class="task-item-content"><i>Priority: </i>' + task.priority + '</h5>';
      htmlToShow += '<h5 class="task-item-content"><i>Category: </i>' + task.category + '</h5>';
      // Show collaborators if there are other people too (i.e. not just current user)
      if (task.users.length > 1) {
        var collaborators = ''; 
        for (let j in task.users) {
          // Skip the logged in user
          if (task.users[j] === userLoggedIn) continue;
          collaborators += task.users[j] + ' ';
        }
        htmlToShow += '<h5 class="task-item-content"><i>Collaborators: </i>' + collaborators + '</h5>';
      }  
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

    // Add click listenders for buttons 
    for (let i in tasksBeingViewed) {
      let task = tasksBeingViewed[i];
      if (task.complete) {
        // Change the background color of complete tasks 
        $('#task-item-' + task._id).css('background-color', 'rgba(0,0,0,.5)');
        $('#task-item-controls-' + task._id).css('background-color', 'rgba(0,0,0,.5)');
      }
      // NOTE - this needs to be done this way to avoid closure issues
      (function (task, i) {
        // Delete button
        $('#delete-task-btn-' + task._id).on('click', function () {
          $.post('api/deleteTask', {tid: task._id}, function (data) {
            if (data.status === 'ok') {
              // Remove the deleted task from the list and re-render
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

        // Toggle task complete button
        $('#complete-task-btn-' + task._id).on('click', function () {
          // Toggle completion
          $.post('api/toggleTaskCompletion', {tid: task._id}, function (data) {
            if (data.status === 'ok') {
              // Edit the toggled task list and rerender
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
      }(task, i)); 
    } 
  }

  // Function to apply filters
  function applyFilters () {
    // Get the value of the complete filter and set filter conditions accordingly 
    var completeFilterValue = $('#complete-filter').val();
    if (completeFilterValue === 'All') {
      hasCompleteFilter = false;
    } else if (completeFilterValue === 'Complete') {
      hasCompleteFilter = true;
      completeFilter = true;
    } else if (completeFilterValue === 'Incomplete') {
      hasCompleteFilter = true;
      completeFilter = false;
    }

    // Get the value of the priority filter and set filter conditions accordingly 
    var priorityFilterValue = $('#priority-filter').val();
    if (priorityFilterValue === 'All') {
      hasPriorityFilter = false;
    } else if (priorityFilterValue === 'High') {
      hasPriorityFilter = true;
      priorityFilter = 'High';
    } else if (priorityFilterValue === 'Medium') {
      hasPriorityFilter = true;
      priorityFilter = 'Medium';
    } else if (priorityFilterValue === 'Low') {
      hasPriorityFilter = true;
      priorityFilter = 'Low';
    } 

    // Get the value of the category filter and set filter conditions accordingly 
    var categoryFilterValue = $('#category-filter').val();
    if (categoryFilterValue === 'All') {
      hasCategoryFilter = false;
    } else if (categoryFilterValue === 'School') {
      hasCategoryFilter = true;
      categoryFilter = 'School';
    } else if (categoryFilterValue === 'Work') {
      hasCategoryFilter = true;
      categoryFilter = 'Work';
    } else if (categoryFilterValue === 'Personal') {
      hasCategoryFilter = true;
      categoryFilter = 'Personal';
    } 

    // Refresh views
    renderTasks();
  }


  /*
  -----------------------------------------------------------------------------------------------------
  Add onClick listenders to the various buttons
  -----------------------------------------------------------------------------------------------------
  */
  // Apply filters if apply filter button is pressed
  $('#apply-filter-button').on('click', function () {
    applyFilters();
  });

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
    mode = 'future';
    renderTasks();
  });

  // Open the add task model
  $('#add-task-button').on('click', function () {
    $('.modal').css('display', 'block');
  });

  // Close the add task model
  $('#cancel-task-button').on('click', function () {
    $('.modal').css('display', 'none');
  });

  // Submit the add task form when add task button is pressed
  $('#add-task-form').submit(function (e) {
    e.preventDefault(); // prevents refresh
    var taskDetails = {
      description: $('#description-input').val(),
      deadline: $('#deadline-input').val(),
      priority: $('input[name=priority]:checked', '#add-task-form').val(),
      category: $('#category-input').val(),
      collaborators: $('#collaborators-input').val()
    };
    $.post('api/addTask', taskDetails, function (data) {
      if (data.status === 'ok') {
        // Hide the modal
        $('.modal').css('display', 'none');
        // Clear any inputs 
        $('#description-input').val('');
        $('#collaborators-input').val('');
        $('#err-message').html('');
        setDeadlineToToday();
        // Add the new task to the relevent list of tasks, in the correct sorted order
        var newTask = data.task; 
        var todaysDateString = formatDateString(new Date()); 
        var taskDateString = newTask.deadline;
        if (taskDateString < todaysDateString) {
          previousTasks.push(newTask);
          previousTasks.sort((a, b) => b.deadline.localeCompare(a.deadline));
        } else if (taskDateString > todaysDateString) {
          futureTasks.push(newTask);
          futureTasks.sort((a, b) => a.deadline.localeCompare(b.deadline));
        } else {
          todaysTasks.unshift(newTask);
        }
        renderTasks();
      } else {
        $('#err-message').text('ERROR: ' + data.err);
      }
    });
  });
});