require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

//Connection to Mongodb
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true })


//Note Schema
const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
});


const Note = mongoose.model('Note', noteSchema);

// Middleware
app.use(bodyParser.json());

// Get all Notes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json({ notes });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Get Note by Id
app.get('/api/notes/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        res.json({ note });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a note
app.post('/api/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = new Note({ title, content });
        const savedNote = await newNote.save();
        res.status(201).json({ note: savedNote });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a note
app.put('/api/notes/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ note: updatedNote });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' + error });
    }
});

// Delete a note 
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ result: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Search functionality

noteSchema.index({title: 'text', content: 'text'})
app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    try {
      const results = await Note.find({ $text: { $search: q } });
      res.json({ results });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;