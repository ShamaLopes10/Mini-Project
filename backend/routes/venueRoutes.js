const express = require('express');
const {pool} = require('../config/db');
const router = express.Router();

// Fetch all venues
router.get('/all-venues', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM venues');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching venues:', err);
        res.status(500).json({ error: 'Failed to fetch venues from the database' });
    }
});

module.exports = router;
