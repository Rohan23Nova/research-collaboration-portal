import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', destructive = false, loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3 pt-4 border-t border-border-muted dark:border-[#3D3934]">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={destructive ? 'destructive' : 'primary'} onClick={onConfirm} disabled={loading}>
            {loading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}