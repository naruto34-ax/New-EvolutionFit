const express = require("express");
const pool = require("../config/connection");
const { authenticateToken, requireRole } = require("./middleware");

const router = express.Router();
router.use(authenticateToken);

const POINTS_PER_ORDER = 100;
const METHODS = ["card_simulated", "card", "pse", "nequi", "cash"];
const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};
const STATUSES = Object.keys(TRANSITIONS);

const httpError = (status, message) => Object.assign(new Error(message), { status });

// Devuelve el mismo formato que usaba el frontend: id "EF-000001", items con qty
// y números como number (pg devuelve NUMERIC como texto, por eso el ::float8).
const SELECT_ORDERS = `
  SELECT o.order_number AS id, o.user_id AS "userId", o.user_name_snapshot AS "userName",
         o.total::float8 AS total, o.status, o.payment_method AS "paymentMethod",
         o.points_earned AS "pointsEarned", o.created_at AS "createdAt", o.updated_at AS "updatedAt",
         COALESCE(json_agg(json_build_object(
           'productId', oi.product_id, 'name', oi.product_name, 'emoji', oi.product_emoji,
           'price', oi.unit_price::float8, 'qty', oi.quantity) ORDER BY oi.id)
           FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id`;

// POST /api/orders  { items: [{ productId, quantity }], paymentMethod? }
router.post("/", async (req, res) => {
  const { items, paymentMethod = "card_simulated" } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: "El carrito está vacío." });
  if (!METHODS.includes(paymentMethod))
    return res.status(400).json({ error: "Método de pago no válido." });

  const qtyById = new Map();
  for (const it of items) {
    const q = Number(it.quantity ?? it.qty);
    if (typeof it.productId !== "string" || !Number.isInteger(q) || q < 1 || q > 50)
      return res.status(400).json({ error: "Cantidad o producto inválido en el carrito." });
    qtyById.set(it.productId, (qtyById.get(it.productId) ?? 0) + q);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: products } = await client.query(
      `SELECT id, name, emoji, price, stock FROM products
        WHERE id = ANY($1::varchar[]) AND is_active FOR UPDATE`,
      [[...qtyById.keys()]]
    );
    if (products.length !== qtyById.size)
      throw httpError(400, "Uno o más productos ya no existen o no están disponibles.");

    let total = 0;
    for (const p of products) {
      const q = qtyById.get(p.id);
      if (p.stock < q) throw httpError(409, `Stock insuficiente para ${p.name}.`);
      total += Number(p.price) * q;
    }
    total = Math.round(total * 100) / 100;

    const { rows: [user] } = await client.query("SELECT name FROM users WHERE id = $1", [req.user.id]);

    // Se inserta con un código temporal y luego se reemplaza por EF-000001, EF-000002...
    const { rows: [order] } = await client.query(
      `INSERT INTO orders (order_number, user_id, user_name_snapshot, total, status, payment_method, points_earned)
       VALUES ('tmp-' || gen_random_uuid(), $1, $2, $3, 'paid', $4, $5) RETURNING id`,
      [req.user.id, user?.name ?? null, total, paymentMethod, POINTS_PER_ORDER]
    );
    const { rows: [num] } = await client.query(
      `UPDATE orders SET order_number = 'EF-' || LPAD(id::text, 6, '0') WHERE id = $1 RETURNING order_number`,
      [order.id]
    );

    for (const p of products) {
      const q = qtyById.get(p.id);
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_emoji, unit_price, quantity)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, p.id, p.name, p.emoji, p.price, q]
      );
      await client.query("UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2", [q, p.id]);
    }

    // Pago SIMULADO. Con una pasarela real, aquí se guarda el id que ella devuelva.
    await client.query(
      `INSERT INTO payment_records (order_id, provider, provider_payment_id, status, amount)
       VALUES ($1, 'simulado', $2, 'approved', $3)`,
      [order.id, num.order_number, total]
    );

    await client.query("UPDATE users SET points = points + $1 WHERE id = $2", [POINTS_PER_ORDER, req.user.id]);
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);

    await client.query("COMMIT");
    const { rows } = await pool.query(`${SELECT_ORDERS} WHERE o.id = $1 GROUP BY o.id`, [order.id]);
    res.status(201).json({ order: rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error("POST /api/orders", err);
    res.status(500).json({ error: "No se pudo procesar el pedido." });
  } finally {
    client.release();
  }
});

// GET /api/orders/mine -> pedidos del usuario autenticado
router.get("/mine", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `${SELECT_ORDERS} WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ orders: rows });
  } catch (err) {
    console.error("GET /api/orders/mine", err);
    res.status(500).json({ error: "No se pudieron cargar tus pedidos." });
  }
});

// GET /api/orders -> todos los pedidos (admin)
router.get("/", requireRole("admin"), async (_req, res) => {
  try {
    const { rows } = await pool.query(`${SELECT_ORDERS} GROUP BY o.id ORDER BY o.created_at DESC`);
    res.json({ orders: rows });
  } catch (err) {
    console.error("GET /api/orders", err);
    res.status(500).json({ error: "No se pudieron cargar los pedidos." });
  }
});

// PATCH /api/orders/:id/status { status } (admin). :id es el código, ej. EF-000001
router.patch("/:id/status", requireRole("admin"), async (req, res) => {
  const { status } = req.body ?? {};
  if (!STATUSES.includes(status)) return res.status(400).json({ error: "Estado no válido." });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: [order] } = await client.query(
      "SELECT id, user_id, status, points_earned FROM orders WHERE order_number = $1 FOR UPDATE",
      [req.params.id]
    );
    if (!order) throw httpError(404, "Pedido no encontrado.");
    if (!TRANSITIONS[order.status].includes(status))
      throw httpError(409, `No se puede pasar de "${order.status}" a "${status}".`);

    if (status === "cancelled") {
      await client.query(
        `UPDATE products p SET stock = p.stock + oi.quantity
           FROM order_items oi WHERE oi.order_id = $1 AND oi.product_id = p.id`,
        [order.id]
      );
      await client.query("UPDATE users SET points = GREATEST(points - $1, 0) WHERE id = $2",
        [order.points_earned, order.user_id]);
    }
    await client.query("UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2", [status, order.id]);
    await client.query("COMMIT");

    const { rows } = await pool.query(`${SELECT_ORDERS} WHERE o.id = $1 GROUP BY o.id`, [order.id]);
    res.json({ order: rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error("PATCH /api/orders/:id/status", err);
    res.status(500).json({ error: "No se pudo actualizar el pedido." });
  } finally {
    client.release();
  }
});

module.exports = router;