// controllers/searchController.js
const Note = require('../models/Note');

// Controller function for Search routes
const searchNote = async (req, res) => {
    const { q } = req.query;
    try {
        const results = await Note.find({ $text: { $search: q } });
        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {searchNote};