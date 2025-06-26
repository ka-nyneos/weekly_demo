const { Client } = require("pg");

const db = new Client({
  user: "avnadmin",
  password: "AVNS_L6PcvF7OBRIZu5QDpZ4",
  host: "pg-nyneos-kanavlt885-nyneos.g.aivencloud.com",
  port: 15247,
  database: "CorporateSaaS",
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
  .then(() => {
    console.log("✅ Connected to database");

    return db.query("TRUNCATE TABLE exposures RESTART IDENTITY CASCADE");
    // return db.query("SELECT * FROM exposures");
  })
  .then((result) => {
    console.log("📦 Exposure Records:");
    console.table(result.rows); // Display as a table in the console
  })
  .catch((err) => {
    console.error("❌ Error:", err.stack);
  })
  .finally(() => {
    db.end(); // Close the connection after the query
  });
