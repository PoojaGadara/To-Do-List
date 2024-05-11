const mongoose = require('mongoose');

const todoItemSchema = new mongoose.Schema({
    taskDescription: {
        type: String,
        required: true
    },
    statusFlag: {
        type: String,
        enum: ['pending', 'completed', 'in_progress'],
        default: 'pending'
    },
    dueDate: {
        type: Date,
        default : Date.now()
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    modifiedAt :{
        type : Date
    }
});

const todoItemModel = mongoose.model('TodoItem', todoItemSchema);

module.exports = {
    todoItemModel
}