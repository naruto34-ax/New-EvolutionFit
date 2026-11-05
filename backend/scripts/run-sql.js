require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("../config/connection");

const archivo = process.argv[2];
if (!archivo) {
  console.error("Uso: node scripts/run-sql.js db/migrations/logros.sql");
  process.exit(1);
}

(async () => {
  try {
    const sql = fs.readFileSync(path.resolve(archivo), "utf8");
    await pool.query(sql);
    console.log("SQL ejecutado correctamente:", archivo);
    const { rows } = await pool.query("SELECT COUNT(*) FROM logros");
    console.log("Filas en logros:", rows[0].count);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
})();