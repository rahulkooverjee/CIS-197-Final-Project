/*
 * This module defines the mongoose schema for a Task.
 *
 * Author: Rahul Kooverjee for his CIS 197 Final Project Fall 2018
 *
 */
var mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  users: { type: [String] },
  description: { type: String }, 
  deadline: { type: String },  
  priority: { type: String }, 
  category: { type: String },  
  complete: { type: Boolean }
});

module.exports = mongoose.model('Task', taskSchema);