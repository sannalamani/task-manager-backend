const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const mongoose = require('mongoose');
const authenticate = require('../middleware/authMiddleware');


router.post('/create-project', authenticate, async (req, res) => {

    const { name, description, members } = req.body;

    if(!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const project = new Project({
            name,
            description,
            owner: req.user.userDetails.id,
            members: members ? members.split(',') : [],
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
);

router.get('/get-projects', authenticate, async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user.userDetails.id });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
);

router.get('/get-project/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid project id' });

    try {
        const project = await Project.findOne({ _id: id, owner: req.user.userDetails.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
);



module.exports = router;

