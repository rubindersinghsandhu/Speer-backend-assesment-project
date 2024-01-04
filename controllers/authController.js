// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

//Authentication API's

//Signup API
const signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        const savedUser = await newUser.save();
        res.status(201).json({ user: savedUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Login API
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' + error });
    }
};

module.exports = {
    signup,
    login
};