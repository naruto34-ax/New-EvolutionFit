import "../css/evolution.css";

export function Encabezado({ id, titulo, subtitulo, children }) {
  return (
    <div className="ef-head">
      <div>
        <h1 id={id}>{titulo}</h1>
        {subtitulo && <p className="ef-sub">{subtitulo}</p>}
      </div>
      {children}
    </div>
  );
}

/** opciones: [[valor, texto], ...] */
export function Tabs({ opciones, valor, onChange, etiqueta }) {
  return (
    <div className="ef-tabs" role="group" aria-label={etiqueta}>
      {opciones.map(([v, t]) => (
        <button key={String(v)} type="button" aria-pressed={valor === v} onClick={() => onChange(v)}>{t}</button>
      ))}
    </div>
  );
}

export const Badge = ({ tono = "idle", children, ...resto }) => (
  <span className={`ef-badge ${tono}`} {...resto}>{children}</span>
);

export const Barra = ({ valor, max = 100 }) => (
  <div className="ef-bar" role="progressbar" aria-valuenow={valor} aria-valuemin={0} aria-valuemax={max}>
    <span style={{ width: `${Math.min(100, (valor / max) * 100)}%` }} />
  </div>
);

export const Vacio = ({ children }) => <div className="ef-empty">{children}</div>;

export const tonoPorcentaje = (p) => (p >= 80 ? "ok" : p >= 60 ? "warn" : "bad");
