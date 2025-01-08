const express = require('express');
const { pool } = require('../config/db');  // Assuming you're using a PostgreSQL connection from 'db.js'
const router = express.Router();

// Route to get all holidays
router.get('/holidays', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM holidays');
        res.json(result.rows);  // Return the list of holidays
    } catch (err) {
        console.error('Error querying holidays:', err);
        res.status(500).json({ error: 'Something went wrong while fetching holidays' });
    }
});

// Route to add a holiday
router.post('/holidays', async (req, res) => {
    const { name, date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO holidays (name, date) VALUES ($1, $2) RETURNING *',
            [name, date]
        );
        res.status(201).json(result.rows[0]); // Return the added holiday
    } catch (err) {
        console.error('Error adding holiday:', err);
        res.status(500).json({ error: 'Something went wrong while adding the holiday' });
    }
});

module.exports = router;
