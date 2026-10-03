import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
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
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => {
          const icons = {
            success: <CheckCircle className="text-emerald-500" size={20} />,
            error: <AlertCircle className="text-red-500" size={20} />,
            info: <Info className="text-indigo-500" size={20} />
          };
          const bgs = {
            success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
            error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800 text-red-800 dark:text-red-200',
            info: 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-800 dark:text-slate-200'
          };
          
          return (
            <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all animate-in slide-in-from-right-4 ${bgs[toast.type]}`}>
              {icons[toast.type]}
              <p className="text-sm font-medium pr-4">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);\n