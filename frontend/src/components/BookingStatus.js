import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadForm from './UploadForm';
import './BookingStatus.css';

const BookingStatus = ({ userEmail }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      console.log(userEmail);
      try {
        const response = await axios.get('http://localhost:5000/api/booking-status?email=' + userEmail + '', 
          
        );
        console.log(response.data);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching booking status:', error);
      }
    };
console.log(userEmail);
    fetchBookings();
  },[userEmail]); ///////////

  return (
    <div>
      <h2>Booking Status</h2>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h3>{booking.event_name}</h3>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Reason:</strong> {booking.reason || 'N/A'}</p>
            <p><strong>Submitted on:</strong> {new Date(booking.submission_date).toLocaleString()}</p>
            {booking.status === 'Trustee accepted' && (
              <UploadForm requestId={booking.id} />
            )}
          </div>
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default BookingStatus;
