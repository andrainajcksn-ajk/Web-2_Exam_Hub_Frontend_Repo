import Modal from './modal';
import Button from './button';

const ConfirmDialog = ({ open, onClose, onConfirm, message }) => {
  return (
    <Modal open={open} onClose={onClose} title="Confirmation">
      <p className="mb-6 text-neutral-300">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Annuler</Button>
        <Button variant="danger" onClick={onConfirm}>Confirmer</Button>
      </div>
    </Modal>
  );
}
export default ConfirmDialog;
