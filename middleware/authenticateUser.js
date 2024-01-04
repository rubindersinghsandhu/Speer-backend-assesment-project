// middleware/authenticateUser.js
const jwt = require('jsonwebtoken');

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

module.exports = authenticateUser;
