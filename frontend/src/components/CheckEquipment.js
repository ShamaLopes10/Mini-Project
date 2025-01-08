// frontend/src/components/CheckEquipment.js
import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./CheckEquipment.css";

const CheckEquipment = () => {
  const [events, setEvents] = useState([]);
  const [statusMessages, setStatusMessages] = useState({}); // Messages for each event

  useEffect(() => {
    // Fetch approved events with requirements
    axios
      .get("/api/maintenance/check-equipment")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleSubmit = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    const equipmentStatus = event.requirements.map((requirement) => ({
      name: requirement,
      checked: document.getElementById(`${eventId}-${requirement}`).checked,
    }));

    axios
      .post("/api/maintenance/check-equipment", { eventId, equipmentStatus })
      .then((response) => {
        setStatusMessages((prev) => ({
          ...prev,
          [eventId]: response.data.message,
        }));
      })
      .catch((error) => console.error("Error submitting equipment status:", error));
  };

  return (
    <div>
      <h2>Check Equipment</h2>
      {events.map((event) => (
        <div key={event.id} style={{ marginBottom: "20px" }}>
          <h3>{event.event_name}</h3>
          <ul>
            {event.requirements.map((requirement) => (
              <li key={requirement}>
                <input
                  type="checkbox"
                  id={`${event.id}-${requirement}`}
                  defaultChecked={false}
                />
                <label htmlFor={`${event.id}-${requirement}`}>{requirement}</label>
              </li>
            ))}
          </ul>
          <button onClick={() => handleSubmit(event.id)}>Submit</button>
          {statusMessages[event.id] && (
            <p style={{ color: statusMessages[event.id].includes("All equipment checked") ? "green" : "red" }}>
              {statusMessages[event.id]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckEquipment;
