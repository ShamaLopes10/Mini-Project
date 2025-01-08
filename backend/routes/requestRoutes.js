const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Submit a Book Venue request
router.post('/submit-event', authenticateToken, async (req, res) => {
  try {
    const {
      organizer_name,
      organizer_phone,
      organizer_email,
      club_name,
      event_name,
      event_date,
      start_time,
      end_time,
      event_type,
      description,
      requirements,
      expected_audience,
      venue_requested,
    } = req.body;

    // Fetch venue capacity
    const venueQuery = 'SELECT capacity FROM venues WHERE venue_name = $1';
    const venueResult = await pool.query(venueQuery, [venue_requested]);

    if (venueResult.rowCount === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const venueCapacity = venueResult.rows[0].capacity;

    // Notify if expected audience exceeds venue capacity
    let notification = null;
    if (expected_audience > venueCapacity) {
      notification = `Expected audience (${expected_audience}) exceeds venue capacity (${venueCapacity}).`;
    }

    // Insert into eventrequests table
    const query = `
      INSERT INTO eventrequests (
        organizer_name, organizer_phone, organizer_email, club_name,
        event_name, event_date, start_time, end_time, event_type,
        description, requirements, expected_audience, venue_requested
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `;
    const values = [
      organizer_name,
      organizer_phone,
      organizer_email,
      club_name,
      event_name,
      event_date,
      start_time,
      end_time,
      event_type,
      description,
      requirements,
      expected_audience,
      venue_requested,
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Event submitted successfully',
      eventId: result.rows[0].id,
      notification,
    });
  } catch (error) {
    console.error('Error submitting event:', error);
    res.status(500).json({ message: 'Failed to submit event', error: error.message });
  }
});

// Fetch requests for Authority and Maintenance
router.get('/all-events', authenticateToken, authorizeRole(['authority', 'maintenance']), async (req, res) => {
  try {
    const query = 'SELECT * FROM eventrequests';
    const { rows } = await pool.query(query);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

module.exports = router;
