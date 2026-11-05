require('dotenv').config();
const { Client } = require('pg');

const products = [
  { id: 'prod1', name: 'Mancuernas Ajustables 20kg', category: 'equipment', price: 189900, stock: 15 },
  { id: 'prod2', name: 'Banda Elástica Set x5', category: 'equipment', price: 45900, stock: 30 },
  { id: 'prod3', name: 'Proteína Whey 2kg', category: 'supplements', price: 129900, stock: 20 },
  { id: 'prod4', name: 'Creatina Monohidrato 500g', category: 'supplements', price: 79900, stock: 25 },
  { id: 'prod5', name: 'Camiseta Dry-Fit Evolution', category: 'clothing', price: 59900, stock: 0 },
  { id: 'prod6', name: 'Leggins Compresión Pro', category: 'clothing', price: 89900, stock: 35 },
  { id: 'prod7', name: 'Colchoneta Yoga 6mm', category: 'equipment', price: 69900, stock: 20 },
  { id: 'prod8', name: 'Botella Térmica 1L', category: 'accessories', price: 39900, stock: 40 },
  { id: 'prod9', name: 'Guantes de Entrenamiento', category: 'accessories', price: 34900, stock: 30 },
  { id: 'prod10', name: 'Cuerda para Saltar Pro', category: 'equipment', price: 29900, stock: 45 },
  { id: 'prod11', name: 'Multivitamínico Sport', category: 'supplements', price: 54900, stock: 20 },
  { id: 'prod12', name: 'Foam Roller Masaje', category: 'accessories', price: 49900, stock: 25 }
];

async function seedProducts() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Conectado a Neon. Insertando los 12 productos...");

    for (const p of products) {
      const query = `
        INSERT INTO products (id, name, category, price, stock)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name, category = EXCLUDED.category, price = EXCLUDED.price, stock = EXCLUDED.stock;
      `;
      await client.query(query, [p.id, p.name, p.category, p.price, p.stock]);
      console.log(`✅ Producto insertado: ${p.id} - ${p.name}`);
    }

    console.log("\n🎉 ¡Los 12 productos fueron insertados con éxito!");

  } catch (error) {
    console.error("\n❌ Error al insertar:", error.message);
  } finally {
    await client.end();
  }
}

seedProducts();