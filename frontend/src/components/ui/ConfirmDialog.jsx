import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', destructive = false, loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant={destructive ? 'destructive' : 'primary'} onClick={onConfirm} disabled={loading}>
          {loading ? 'Processing...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
}\n