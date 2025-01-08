const pool = require('../config/db');

const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const createUser = async (email, password, role, googleId = null) => {
    const result = await pool.query(
        'INSERT INTO users (email, password, role, google_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, password, role, googleId]
    );
    return result.rows[0];
};

module.exports = { findUserByEmail, createUser };
