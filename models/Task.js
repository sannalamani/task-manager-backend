const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    status: { type: String, enum: ['backlog', 'to-do', 'in-progress', 'completed'], default: 'open' },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Task', taskSchema);