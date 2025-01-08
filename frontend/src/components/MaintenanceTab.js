import React, { useEffect, useState } from 'react';
import { getApprovedRequests } from '../services/api';
import './MaintenanceTab.css';

const MaintenanceTab = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getApprovedRequests('maintenance');
        setRequests(data);
      } catch (err) {
        setError('Failed to load approved requests. Please try again later.');
      }
    })();
  }, []);

  if (error) return <p className="no-requests">{error}</p>;

  return (
    <div className="maintenance-container">
      <h2>Approved Events (Maintenance)</h2>
      {requests.length > 0 ? (
        <table className="maintenance-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Venue</th>
              <th>Organizer</th>
              <th>Requirements</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.event_name}</td>
                <td>{req.event_date}</td>
                <td>{req.start_time}</td>
                <td>{req.end_time}</td>
                <td>{req.venue_requested}</td>
                <td>{req.organizer_name}</td>
                <td className="requirements-column">
                  {req.requirements && typeof req.requirements === 'object' ? (
                    <ul>
                      {Object.entries(req.requirements).map(([key, value]) => (
                        <li key={key}>
                          {key} - {value || 'unspecified'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'No requirements specified'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-requests">No approved requests found.</p>
      )}
    </div>
  );
};

export default MaintenanceTab;
