require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

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

//User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
//request Body parser middleware
app.use(bodyParser.json());

// Authentication middleware
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }
  
    try {
      console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("Decoded = " + decoded)
      req.user = decoded.user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized - Invalid token' + error });
    }
  };

//Authentication API's

//Signup API
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        const savedUser = await newUser.save();
        res.status(201).json({ user: savedUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Login API
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' + error });
    }
});

// Get all Notes
app.get('/api/notes', authenticateUser , async (req, res) => {
    try {
        const notes = await Note.find();
        res.json({ notes });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Get Note by Id
app.get('/api/notes/:id', authenticateUser , async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        res.json({ note });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a note
app.post('/api/notes', authenticateUser , async (req, res) => {
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
app.put('/api/notes/:id', authenticateUser , async (req, res) => {
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
app.delete('/api/notes/:id', authenticateUser , async (req, res) => {
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
noteSchema.index({ title: 'text', content: 'text' })
app.get('/api/search', authenticateUser , async (req, res) => {
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