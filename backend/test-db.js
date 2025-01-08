const pool = require('./config/db'); // Ensure the path to db.js is correct

async function testConnection() {
    try {
        const result = await pool.query('SELECT * FROM users');
        console.log(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.message);
    } finally {
        pool.end(); // Close the pool after query execution
    }
}

testConnection();
