require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const limiter = require('./middleware/rateLimiting')

const app = express();
const PORT = process.env.PORT || 3000;

//Connection to Mongodb
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true })

// Middleware
app.use(bodyParser.json());
app.use('/api/', limiter);

// Routes
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const searchRoutes = require('./routes/searchRoute');
const authenticateUser = require('./middleware/authenticateUser');

app.use('/api/auth', authRoutes);
app.use('/api/notes', authenticateUser, noteRoutes);
app.use('/api', authenticateUser, searchRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;