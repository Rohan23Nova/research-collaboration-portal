import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div 
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map(toast => {
          const icons = {
            success: <CheckCircle className="text-emerald-600 dark:text-emerald-400 shrink-0" size={18} aria-hidden="true" />,
            error: <AlertCircle className="text-red-600 dark:text-red-400 shrink-0" size={18} aria-hidden="true" />,
            info: <Info className="text-primary shrink-0" size={18} aria-hidden="true" />
          };
          const bgs = {
            success: 'bg-emerald-50 dark:bg-[#1C2820] border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
            error: 'bg-red-50 dark:bg-[#2A1D1C] border-red-300 dark:border-red-900 text-red-900 dark:text-red-200',
            info: 'bg-surface dark:bg-[#292622] border-border-dark dark:border-[#575048] text-foreground dark:text-[#F4EFE6]'
          };
          
          return (
            <div 
              key={toast.id} 
              role="status"
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border-[1.5px] shadow-doodle transition-all duration-200 ease-in-out ${bgs[toast.type] || bgs.info}`}
            >
              {icons[toast.type] || icons.info}
              <p className="text-sm font-medium pr-2 flex-1 leading-snug">{toast.message}</p>
              <button 
                type="button"
                onClick={() => removeToast(toast.id)} 
                aria-label="Dismiss notification"
                className="text-foreground-muted hover:text-foreground dark:text-[#B8B0A5] dark:hover:text-[#F4EFE6] p-1 rounded hover:bg-surface-muted/50 dark:hover:bg-[#34302B] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);