export function LoadingState({ label = 'Cargando...' }) {
  return (
    <div role="status" aria-live="polite" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
      <div className="spinner" aria-hidden="true"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.75rem' }}>{label}</p>
    </div>
  );
}

export function EmptyState({ icon = 'fas fa-inbox', title, message, children }) {
  return (
    <div className="empty-state">
      <i className={icon} aria-hidden="true"></i>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="empty-state" role="alert">
      <i className="fas fa-exclamation-triangle" aria-hidden="true" style={{ color: 'var(--danger)' }}></i>
      <h3>No pudimos cargar la información</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={onRetry}>
          <i className="fas fa-redo"></i> Reintentar
        </button>
      )}
    </div>
  );
}