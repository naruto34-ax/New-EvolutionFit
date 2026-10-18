import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ title, onClose, actions, children }) {
  const closeBtn = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    closeBtn.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title" id="modal-title">{title}</h3>
          <button ref={closeBtn} className="modal-close" onClick={onClose} aria-label="Cerrar modal">
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {actions && (
          <div
            className="modal-footer"
            style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}