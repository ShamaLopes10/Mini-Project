import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookVenueForm.css';

const BookVenueForm = () => {
  const [formData, setFormData] = useState({
    organizer_name: '',
    organizer_phone: '',
    organizer_email: '',
    club_name: '',
    event_name: '',
    event_date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    event_type: '',
    description: '',
    requirements: {
      sound_system: false,
      cordless_mike: 0,
      stand_mike: 0,
      projector_with_screen: false,
      camera_with_photographer: false,
    },
    expected_audience: '',
    venue_requested: '',
    department: '',
  });

  const [venues, setVenues] = useState([]);
  const [notification, setNotification] = useState(null);

  const departments = ['CSE', 'ISE/DS', 'EC', 'AIML', 'ME/RA'];

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/venues');
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setNotification('Failed to load venues.');
      }
    };
    fetchVenues();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('requirements.')) {
      const key = name.split('.')[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        requirements: {
          ...prevFormData.requirements,
          [key]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedVenue = venues.find((venue) => venue.name === formData.venue_requested);
    if (selectedVenue && formData.expected_audience > selectedVenue.capacity) {
      setNotification(`The expected audience exceeds the capacity of the selected venue (${selectedVenue.capacity}).`);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/requests/submit',
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setNotification(response.data.notification || 'Event submitted successfully');
    } catch (error) {
      console.error('Error submitting event:', error);
      setNotification('Failed to submit event. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Book Venue</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Organizer Name:
          <input
            type="text"
            name="organizer_name"
            value={formData.organizer_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Organizer Phone:
          <input
            type="tel"
            name="organizer_phone"
            value={formData.organizer_phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Organizer Email:
          <input
            type="email"
            name="organizer_email"
            value={formData.organizer_email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Club Name:
          <input
            type="text"
            name="club_name"
            value={formData.club_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Event Name:
          <input
            type="text"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Event Date:
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Event Type:
          <select name="event_type" value={formData.event_type} onChange={handleChange} required>
            <option value="" disabled>Select event type</option>
            <option value="Tech Talk">Tech Talk</option>
            <option value="Workshop">Workshop</option>
            <option value="Competition">Competition</option>
            <option value="Meeting">Meeting</option>
            <option value="Others">Others</option>
          </select>
        </label>
        <label>
          Department:
          <select name="department" value={formData.department} onChange={handleChange} required>
            <option value="" disabled>Select department</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Requirements:
          <div>
            <label>
              <input
                type="checkbox"
                name="requirements.sound_system"
                checked={formData.requirements.sound_system}
                onChange={handleChange}
              />
              Sound System
            </label>
            <label>
              Cordless Mike:
              <input
                type="number"
                name="requirements.cordless_mike"
                value={formData.requirements.cordless_mike}
                onChange={handleChange}
                min="0"
              />
            </label>
            <label>
              Stand Mike:
              <input
                type="number"
                name="requirements.stand_mike"
                value={formData.requirements.stand_mike}
                onChange={handleChange}
                min="0"
              />
            </label>
            <label>
              <input
                type="checkbox"
                name="requirements.projector_with_screen"
                checked={formData.requirements.projector_with_screen}
                onChange={handleChange}
              />
              Projector with Screen
            </label>
            <label>
              <input
                type="checkbox"
                name="requirements.camera_with_photographer"
                checked={formData.requirements.camera_with_photographer}
                onChange={handleChange}
              />
              Camera with Photographer
            </label>
          </div>
        </label>
        <label>
          Expected Audience:
          <input
            type="number"
            name="expected_audience"
            value={formData.expected_audience}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Venue Requested:
          <select
            name="venue_requested"
            value={formData.venue_requested}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a venue</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.name}>
                {venue.name} (Capacity: {venue.capacity})
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
      {notification && <p className="notification">{notification}</p>}
    </div>
  );
};

export default BookVenueForm;
