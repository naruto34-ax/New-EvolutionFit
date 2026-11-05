import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Encabezado, Tabs, Badge, Barra, Vacio } from "./ui";
import { useLogros } from "../hooks/useLogros";
import "../css/evolution.css";



const PUNTOS_POR_NIVEL = 100;
const FILTROS = [["todos", "Todos"], ["logrados", "Logrados"], ["pendientes", "En curso"]];
const fecha = (iso) => new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });

function Anillo({ pct, completo }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <svg className="ef-ring" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label={`${pct}% completado`}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="7" />
      <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" strokeLinecap="round"
        stroke={completo ? "var(--ef-signal)" : "var(--ef-primary)"}
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 32 32)" />
      <text x="32" y="38" textAnchor="middle">{pct}</text>
    </svg>
  );
}

/** token: el JWT del usuario autenticado (el mismo que usa tu Login). */
export default function SistemaLogros({ nombre = "Tu progreso" }) {
  const { token, user } = useAuth();
  const { logros, cargando, error, recargar } = useLogros();
  const [filtro, setFiltro] = useState("todos");

  const lista = logros.map((l) => ({
    ...l,
    pct: Math.min(100, Math.round((l.progreso / l.meta) * 100)),
    completo: l.progreso >= l.meta,
  }));
  const puntos = lista.filter((l) => l.completo).reduce((s, l) => s + l.puntos, 0);
  const nivel = Math.floor(puntos / PUNTOS_POR_NIVEL) + 1;
  const enNivel = puntos % PUNTOS_POR_NIVEL;
  const logrados = lista.filter((l) => l.completo).length;
  const proximo = lista.filter((l) => !l.completo).sort((a, b) => b.pct - a.pct)[0];
  const visibles = lista.filter((l) => filtro === "todos" || (filtro === "logrados") === l.completo);

  return (
    <section className="ef" aria-labelledby="logros-titulo">
      <Encabezado id="logros-titulo" titulo="Sistema de logros" subtitulo={nombre}>
        <Tabs opciones={FILTROS} valor={filtro} onChange={setFiltro} etiqueta="Filtrar logros" />
      </Encabezado>

      {cargando && <Vacio>Cargando tus logros…</Vacio>}

      {error && !cargando && (
        <div className="ef-card ef-stack">
          <Badge tono="bad">No se pudieron cargar los logros</Badge>
          <p className="ef-sub">{error}</p>
          <div><button className="ef-btn" onClick={recargar}>Reintentar</button></div>
        </div>
      )}

      {!cargando && !error && (
        <>
          <div className="ef-card ef-nivel">
            <div className="num" aria-label={`Nivel ${nivel}`}>{nivel}</div>
            <div className="ef-stack" style={{ gap: 6 }}>
              <div className="ef-between">
                <h2>Nivel {nivel}</h2>
                <span className="ef-sub">{puntos} puntos · {logrados} de {lista.length} logros</span>
              </div>
              <Barra valor={enNivel} max={PUNTOS_POR_NIVEL} />
              <p className="ef-sub">Te faltan {PUNTOS_POR_NIVEL - enNivel} puntos para el nivel {nivel + 1}.</p>
              {proximo && (
                <p className="ef-sub">Siguiente más cercano: <b>{proximo.titulo}</b> ({proximo.progreso} de {proximo.meta}).</p>
              )}
            </div>
          </div>

          {visibles.length === 0 ? (
            <Vacio>
              {filtro === "logrados"
                ? "Todavía no has completado ningún logro. ¡Sigue entrenando!"
                : filtro === "pendientes"
                  ? "¡Completaste todos los logros! No te queda ninguno en curso."
                  : "Aún no hay logros disponibles."}
            </Vacio>
          ) : (
            <div className="ef-grid">
              {visibles.map((l) => (
                <article key={l.id} className={`ef-card ef-logro ${l.completo ? "" : "bloqueado"}`}>
                  <Anillo pct={l.pct} completo={l.completo} />
                  <div>
                    <h3>{l.titulo}</h3>
                    <p className="ef-sub">{l.descripcion}</p>
                    <p style={{ marginTop: 6 }}>
                      {l.completo
                        ? <Badge tono="ok">+{l.puntos} puntos{l.desbloqueadoEn && ` · ${fecha(l.desbloqueadoEn)}`}</Badge>
                        : <Badge>{l.progreso} de {l.meta}</Badge>}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
