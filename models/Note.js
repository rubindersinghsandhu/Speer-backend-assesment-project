// models/Note.js
const mongoose = require('mongoose');
const User = require('./User'); // Import the User model

//Note Schema
const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sharedWith: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

//Indexing fields for text search
noteSchema.index({ title: 'text', content: 'text' })

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
