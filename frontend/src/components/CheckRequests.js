import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CheckRequests.css';

const CheckRequests = () => {
  const [requests, setRequests] = useState([]);
  const [updatedStatuses, setUpdatedStatuses] = useState({});

  const authorities = ['Placement', 'Maintenance Supervisor', 'HOD', 'Principal', 'Trustee'];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/all-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    fetchRequests();
  }, [updatedStatuses]);

  const handleAction = async (id, authority, action) => {
    const reason =
      action === 'Clarification' || action === 'Rejected'
        ? prompt(`Provide reason for ${action.toLowerCase()}:`)
        : '';

    try {
      const statusMessage = `${authority} ${action.toLowerCase()}`;
      const response = await axios.put(`http://localhost:5000/api/events/update-request/${id}`, {
        authority,
        action,
        reason,
        status: statusMessage,
      });
      alert(response.data.message);
      setUpdatedStatuses({}); // Trigger re-fetch
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  return (
    <div className="requests-container">
      <h2>Event Requests</h2>
      {requests.length === 0 ? (
        <p>No requests available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Organizer</th>
              <th>Venue</th>
              <th>Department</th> {/* New column header */}
              <th>Authority</th>
              <th>Actions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.event_name}</td>
                <td>{request.organizer_name}</td>
                <td>{request.venue_requested}</td>
                <td>{request.department || 'Not Provided'}</td> {/* New column value */}
                <td>
                  <select
                    onChange={(e) =>
                      setUpdatedStatuses((prev) => ({
                        ...prev,
                        [request.id]: { authority: e.target.value },
                      }))
                    }
                    defaultValue={updatedStatuses[request.id]?.authority || 'Select Authority'}
                  >
                    <option disabled>Select Authority</option>
                    {authorities.map((authority) => (
                      <option key={authority} value={authority}>
                        {authority}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleAction(request.id, updatedStatuses[request.id]?.authority, 'Accepted')
                    }
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleAction(request.id, updatedStatuses[request.id]?.authority, 'Rejected')
                    }
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      handleAction(request.id, updatedStatuses[request.id]?.authority, 'Clarification')
                    }
                  >
                    Clarification
                  </button>
                </td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CheckRequests;
