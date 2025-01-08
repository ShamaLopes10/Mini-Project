import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// fetch(`${API_URL}/api/endpoint`, {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


export const getApprovedRequests = async (role) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/event-requests/approved-requests`, {
      params: { role },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw error;
  }
};

// api.js (services/api.js)
// export const registerForEvent = async (eventId, userId) => {
//   try {
//       const response = await fetch('/api/register', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ eventId, userId }),
//       });
//       const data = await response.json();
//       return data; // Expect { success: true } or an error message
//   } catch (err) {
//       console.error('Error registering for event:', err);
//       throw err;
//   }
// };

// export const registerForEvent = async (eventId, userId, formData) => {
//   try {
//       const response = await fetch(`/api/registerEvent`, {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//               eventId,
//               userId,
//               ...formData,
//           }),
//       });
//       return await response.json();
//   } catch (err) {
//       console.error('Error in API call:', err);
//       return { success: false };
//   }
// };

export const registerForEvent = async (eventId, userId, formData) => {
  const response = await axios.post('/api/events/register', {
      event_id: eventId,
      user_id: userId,
      ...formData,
  });
  return response.data;
};
