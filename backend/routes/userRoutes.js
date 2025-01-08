const express = require('express');
const bcrypt = require('bcrypt');
const {pool} = require('../config/db');
const router = express.Router();

// Route to handle login (manual)
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if user exists in the database
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Check role
        if (user.role !== role) {
            return res.status(400).json({ error: 'Role does not match the user\'s role' });
        }

        // Send success response with user info
        res.status(200).json({ message: 'Login successful', role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to get user role (if needed)
router.get('/role/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const result = await pool.query('SELECT role FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            res.json({ role: result.rows[0].role });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
