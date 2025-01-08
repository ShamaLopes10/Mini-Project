const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { pool } = require('../config/db');

// Multer configuration
const upload = multer({
  dest: 'uploads/', // Directory to save files
});

// Upload poster or report
router.post('/upload/:requestId', upload.single('file'), async (req, res) => {
  const { requestId } = req.params;
  const { type } = req.body;
  const filePath = req.file.path;

  try {
    const column = type === 'poster' ? 'poster_url' : 'report_url';
    await pool.query(
      `UPDATE eventrequests SET ${column} = $1 WHERE id = $2`,
      [filePath, requestId]
    );
    res.json({ message: `${type} uploaded successfully` });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;
