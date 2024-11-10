const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const authenticate = require('../middleware/authMiddleware');

router.post('/create-task', authenticate, async (req, res) => {
    const { name, description, status, projectId } = req.body;
    try {
        const task = new Task({
            name,
            description,
            status,
            project: projectId
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

router.get('/get-tasks/:projectId', authenticate, async (req, res) => {
    const { projectId } = req.params;
    try {
        const tasks = await Task.find({ project: projectId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ message: error });
    }
}
);

router.get('/get-task/:taskId', authenticate, async (req, res) => {
    const { taskId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(taskId)) return res.status(400).json({ error: 'Invalid task id' });

    try {
        const task = await Task.findOne({ _id: taskId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
);

router.put('/update-task', authenticate, async (req, res) => {
    console.log(req.body);
    const { _id, name, description, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ error: 'Invalid task id' });

    try {
        const task = await Task.findOne({ _id: _id });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        task.name = name;
        task.description = description;
        task.status = status;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
);

router.delete('/delete-task/:taskId', authenticate, async (req, res) => {
    const { taskId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(taskId)) return res.status(400).json({ error: 'Invalid task id' });
    try {
        const task = await Task.findByIdAndDelete({ _id: taskId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
);

module.exports = router;