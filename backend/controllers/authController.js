const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Default for development

// User registration
const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check for valid Sahyadri domain email
        if (!email.endsWith('@sahyadri.edu.in')) {
            return res.status(400).json({ message: 'Invalid email domain' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(email, hashedPassword, role);

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role }, // Payload
            JWT_SECRET,
            { expiresIn: '1h' } // Token expiration
        );

        res.json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user; // Attach user info to request
        next();
    });
};



// Middleware to authorize roles
const authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied for your role' });
    }
    next();
};

module.exports = { register, login, verifyToken, authorizeRole };
