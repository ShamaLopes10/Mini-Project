const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env

// PostgreSQL Pool for raw queries
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',  // Database user from environment or default
    host: process.env.DB_HOST || 'localhost',  // Database host from environment or default
    database: process.env.DB_NAME || 'venue_booking',  // Database name from environment or default
    password: process.env.DB_PASSWORD || 'sam201',  // Database password from environment or default
    port: process.env.DB_PORT || 5433,  // Default port for PostgreSQL is 5432, but can use 5433 or another port
});

// Sequelize instance for ORM
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',  // Use environment variable or default
    username: process.env.DB_USER || 'postgres',  // Use environment variable or default
    password: process.env.DB_PASSWORD || 'sam201',  // Use environment variable or default
    database: process.env.DB_NAME || 'venue_booking',  // Use environment variable or default
    port: process.env.DB_PORT || 5433,  // Use environment variable or default port
    logging: false,  // Disable SQL logging for Sequelize
});

// Test the Sequelize connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

// Export both pool and sequelize instances
module.exports = {
    pool,
    sequelize,
};
