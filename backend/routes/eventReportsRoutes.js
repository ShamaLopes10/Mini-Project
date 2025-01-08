const express = require('express');
const { pool } = require('../config/db'); // Assuming you are using a database connection from 'db.js'
const router = express.Router();

// Route to fetch event reports
router.get('/event-reports', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM event_reports ORDER BY created_at DESC');
        res.json(result.rows); // Return event reports as response
    } catch (err) {
        console.error('Error fetching event reports:', err);
        res.status(500).json({ error: 'Failed to fetch event reports' });
    }
});

// Route to post a new event report (for event organizers)
router.post('/event-reports', async (req, res) => {
    const { title, description, image_url, event_date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO event_reports (title, description, image_url, event_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, image_url, event_date]
        );
        res.status(201).json(result.rows[0]); // Return the created report
    } catch (err) {
        console.error('Error posting event report:', err);
        res.status(500).json({ error: 'Failed to post event report' });
    }
});

module.exports = router;
