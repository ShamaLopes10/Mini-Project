import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllVenues.css'; // Optional: Add CSS for styling

function AllVenues() {
    const [venues, setVenues] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchVenues() {
            try {
                const response = await axios.get('http://localhost:5000/api/venues/all-venues');

                setVenues(response.data);
            } catch (err) {
                setError('Failed to fetch venues. Please try again later.');
            }
        }
        fetchVenues();
    }, []);

    return (
        <div className="all-venues">
            <h1>All Venues</h1>
            {error && <p className="error">{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Capacity</th>
                        <th>Facilities</th>
                    </tr>
                </thead>
                <tbody>
                    {venues.map((venue) => (
                        <tr key={venue.id}>
                            <td>{venue.name}</td>
                            <td>{venue.capacity}</td>
                            <td>{venue.facilities}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllVenues;
