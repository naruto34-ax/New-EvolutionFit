require('dotenv').config();
const { Client } = require('pg');

async function revisarProductos() {
  // Conectamos usando tu misma URL del archivo .env
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Neon requiere SSL
  });

  try {
    await client.connect();
    console.log("Buscando productos en la base de datos...");
    
    const res = await client.query('SELECT id, name, price FROM products LIMIT 10;');
    
    if (res.rows.length === 0) {
      console.log("\n⚠️ RESULTADO: La tabla de productos está VACÍA en la base de datos.");
      console.log("Por eso te sale el error 'Uno o más productos ya no existen'.");
    } else {
      console.log("\n✅ RESULTADO: Productos encontrados en la base de datos:");
      console.table(res.rows);
    }
  } catch (error) {
    console.error("\n❌ Error al consultar:", error.message);
  } finally {
    await client.end();
  }
}

revisarProductos();