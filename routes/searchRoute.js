// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

//Search Note
router.get('/search', searchController.searchNote);

module.exports = router;