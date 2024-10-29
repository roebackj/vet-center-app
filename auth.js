// auth.js

const jwt = require('jsonwebtoken');

// Secret key for signing JWTs
const secretKey = 'put_info_here'; // Replace with a secure key

// Middleware for authentication
function authenticate(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token.' });
        }
        
        // Save user information in request for use in other routes
        req.userId = decoded.id;
        next();
    });
}

// Function to generate a token (for login, etc.)
function generateToken(user) {
    return jwt.sign({ id: user.id }, secretKey, {
        expiresIn: 86400 // expires in 24 hours
    });
}

module.exports = {
    authenticate,
    generateToken,
};
