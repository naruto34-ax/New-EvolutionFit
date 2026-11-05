const express = require("express");
const pool = require("../config/connection");               // AJUSTAR: tu pool de Neon (ver paso 3 de la guía)
const { authenticateToken: verificarToken } = require("./middleware");      // AJUSTAR: tu middleware JWT (ver paso 4 de la guía)

const router = express.Router();

/**
 * Suma progreso a un logro del usuario. Se llama DESDE EL SERVIDOR
 * (por ejemplo al terminar una rutina), nunca directo desde el navegador.
 * Devuelve { progreso, desbloqueado_en } o null si el logro no existe.
 */
async function registrarProgreso(usuarioId, codigo, incremento = 1) {
  const { rows } = await pool.query(
    `WITH l AS (SELECT id, meta FROM logros WHERE codigo = $2 AND activo)
     INSERT INTO usuario_logros AS ul (usuario_id, logro_id, progreso, desbloqueado_en)
     SELECT $1, l.id, LEAST($3::int, l.meta), CASE WHEN $3::int >= l.meta THEN NOW() END FROM l
     ON CONFLICT (usuario_id, logro_id) DO UPDATE
       SET progreso        = LEAST(ul.progreso + $3::int, (SELECT meta FROM l)),
           desbloqueado_en = COALESCE(ul.desbloqueado_en,
                               CASE WHEN ul.progreso + $3::int >= (SELECT meta FROM l) THEN NOW() END),
           actualizado_en  = NOW()
     RETURNING progreso, desbloqueado_en`,
    [usuarioId, codigo, incremento]
  );
  return rows[0] ?? null;
}

// GET /api/logros -> todos los logros activos con el progreso del usuario autenticado
router.get("/", verificarToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT l.id, l.codigo, l.titulo, l.descripcion, l.meta, l.puntos,
              COALESCE(ul.progreso, 0)      AS progreso,
              ul.desbloqueado_en            AS "desbloqueadoEn"
         FROM logros l
         LEFT JOIN usuario_logros ul ON ul.logro_id = l.id AND ul.usuario_id = $1
        WHERE l.activo
        ORDER BY l.id`,
      [req.user.id]
    );
    res.json({ logros: rows });
  } catch (err) {
    console.error("GET /api/logros", err);
    res.status(500).json({ error: "No se pudieron cargar los logros" });
  }
});

// Solo para pruebas: POST /api/logros/:codigo/progreso { incremento }
// Se desactiva en producción para que nadie pueda darse logros desde el navegador.
if (process.env.NODE_ENV !== "production") {
  router.post("/:codigo/progreso", verificarToken, async (req, res) => {
    const incremento = Number.parseInt(req.body?.incremento ?? 1, 10);
    if (!Number.isInteger(incremento) || incremento < 1 || incremento > 100) {
      return res.status(400).json({ error: "incremento debe ser un entero entre 1 y 100" });
    }
    try {
      const r = await registrarProgreso(req.user.id, req.params.codigo, incremento);
      if (!r) return res.status(404).json({ error: "Logro no encontrado" });
      res.json(r);
    } catch (err) {
      console.error("POST /api/logros/:codigo/progreso", err);
      res.status(500).json({ error: "No se pudo registrar el progreso" });
    }
  });
}

module.exports = router;
module.exports.registrarProgreso = registrarProgreso;
