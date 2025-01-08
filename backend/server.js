const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const { pool } = require('./config/db'); // Adjust the path based on your project structure
const { sequelize } = require('./config/db'); // Sequelize connection for other models
const userRoutes = require('./routes/userRoutes');
// const holidayRoutes = require('./routes/holidayRoutes');
// const calendarRoutes = require('./routes/calendarRoutes');
const venueRoutes = require('./routes/venueRoutes');
const eventReportsRoutes = require('./routes/eventReportsRoutes');
const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRequestRoutes = require('./routes/eventRequests');
const bookingStatusRoutes = require('./routes/bookingStatus');
const uploadRoutes = require('./routes/upload');
const equipmentCheckRoutes = require('./routes/maintenance');
const maintenanceRoutes = require("./routes/maintenance");
const campusBuzzRoutes = require('./routes/campusBuzz');
//const dashboardRoutes = require('./routes/dashboard');
const eventsRoutes = require('./routes/events');

// const ViewApprovedEventsRoutes = require('./routes/ViewApprovedEventsRoutes');
// const { default: ViewApprovedEvents } = require('../frontend/src/components/ViewApprovedEvents');
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON bodies
// app.use('/uploads', express.static('uploads')); // Serve static images
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.use('/api/users', userRoutes); // User routes
// app.use('/api/holidays', holidayRoutes); // Holiday routes
// app.use('/api/calendar', calendarRoutes); // Calendar routes
app.use('/api/venues', venueRoutes); // Venue routes
app.use('/api/reports', eventReportsRoutes); // Event Reports routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/events', requestRoutes); // Event Requests routes
app.use('/api/event-requests', eventRequestRoutes);
app.use('/api/booking-status', bookingStatusRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/maintenance', equipmentCheckRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/campus-buzz', campusBuzzRoutes);
app.use('/api/events', eventsRoutes);
app.use("/api/maintenance", maintenanceRoutes);
//app.use('/api/dashboard', dashboardRoutes);
// app.use('/')
// Submit a new venue request

// Multer configuration for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post('/api/requests/submit', async (req, res) => {
    const {
      organizer_name,
      organizer_phone,
      organizer_email,
      club_name,
      event_name,
      event_date,
      start_time,
      end_time,
      event_type,
      description,
      requirements,
      expected_audience,
      venue_requested,
      department,
    } = req.body;
  
    try {
      const result = await pool.query(
        `INSERT INTO eventrequests (
          organizer_name, organizer_phone, organizer_email, club_name, event_name, event_date,
          start_time, end_time, event_type, description, requirements, expected_audience,
          venue_requested, department
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13, $14) RETURNING *`,
        [
          organizer_name,
          organizer_phone,
          organizer_email,
          club_name,
          event_name,
          event_date,
          start_time,
          end_time,
          event_type,
          description,
          JSON.stringify(requirements),
          expected_audience,
          venue_requested,
          department,
        ]
      );
      res.json({ message: 'Event submitted successfully', data: result.rows[0] });
    } catch (error) {
      console.error('Error submitting event:', error);
      res.status(500).send('Failed to submit event');
    }
  });
  

    
        


// Fetch all event requests for authority
app.get('/api/events/all-requests', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM eventrequests ORDER BY event_date DESC;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching event requests:', error);
        res.status(500).json({ error: 'Failed to fetch event requests' });
    }
});

// Update request status (Accept, Reject, Clarification)
app.put('/api/events/update-request/:id', async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    try {
        const query = `
            UPDATE eventrequests
            SET status = $1, reason = $2
            WHERE id = $3
        `;
        const values = [status, reason || null, id];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request status updated successfully' });
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ error: 'Failed to update request status' });
    }
});

// Register for event endpoint
// Fetch approved events
app.get('/api/events', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM events WHERE status = $1', ['Trustee accepted']);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching events');
  }
});
// Register for an event
app.post('/api/register', async (req, res) => {
  const { name, usn, semSection, department, eventId } = req.body;
  try {
      await pool.query(
          'INSERT INTO registrations (name, usn, sem_section, department, event_id) VALUES ($1, $2, $3, $4, $5)',
          [name, usn, semSection, department, eventId]
      );
      res.json({ success: true });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error registering for event');
  }
})

// Fetch venues from the database
app.get('/api/venues', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, capacity FROM venues;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Failed to fetch venues:', error);
        res.status(500).json({ error: 'Failed to fetch venues' });
    }
});


// Route to fetch approved events for maintenance
app.get('/api/approved-requests', async (req, res) => {
  try {
      const result = await pool.query(
          "SELECT * FROM eventrequests WHERE status = 'Trustee accepted'"
      );
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching approved events:', error);
      res.status(500).send('Server Error');
  }
});

// Fetch booking status for a user
app.get('/api/booking-status', async (req, res) => {
  const { email } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM eventrequests WHERE organizer_email = $1 ORDER BY submission_date DESC`,
      [email]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching booking status:', error.message);
    res.status(500).json({ error: 'Failed to fetch booking status' });
  }
});

// // File upload setup
// const multer = require('multer');
// const upload = multer({
//   dest: path.join(__dirname, 'uploads'), // Directory to save files
// });

// // Upload event poster or report
// app.post('/api/upload/:requestId', upload.single('file'), async (req, res) => {
//   const { requestId } = req.params;
//   const { type } = req.body;
//   const filePath = req.file.path;

//   try {
//     const column = type === 'poster' ? 'poster_url' : 'report_url';
//     await pool.query(
//       `UPDATE eventrequests SET ${column} = $1 WHERE id = $2`,
//       [filePath, requestId]
//     );
//     res.json({ message: `${type} uploaded successfully` });
//   } catch (error) {
//     console.error('Error uploading file:', error.message);
//     res.status(500).json({ error: 'Failed to upload file' });
//   }
// });

// API: Upload a report and save it as binary data
app.post('/api/upload-report', upload.single('report'), async (req, res) => {
  try {
    const { requestId } = req.body; // Get the event request ID
    const reportBuffer = req.file.buffer; // Get the file's buffer
    const fileName = req.file.originalname; // Get the file name

    // Save report in the database
    await pool.query(
      'UPDATE eventrequests SET report_url = $1, response = $2 WHERE id = $3',
      [reportBuffer, fileName, requestId]
    );

    res.status(200).json({ message: 'Report uploaded successfully' });
  } catch (error) {
    console.error('Error uploading report:', error);
    res.status(500).json({ error: 'Error uploading report' });
  }
});

// API: Retrieve all reports
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, event_name, description, response, submission_date FROM eventrequests WHERE report_url IS NOT NULL ORDER BY submission_date DESC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Error fetching reports' });
  }
});

// API: Retrieve a specific report as a file
app.get('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT report_url, response FROM eventrequests WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const reportBuffer = result.rows[0].report_url;
    const fileName = result.rows[0].response;

    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    res.end(reportBuffer);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Error fetching report' });
  }
});
// API to fetch events with status='Trustee accepted' and their requirements
// app.get('/api/check-equipment', async (req, res) => {
//     try {
//       const eventsQuery = `
//         SELECT id, event_name, organizer_name, event_date, requirements
//         FROM eventrequests
//         WHERE status = 'Trustee accepted';
//       `;
//       const events = await pool.query(eventsQuery);
//       res.json(events.rows);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error fetching events');
//     }
//   });


// // API to update equipment check status
// app.post('/api/equipment-check', async (req, res) => {
//     const { eventId, checkedItems, complaints } = req.body;
  
//     try {
//       const missingItems = [];
  
//       // Fetch requirements for the event
//       const requirementsQuery = `
//         SELECT requirements
//         FROM eventrequests
//         WHERE id = $1;
//       `;
//       const result = await pool.query(requirementsQuery, [eventId]);
//       const requirements = result.rows[0].requirements;
  
//       // Check for missing items
//       for (const [item, count] of Object.entries(requirements)) {
//         if (!checkedItems[item] || checkedItems[item] < count) {
//           missingItems.push({ item, required: count, returned: checkedItems[item] || 0 });
//         }
//       }
  
//       if (missingItems.length > 0) {
//         res.json({
//           message: 'Missing equipment detected.',
//           missingItems,
//           complaints,
//         });
//       } else {
//         res.json({
//           message: 'All equipment checked.',
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error updating equipment check status');
//     }
//   });
  
  // app.listen(port, () => {
  //   console.log(`Server running on http://localhost:${port}`);
  // });

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Server is up and running!' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message || err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

// Authenticate database connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected successfully!');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
