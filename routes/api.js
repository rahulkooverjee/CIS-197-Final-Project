/*
 * This module defines all of the routes for all account related functionality including signing up
 * loggin in, and logging out
 *
 * Author: Rahul Kooverjee for his CIS 197 Final Project Fall 2018
 *
 */

// Imports 
var express = require('express');
var router = express.Router();
var Task = require('../models/task.js');
var isAuthenticated = require('../middlewares/isAuthenticated');

// Helper function that formats a JS date object into a string of the form YYYY-MM-DD
var formatDateString = function(date) {
  month = '' + (date.getMonth() + 1);
  day = '' + date.getDate();
  year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

/*
-----------------------------------------------------------------------------------------------------
Routes 
-----------------------------------------------------------------------------------------------------
*/

// Post route to add a task, only works if a user is already signed in!
router.post('/addTask', isAuthenticated, function (req, res, next) {
  // Create an array of users, add the current user as well as any collaborators
  var users = [];
  users.push(req.session.user); 
  var collaborators = req.body.collaborators.split(" ");
  for (i in collaborators) {
    users.push(collaborators[i])
  }

  // Set up parameters for the Task
  var description = req.body.description;
  var deadline = req.body.deadline;
  var priority = req.body.priority;
  var category = req.body.category;
  var complete = false;
  
  // Validate that the description isn't empty 
  if (description == "") {
    res.send({err: "Description can't be empty"}); 
    return;
  }

  // Save the task to the database
  var dbTask = new Task({ 
    users: users,
    description: description,
    deadline: deadline,
    priority: priority, 
    category: category,
    complete: complete 
  });
  dbTask.save(function (err, result) {
    if (!err) {
      res.json({ status: 'ok' });
    } else {
      res.send({err: err.message}); 
    }
  }) 
});

// Get route to get today's tasks, only works if a user is already signed in!
router.get('/getTodaysTasks', isAuthenticated, function (req, res, next) {
  var todaysDateString = formatDateString(new Date());
  Task.find({ users: { $in : [req.session.user]}, deadline: todaysDateString }, function (err, results) {
    if (!err) {
      res.json(results);
    } else {
      next(err);
    }
  });
});

// Get route to get previous tasks, only works if a user is already signed in!
router.get('/getPreviousTasks', isAuthenticated, function (req, res, next) {
  var todaysDateString = formatDateString(new Date());
  Task.find({ users: { $in : [req.session.user]}, deadline: { $lt : todaysDateString} }, function (err, results) {
    if (!err) {
      res.json(results);
    } else {
      next(err);
    }
  });
});

// Get route to get future tasks, only works if a user is already signed in!
router.get('/getFutureTasks', isAuthenticated, function (req, res, next) {
  var todaysDateString = formatDateString(new Date());
  Task.find({ users: { $in : [req.session.user]}, deadline: { $gt : todaysDateString} }, function (err, results) {
    if (!err) {
      res.json(results);
    } else {
      next(err);
    }
  });
});

/*
-----------------------------------------------------------------------------------------------------
WORK IN PROGRSS ROUTES - TODO
-----------------------------------------------------------------------------------------------------
*/
// TODO 
router.post('/toggleTaskCompletion', function (req, res, next) {
  Task.findById(req.body.tid, function (err, task) {
    task.complete = !task.complete;
    task.save(function (saveErr, result) {
      if (!err) {
        res.json({ status: 'ok' });
      } else {
        // TODO ERROR HANDLING 
        next(new Error('something went wrong: ' + err.message));
      }
    })
  })
});


/*
-----------------------------------------------------------------------------------------------------
THIS STUFF BELOW IS FOR DEBUGGING - REMOVE OUT BEFORE SUBMISSION
-----------------------------------------------------------------------------------------------------
*/
router.get('/getAllTasks', function (req, res, next) {
  Task.find({}, function (err, results) {
    if (!err) {
      res.json(results);
    } else {
      next(err);
    }
  });
});

router.get('/deleteAllTasks', function (req, res, next) {
  Task.remove({}, function (err, results) {
    if (!err) {
      res.json(results);
    } else {
      next(err);
    }
  });
});

module.exports = router;