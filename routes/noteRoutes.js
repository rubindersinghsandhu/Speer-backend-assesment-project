// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

//Get all Notes
router.get('/', noteController.getAllNotes);
// Create a note
router.post('/', noteController.createNote);
//Get Note by Id
router.get('/:id', noteController.getNoteById);
//Update Note
router.put('/:id', noteController.updateNote);
//Delete Note
router.delete('/:id', noteController.deleteNote);
//ShareNote
router.post('/:id/share', noteController.shareNote);

module.exports = router;