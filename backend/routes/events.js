
const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Fetch Approved Events
router.get('/approved-events', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, event_name, event_date, start_time, end_time, poster_url, organizer_name
            FROM eventrequests
            WHERE status = 'Trustee accepted'
            ORDER BY event_date ASC, start_time ASC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

