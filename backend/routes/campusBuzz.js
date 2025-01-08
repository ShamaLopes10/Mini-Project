const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const path = require('path');

// Serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Fetch the latest reports for Campus Buzz
router.get('/reports', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (id) 
        id, event_name, description, report_url, submission_date
      FROM eventrequests 
      WHERE status = 'Trustee accepted' 
        AND report_url IS NOT NULL
      ORDER BY id, submission_date DESC
    `);
    // console.log("ertyu",result);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reports:', error.message);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

module.exports = router;
