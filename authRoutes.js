// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Use environment variable for security

// Dummy user for testing
const dummyUser = {
    username: 'testUser',
    password: 'testPassword' // In a real application, use hashed passwords
};

// User registration (for testing, you could create a default user here)
router.post('/register', async (req, res) => {
    // This can be bypassed for testing
    return res.json({ message: 'Registration endpoint is disabled for testing.' });
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check against dummy user data
    if (username === dummyUser.username && password === dummyUser.password) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
});

// Secure route (for testing token validity)
router.get('/secure', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        res.json({ message: 'Access granted', username: decoded.username });
    });
});

module.exports = router;

