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
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
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

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(201).json({ users });
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
        res.json({ token});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' + error });
    }
});

// Get all Notes
app.get('/api/notes', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find notes owned by the user
        const userNotes = await Note.find({ owner: userId });

        // Find notes shared with the user
        const sharedNotes = await Note.find({ sharedWith: userId });

        // Combine the two sets of notes
        let notes = [...userNotes, ...sharedNotes];
        notes = notes.map((note) => {
            return {
                "title" : note.title,
                "content" : note.content,
                "id" : note.id,
                "owner": note.owner
            }
        });
        res.json({ notes });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' + error });
    }
});

//Get Note by Id
app.get('/api/notes/:id', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const note = await Note.findById(req.params.id);

        //Checking if note belongs to current user
        if(!note.owner.equals(userId) && !note.sharedWith.includes(userId)) {
            return res.status(401).json({ error: 'Access Restricted' });
        }

        res.json({ note });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' + error });
    }
});

// Create a note
app.post('/api/notes', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;
        const newNote = new Note({ title, content, owner: userId });
        const savedNote = await newNote.save();
        res.status(201).json({ note: savedNote });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a note
app.put('/api/notes/:id', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;
        const updatedNote = await Note.findOneAndUpdate({_id: req.params.id, owner: userId}, { title, content }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ note: updatedNote });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' + error });
    }
});

// Delete a note 
app.delete('/api/notes/:id', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedNote = await Note.findOneAndDelete({_id: req.params.id, owner: userId});
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
app.get('/api/search', authenticateUser, async (req, res) => {
    const { q } = req.query;
    try {
        const results = await Note.find({ $text: { $search: q } });
        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Share functionality
app.post('/api/notes/:id/share', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        const { recipientUserId } = req.body;

        // Check if noteId and recipientUserId are provided
        if (!noteId || !recipientUserId) {
            return res.status(400).json({ error: 'Bad Request: Missing noteId or recipientUserId' });
        }

        // Logic to share the note

        // Find the note by ID
        const note = await Note.findOne({_id: noteId, owner: userId});

        // Check if the note exists
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Add the recipient to the sharedWith array
        note.sharedWith.push(recipientUserId);

        // Save the updated note
        await note.save();

        // Send success response
        res.status(200).json({ message: 'Note shared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;