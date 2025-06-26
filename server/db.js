const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = new Client({
  user: "avnadmin",
  password: "AVNS_L6PcvF7OBRIZu5QDpZ4",
  host: "pg-nyneos-kanavlt885-nyneos.g.aivencloud.com",
  port: 15247,
  database: "CorporateSaaS",
  ssl: { rejectUnauthorized: false },
});

db.connect()
  .then(() => console.log("Connected to database ✅"))
  .catch((err) => console.error("Connection error ❌", err));

// ✅ INSERT exposures
app.post("/api/exposures", async (req, res) => {
  const exposures = req.body;

  if (!Array.isArray(exposures) || exposures.length === 0) {
    return res.status(400).send({ error: "No exposure data provided" });
  }

  try {
    const fields = [
      "ref_number", "type", "bu", "vendor_name", "amount",
      "quantity", "maturity_date", "details", "currency", "status"
    ];

    const placeholders = exposures
      .map((_, i) =>
        `(${fields.map((_, j) => `$${i * fields.length + j + 1}`).join(",")})`
      )
      .join(",");

    const values = exposures.flatMap(row => [
      row.refNo,
      row.type,
      row.bu,
      row.vendorBeneficiary,
      row.amount,
      row.quantity || null,
      row.maturityExpiry || null,
      row.details || null,
      row.currency || null,
      row.status,
    ]);

    const query = `
      INSERT INTO exposures (${fields.join(", ")})
      VALUES ${placeholders}
      ON CONFLICT (ref_number) DO NOTHING;
    `;

    await db.query(query, values);
    res.status(200).send({ message: "Exposures inserted successfully!" });
  } catch (err) {
    console.error("Error inserting exposure data:", err);
    res.status(500).send({ error: "Failed to insert exposure data" });
  }
});

// ✅ UPDATE single exposure by refNo (Enhanced for edit functionality)
app.put("/api/exposures/:refNo", async (req, res) => {
  const { refNo } = req.params;
  const { status, comment, amount, quantity, maturity_date } = req.body;

  try {
    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    if (comment !== undefined) {
      updates.push(`details = $${paramCount}`);
      values.push(comment);
      paramCount++;
    }

    if (amount !== undefined) {
      updates.push(`amount = $${paramCount}`);
      values.push(amount);
      paramCount++;
    }

    if (quantity !== undefined) {
      updates.push(`quantity = $${paramCount}`);
      values.push(quantity);
      paramCount++;
    }

    if (maturity_date !== undefined) {
      updates.push(`maturity_date = $${paramCount}`);
      values.push(maturity_date);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).send({ error: "No fields to update" });
    }

    values.push(refNo); // Add refNo as the last parameter

    const query = `
      UPDATE exposures 
      SET ${updates.join(', ')} 
      WHERE ref_number = $${paramCount}
    `;

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send({ error: "Exposure not found" });
    }

    res.status(200).send({ message: "Exposure updated successfully!" });
  } catch (err) {
    console.error("Error updating exposure:", err);
    res.status(500).send({ error: "Failed to update exposure" });
  }
});

// ✅ DELETE single exposure by refNo
app.delete("/api/exposures/:refNo", async (req, res) => {
  const { refNo } = req.params;

  console.log('DELETE request received for refNo:', refNo);

  try {
    // First check if the record exists
    const checkResult = await db.query(
      "SELECT ref_number FROM exposures WHERE ref_number = $1",
      [refNo]
    );

    console.log('Record check result:', checkResult.rowCount);

    if (checkResult.rowCount === 0) {
      console.log('Record not found for refNo:', refNo);
      return res.status(404).json({ error: "Exposure not found" });
    }

    // Delete the record
    const result = await db.query(
      "DELETE FROM exposures WHERE ref_number = $1",
      [refNo]
    );

    console.log('Delete result rowCount:', result.rowCount);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Exposure not found or already deleted" });
    }

    console.log('Successfully deleted exposure:', refNo);
    res.status(200).json({ message: "Exposure deleted successfully!" });
  } catch (err) {
    console.error("Error deleting exposure:", err);
    res.status(500).json({ error: "Failed to delete exposure", details: err.message });
  }
});

// ✅ BULK update exposures
app.put("/api/exposures/bulk-update", async (req, res) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).send({ error: "No update data provided" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    for (const { refNo, status, comment } of updates) {
      await client.query(
        `UPDATE exposures SET status = $1, details = $2 WHERE ref_number = $3`,
        [status, comment || null, refNo]
      );
    }

    await client.query("COMMIT");
    res.status(200).send({ message: "Statuses updated successfully!" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in bulk update:", err);
    res.status(500).send({ error: "Failed to update exposure statuses" });
  } finally {
    client.release();
  }
});

// ✅ BULK delete exposures
app.delete("/api/exposures/bulk-delete", async (req, res) => {
  const { refNumbers } = req.body;

  if (!Array.isArray(refNumbers) || refNumbers.length === 0) {
    return res.status(400).send({ error: "No reference numbers provided" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const placeholders = refNumbers.map((_, i) => `$${i + 1}`).join(',');
    const query = `DELETE FROM exposures WHERE ref_number IN (${placeholders})`;
    
    const result = await client.query(query, refNumbers);

    await client.query("COMMIT");
    res.status(200).send({ 
      message: `${result.rowCount} exposures deleted successfully!`,
      deletedCount: result.rowCount
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in bulk delete:", err);
    res.status(500).send({ error: "Failed to delete exposures" });
  } finally {
    client.release();
  }
});

// ✅ GET pending approvals
app.get("/api/pending-approvals", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM exposures WHERE status = 'Submitted'");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching pending approvals:", err);
    res.status(500).send({ error: "Failed to fetch pending approvals" });
  }
});

// ✅ GET all exposures
app.get("/api/exposures/all", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM exposures ORDER BY ref_number");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching exposures:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ GET single exposure by refNo
app.get("/api/exposures/:refNo", async (req, res) => {
  const { refNo } = req.params;

  try {
    const result = await db.query("SELECT * FROM exposures WHERE ref_number = $1", [refNo]);
    
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Exposure not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching exposure:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    database: "Connected"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).send({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//Kanav