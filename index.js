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

app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json({ notes });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;