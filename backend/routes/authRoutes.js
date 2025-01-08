const express = require('express');
const  {pool} = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//
const { login } = require('../controllers/authController');
//
const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key

// Login Endpoint
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Query user from database
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Validate role
        if (user.role !== role) {
            return res.status(403).json({ error: 'Unauthorized role' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Register Endpoint
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check for existing user
        const userExistsQuery = 'SELECT * FROM users WHERE email = $1';
        const { rows: existingUsers } = await pool.query(userExistsQuery, [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const insertUserQuery = `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3)
            RETURNING id, email, role
        `;
        const { rows: newUser } = await pool.query(insertUserQuery, [email, hashedPassword, role]);

        res.status(201).json({ message: 'User registered successfully', user: newUser[0] });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
