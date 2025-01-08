import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import './Calendar.css';

function CustomCalendar() {
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);

  // Fetch holidays and events from the backend
  useEffect(() => {
    // Fetch holidays
    axios.get('http://localhost:5000/api/calendar/holidays')
      .then(response => {
        setHolidays(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the holidays!", error);
      });

    // Fetch events
    axios.get('http://localhost:5000/api/calendar/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the events!", error);
      });
  }, []);

  // Check if a date is a holiday
  const tileClassName = ({ date }) => {
    const dateString = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    if (holidays.includes(dateString)) {
      return 'holiday';  // Add 'holiday' class if the date is in holidays list
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <Calendar
        tileClassName={tileClassName}
      />
      <div className="events-list">
        <h2>Upcoming Events</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                {event.event_date}: {event.title} (Organized by {event.organizer})
              </li>
            ))}
          </ul>
        ) : (
          <p>No events available.</p>
        )}
      </div>
    </div>
  );
}

export default CustomCalendar;