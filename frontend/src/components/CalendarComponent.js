import React, { useState, useEffect } from 'react'; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getApprovedRequests, registerForEvent } from '../services/api'; 
import './CalendarComponent.css'; // Custom CSS for styling

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);
    const [error, setError] = useState(null);
    // const [registrationStatus, setRegistrationStatus] = useState(null); // For feedback on registration
    const [showModal, setShowModal] = useState(false); // For modal visibility
    const [selectedEvent, setSelectedEvent] = useState(null); // To store event ID for registration
    const [formData, setFormData] = useState({
        name: '',
        usn: '',
        semSection: '',
        department: '',
    });

    const [registrationStatus, setRegistrationStatus] = useState(null); // For feedback on registration
    
    // Fetch approved events on mount
    useEffect(() => {
        const loadEvents = async () => {
            try {
                const role = localStorage.getItem('role'); 
                const data = await getApprovedRequests(role);
                setEvents(data);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events. Please try again later.');
            }
        };
        loadEvents();
    }, []);

    // // Assign special styles for specific dates
    // const getTileClass = ({ date }) => {
    //     const isHoliday = date.getDay() === 0 || (date.getDay() === 6 && date.getDate() % 2 !== 0);
    //     return isHoliday ? 'holiday' : '';
    // };

    // Assign special styles for specific dates
// Assign special styles for specific dates
const getTileClass = ({ date, view }) => {
    if (view !== 'month') return ''; // Classes applied only in month view

    const isHoliday = date.getDay() === 0 || (date.getDay() === 6 && date.getDate() % 2 !== 0);
    const hasEvent = events.some((event) =>
        new Date(event.event_date).toDateString() === date.toDateString()
    );

    if (isHoliday) return 'holiday'; // Highlight holidays
    if (hasEvent) return 'event-day'; // Highlight event days
    return 'no-event-day'; // Styling for dates with no events or holidays
};


    // Handle click on a specific date
    // const handleDateClick = (date) => {
    //     const filteredEvents = events.filter(
    //         (event) => new Date(event.event_date).toDateString() === date.toDateString()
    //     );
    //     setSelectedDateEvents(filteredEvents);
    // };

    const handleDateClick = (date) => {
        const filteredEvents = events.filter((event) => {
            const eventDate = new Date(event.event_date);
            return eventDate.toISOString().slice(0, 10) === date.toISOString().slice(0, 10);
        });
        setSelectedDateEvents(filteredEvents);
    };
    

    // Open the registration form modal
    const openRegistrationForm = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    // Close the registration form modal
    const closeRegistrationForm = () => {
        setShowModal(false);
        setFormData({
            name: '',
            usn: '',
            semSection: '',
            department: '',
        });
    };

    // Handle form data change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Validate form fields
    const validateForm = () => {
        return formData.name && formData.usn && formData.semSection && formData.department;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert('Please fill all fields.');
            return;
        }
        try {
            const userId = localStorage.getItem('userId');
            const { name, usn, semSection, department } = formData; // Correctly destructure formData
            const response = await registerForEvent(selectedEvent.id, userId, { name, usn, semSection, department }); // Pass as an object
    
            if (response.success) {
                setRegistrationStatus('Successfully registered for the event!');
                closeRegistrationForm();
            } else {
                setRegistrationStatus('Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Error during registration:', err);
            setRegistrationStatus('Error during registration. Please try again later.');
        }
    };
    
    

    return (
        <div className="calendar-component">
            <h2>Event Calendar</h2>
            {error && <p className="error">{error}</p>}
            <Calendar
                 tileClassName={getTileClass}
                onClickDay={handleDateClick}
            />
            <div className="selected-date-events">
                <h3>Events on Selected Date:</h3>
                {selectedDateEvents.length > 0 ? (
                    selectedDateEvents.map((event) => (
                        <div key={event.id} className="event-card">
                            <h4>{event.event_name}</h4>
                            <p><strong>Time:</strong> {`${event.start_time} - ${event.end_time}`}</p>
                            <p><strong>Organizer:</strong> {event.organizer_name}</p>
                            <p><strong>Venue:</strong> {event.venue_requested}</p>
                            <button onClick={() => openRegistrationForm(event)}>Register</button>
                        </div>
                    ))
                ) : (
                    <p>No events scheduled for this date.</p>
                )}
            </div>
            {registrationStatus && <p className="registration-status">{registrationStatus}</p>}

            {/* Modal for registration form */}
            {showModal && (
    <div>
        <div className="modal-overlay" onClick={closeRegistrationForm}></div>
        <div className="modal">
            <div className="modal-content">
                <h3>Register for Event: {selectedEvent.event_name}</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                    </label>
                    <label>
                        USN:
                        <input type="text" name="usn" value={formData.usn} onChange={handleInputChange} />
                    </label>
                    <label>
                        Sem/Section:
                        <input type="text" name="semSection" value={formData.semSection} onChange={handleInputChange} />
                    </label>
                    <label>
                        Department:
                        <input type="text" name="department" value={formData.department} onChange={handleInputChange} />
                    </label>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={closeRegistrationForm}>Cancel</button>
                </form>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default CalendarComponent;