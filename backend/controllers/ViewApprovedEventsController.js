const pool = require('../config/db'); // Import the database connection

// Define the getApprovedEvents function
const getApprovedEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM eventrequests WHERE status = 'Trustee accepted'`
    );
    console.log(result);
        
        res.json({msg : "abcdfghmm" , data:result.rows});
    // res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching approved events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Export the function
module.exports = { getApprovedEvents };
