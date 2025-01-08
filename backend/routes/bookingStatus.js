const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get booking status for a user
router.get('/booking-status', async (req, res) => {
    const { email } = req.query;

    try {
        const result = await pool.query(
            `SELECT * FROM eventrequests WHERE organizer_email = $1 ORDER BY submission_date DESC`,
            [email]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching booking status:', error.message);
        res.status(500).json({ error: 'Failed to fetch booking status' });
    }
});

module.exports = router;
