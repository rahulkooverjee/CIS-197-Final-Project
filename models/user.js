/*
 * This module defines the mongoose schema for a User.
 *
 * Author: Rahul Kooverjee for his CIS 197 Final Project Fall 2018
 *
 */
var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String }
});

module.exports = mongoose.model('User', userSchema);