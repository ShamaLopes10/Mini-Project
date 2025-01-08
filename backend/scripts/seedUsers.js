const bcrypt = require('bcrypt');
const pool = require('./config/db');

async function hashPasswords() {
    const users = [
        { email: 'student@sahyadri.edu.in', password: 'password123', role: 'student' },
        { email: 'faculty@sahyadri.edu.in', password: 'password123', role: 'faculty' },
        { email: 'authority@sahyadri.edu.in', password: 'password123', role: 'authority' },
        { email: 'maintenance@sahyadri.edu.in', password: 'password123', role: 'maintenance' }
    ];

    for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3)', [
            user.email,
            hashedPassword,
            user.role
        ]);
    }
    console.log('Users added with hashed passwords!');
}

hashPasswords();
