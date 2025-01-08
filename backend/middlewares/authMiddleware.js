const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use secure key from .env

// Middleware to verify token and attach user data
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Access token is required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user; // Attach decoded user data to the request
        next();
    });
};

// Middleware to mock authentication for development/testing purposes
const mockAuthenticate = (req, res, next) => {
    // Mock user for development or local testing
    req.user = { role: 'student', id: 1, email: 'testuser@sahyadri.edu.in' }; 
    console.log('Mock user authenticated:', req.user);
    next();
};

// Middleware to authorize based on roles
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied for your role' });
        }
        next();
    };
};

// Middleware to generate a token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { 
    authenticateToken, 
    authorizeRole, 
    mockAuthenticate, 
    generateToken 
};
