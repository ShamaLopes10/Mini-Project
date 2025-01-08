const{ pool }= require('../config/db');

const getApprovedRequests = async (role) => {
    try {
      const query = `
        SELECT * FROM eventrequests
        WHERE status = $1
      `;
      const params = ['Trustee accepted'];
  
      console.log('Executing query:', query);
      console.log('With parameters:', params);
  
      const result = await pool.query(query, params); // Ensure pool is imported correctly
      console.log('Query result:', result.rows);
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  };
  
module.exports = { getApprovedRequests };
