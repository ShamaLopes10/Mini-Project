import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from '../components/Calendar'; // Your Calendar component

const Dashboard = () => {
    const [holidays, setHolidays] = useState([]);
    const [events, setEvents] = useState([]);
    
    // Fetch holidays and events when the component mounts
    useEffect(() => {
        // Fetch holidays
        axios.get('http://localhost:5000/api/holidays')
            .then(response => {
                setHolidays(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the holidays:", error);
            });

        // Fetch events (assuming you have an endpoint for events)
        // axios.get('http://localhost:5000/api/events')
        //     .then(response => {
        //         setEvents(response.data);
        //     })
        //     .catch(error => {
        //         console.error("There was an error fetching the events:", error);
        //     });
    }, []);
    
    return (
        <div className="dashboard">
            <h1 align="center">Event Dashboard</h1>
            <Calendar holidays={holidays} events={events} />
        </div>
    );
};

export default Dashboard;