import Modal from './Modal';

const doNothing = () => {};

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', variant = 'primary', isProcessing, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={isProcessing ? doNothing : onCancel} size="sm">
      <p className="confirm-message">{message}</p>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isProcessing}>
          Cancelar
        </button>
        <button type="button" className={`btn btn-${variant}`} onClick={onConfirm} disabled={isProcessing}>
          {isProcessing ? 'Procesando...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
