var mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  user: { type: String },
  description: { type: String }, 
  deadline: { type: Date },  
  priority: { type: String }, 
  category: { type: String },  
  complete: {type: Boolean }
})

module.exports = mongoose.model('Task', taskSchema);