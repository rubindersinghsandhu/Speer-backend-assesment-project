// controllers/noteController.js
const Note = require('../models/Note');

// Controller functions for note routes

// Get all Notes
const getAllNotes = async (req, res) => {
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
};

// Create a note
const createNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;
        const newNote = new Note({ title, content, owner: userId });
        const savedNote = await newNote.save();
        res.status(201).json({ note: savedNote });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Get Note by Id
const getNoteById = async (req, res) => {
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
};

// Update a note
const updateNote = async (req, res) => {
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
};

// Delete a note 
const deleteNote = async (req, res) => {
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
};

//Share functionality
const shareNote = async (req, res) => {
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
};


module.exports = {
    getAllNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
    shareNote
};
