const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String }
    },
    dueDate: { type: Date },
    status: { type: String, enum: ['backlog', 'to-do', 'in-progress', 'done'], default: 'open' },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Task', taskSchema);