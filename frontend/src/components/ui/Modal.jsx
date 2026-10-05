import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200" 
        onClick={onClose} 
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-lg transform overflow-hidden rounded-xl bg-surface dark:bg-[#292622] border-[1.5px] border-border-dark dark:border-[#575048] shadow-doodle transition-all duration-200 ease-in-out my-auto max-h-[calc(100vh-3rem)] flex flex-col">
        <div className="flex items-center justify-between border-b border-border-muted dark:border-[#3D3934] px-6 py-4 shrink-0">
          <h3 id="modal-title" className="text-lg font-semibold text-foreground dark:text-[#F4EFE6]">{title}</h3>
          <button 
            type="button"
            onClick={onClose} 
            aria-label="Close dialog"
            className="rounded-md p-1.5 text-foreground-muted hover:text-foreground dark:text-[#B8B0A5] dark:hover:text-[#F4EFE6] hover:bg-surface-muted dark:hover:bg-[#34302B] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-150"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}