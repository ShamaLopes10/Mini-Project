// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


const Navbar = ({ role }) => {
    return (
        <nav>
            <ul>
            <div className="app-logo">
            <img src="sahyadri_logo.jpg" alt="Sahyadri Logo" />
            </div>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/campus-buzz">Event Reports</Link></li>
                <li><Link to="/book-event">Book Event</Link></li>
                <li><Link to="/venues">All Venues</Link></li>
                <li><Link to="/booking-status">Booking Status</Link></li>
                
                <li>
                {role === 'authority' && (
                    <Link to="/check-requests">Check Requests</Link>
                )}
                </li>
                <li>
                {role === 'maintenance' && (
                    <>
                        <li><Link to="/maintenance">View Approved Events</Link></li>
                        {/* <li><Link to="/check-equipment">Check Equipment Condition</Link></li> */}
                    </>
                )}
</li>
                {/* {role === 'faculty' && (
                    <li><Link to="/event-requests">View Event Requests</Link></li>
                )} */}
            </ul>
        </nav>
    );
}

export default Navbar;
