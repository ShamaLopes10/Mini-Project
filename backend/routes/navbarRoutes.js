const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Define role-specific navbar items
const navbarItems = {
    student: ['Campus Buzz', 'Book Event', 'Display All Venues', 'Check Booking Status'],
    faculty: ['Campus Buzz', 'Book Event', 'Display All Venues', 'Check Booking Status', 'View Event Requests', 'Grant Permissions'],
    authority: ['Campus Buzz', 'Book Event', 'Display All Venues', 'Check Booking Status', 'View Requests'],
    maintenance: ['Campus Buzz', 'Book Event', 'Display All Venues', 'Check Booking Status', 'View Approved Events', 'Check Equipment Condition']
};

// Route to get navbar items based on role
router.get('/navbar', authenticateToken, (req, res) => {
    const role = req.user.role;

    if (!navbarItems[role]) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    res.json({ items: navbarItems[role] });
});

module.exports = router;
