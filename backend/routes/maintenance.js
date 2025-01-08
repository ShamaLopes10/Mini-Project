// backend/routes/maintenance.js
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Database connection

// Get all approved events and their requirements
router.get("/check-equipment", async (req, res) => {
  try {
    const query = `
      SELECT id, event_name, requirements 
      FROM eventrequests 
      WHERE status = 'Trustee accepted';
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching approved events:", error);
    res.status(500).json({ message: "Error fetching approved events." });
  }
});


// backend/routes/maintenance.js
router.post("/check-equipment", async (req, res) => {
  try {
    const { eventId, equipmentStatus } = req.body;
    const uncheckedItems = equipmentStatus.filter(item => !item.checked).map(item => item.name);

    let responseMessage;
    if (uncheckedItems.length === 0) {
      responseMessage = "All equipment checked.";
    } else {
      responseMessage = `Damaged/Missing Equipment: ${uncheckedItems.join(", ")}`;
    }

    // Insert into equipment_status table
    const insertQuery = `
      INSERT INTO equipment_status (event_id, equipment_name, status)
      VALUES ($1, $2, $3)
    `;
    for (const equipment of equipmentStatus) {
      await db.query(insertQuery, [eventId, equipment.name, equipment.checked]);
    }

    res.json({ message: responseMessage });
  } catch (error) {
    console.error("Error updating equipment status:", error);
    res.status(500).json({ message: "Error updating equipment status." });
  }
});


module.exports = router;
