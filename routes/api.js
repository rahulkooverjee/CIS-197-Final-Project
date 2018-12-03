var express = require('express')
var router = express.Router();
var Task = require('../models/task.js')


router.post('/addTask', function (req, res, next) {
  var user = req.session.user;
  var description = req.body.description;
  var deadline = req.body.deadline;
  var priority = req.body.priority;
  var category = req.body.category;
  var complete = false;
  // todo check if description is empty
  console.log(req.body); 
  var dbTask = new Task(
    { user: user,
      description: description,
      deadline: deadline,
      priority: priority, 
      category: category,
      complete: complete 
    });
  if (description == "") {
    res.send({err: "Description can't be empty"}); 
    return;
  }
  dbTask.save(function (err, result) {
    if (!err) {
      res.json({ status: 'ok' });
    } else {
      // TODO ERROR HANDLING
      res.send({err: err.message}); 
    }
  }) 
});

router.get('/getTasks', function (req, res, next) {
  Task.find({user: req.session.user}, function (err, results) {
    if (!err) {
      res.json(results);
    } else {
      next(err);
    }
  });
});

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



module.exports = router;