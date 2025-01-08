import React, { useEffect, useState } from 'react';
import { fetchApprovedEvents } from '../services/api';

const EventsList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const loadEvents = async () => {
            const { data } = await fetchApprovedEvents();
            setEvents(data);
        };
        loadEvents();
    }, []);

    return (
        <div className="upcoming-events">
            <h2>Upcoming Events</h2>
            {events.map((event) => (
                <div key={event.id}>
                    <img src={event.poster_url} alt={event.event_name} />
                    <h4>{event.event_name}</h4>
                    <p>{`${event.event_date} | ${event.start_time} - ${event.end_time}`}</p>
                    <p>Organizer: {event.organizer_name}</p>
                </div>
            ))}
        </div>
    );
};

export default EventsList;
