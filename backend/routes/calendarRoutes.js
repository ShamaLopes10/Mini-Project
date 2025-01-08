const express = require('express');
const { pool } = require('../config/db'); // Database connection
const router = express.Router();
const { getIndianNationalHolidays } = require('../utils/holidays'); // Utility for Indian holidays

// Function to check if a given date is a Sunday
const isSunday = (date) => date.getDay() === 0;

// Route to get holidays (national holidays and Sundays)
router.get('/holidays', async (req, res) => {
  try {
    const indianHolidays = getIndianNationalHolidays(); // Array of national holidays
    const holidays = [];
    const currentYear = new Date().getFullYear();

    // Add all Sundays of the year to holidays
    for (let month = 0; month < 12; month++) {
      const sunday = new Date(currentYear, month, 1);
      while (sunday.getDay() !== 0) sunday.setDate(sunday.getDate() + 1);
      while (sunday.getMonth() === month) {
        holidays.push(sunday.toISOString().split('T')[0]);
        sunday.setDate(sunday.getDate() + 7);
      }
    }

    // Combine Sundays and national holidays
    const allHolidays = [...new Set([...holidays, ...indianHolidays])];
    res.json(allHolidays);
  } catch (err) {
    console.error('Error fetching holidays:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route to get events with Trustee approval
router.get('/events', async (req, res) => {
  const { date } = req.query; // Use query parameter instead of route parameter
  try {

    // let date = "2024-10-12T12:23:233Z"
    // // let date = "2024-10-12"
    const result = await pool.query(`
      SELECT id, event_name, event_date, start_time, end_time, venue_requested, poster_url 
      FROM eventrequests 
      WHERE status = 'Trustee accepted' AND DATE(event_date) = DATE($1)
      ORDER BY event_date ASC
    `,
    [date]
  );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events from the database' });
  }
});

// Route to get events for a specific date
router.get('/events/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const result = await pool.query(`
      SELECT event_name, start_time, end_time, venue_requested 
      FROM eventrequests 
      WHERE event_date = $1 AND status = 'Trustee accepted'
    `, [date]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events for date:', err);
    res.status(500).json({ error: 'Failed to fetch events for the specified date' });
  }
});

module.exports = router;