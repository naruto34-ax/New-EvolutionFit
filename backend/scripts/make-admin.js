require("dotenv").config();
const pool = require("../config/connection");

const email = process.argv[2];
if (!email) {
  console.error("Uso: node scripts/make-admin.js correo@ejemplo.com");
  process.exit(1);
}

(async () => {
  try {
    const { rows } = await pool.query(
      "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, name, email, role",
      [email.toLowerCase()]
    );
    console.log(rows[0] ?? "No existe un usuario con ese correo.");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
})();