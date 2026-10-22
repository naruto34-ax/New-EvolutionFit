import Modal from './Modal';

export default function ConfirmModal({
    title = 'Confirmar acción',
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    danger = false,
    onConfirm,
    onCancel
}) {
    return(
        <Modal
        title = {title}
        onClose = {onCancel}
        actions = {
            <>
            <button className = "btn btn-secondary" onClick = {onCancel}>{cancelLabel}</button>
            <button className = {`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick = {onConfirm}>
                {confirmLabel}
            </button>
            </>
        }
    >
         <p style={{ lineHeight: 1.6 }}>{message}</p>    
        </Modal>


    );
}