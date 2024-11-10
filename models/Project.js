const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String }
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema);