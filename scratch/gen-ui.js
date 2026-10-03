const fs = require('fs');
const path = require('path');

const uiPath = path.join(process.cwd(), 'frontend/src/components/ui');
const contextPath = path.join(process.cwd(), 'frontend/src/context');

const components = {
  'Button.jsx': `
import { forwardRef } from 'react';

const Button = forwardRef(({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
  const base = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-sm",
    destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  return (
    <button ref={ref} className={\`\${base} \${variants[variant]} \${sizes[size]} \${className}\`} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';
export default Button;
`,

  'Input.jsx': `
import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={\`flex w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50
          \${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
          } \${className}\`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';
export default Input;
`,

  'Textarea.jsx': `
import { forwardRef } from 'react';

const Textarea = forwardRef(({ className = '', error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        className={\`flex min-h-[80px] w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50
          \${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
          } \${className}\`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';
export default Textarea;
`,

  'Select.jsx': `
import { forwardRef } from 'react';

const Select = forwardRef(({ className = '', error, children, ...props }, ref) => {
  return (
    <div className="w-full">
      <select
        ref={ref}
        className={\`flex w-full appearance-none rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50
          \${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
          } \${className}\`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';
export default Select;
`,

  'Badge.jsx': `
export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  };

  return (
    <span className={\`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors \${variants[variant]} \${className}\`}>
      {children}
    </span>
  );
}
`,

  'Avatar.jsx': `
export default function Avatar({ src, fallback, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className={\`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 \${sizes[size]} \${className}\`}>
      {src ? (
        <img src={src} alt="Avatar" className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium text-slate-600 dark:text-slate-300 uppercase">
          {fallback?.substring(0, 2) || 'NA'}
        </span>
      )}
    </div>
  );
}
`,

  'Card.jsx': `
export function Card({ children, className = '' }) {
  return (
    <div className={\`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden \${className}\`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={\`px-6 py-4 border-b border-slate-100 dark:border-slate-800 \${className}\`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={\`p-6 \${className}\`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={\`px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 \${className}\`}>{children}</div>;
}
`,

  'Skeleton.jsx': `
export default function Skeleton({ className = '' }) {
  return (
    <div className={\`animate-pulse rounded bg-slate-200 dark:bg-slate-700 \${className}\`} />
  );
}
`,

  'EmptyState.jsx': `
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = FolderOpen, title = 'No data found', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
        <Icon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
`,

  'ErrorState.jsx': `
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
      <AlertTriangle className="h-8 w-8 text-red-500 mb-3" />
      <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">{title}</h3>
      {message && <p className="mt-1 text-sm text-red-600 dark:text-red-500 max-w-sm">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}
`,

  'Modal.jsx': `
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg transform overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-xl transition-all sm:my-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
`,

  'ConfirmDialog.jsx': `
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
}
`,

  'Dropdown.jsx': `
import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ trigger, children, align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className={\`absolute z-50 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-slate-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none \${align === 'right' ? 'right-0' : 'left-0'}\`}>
          <div className="py-1" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
`,

  'Table.jsx': `
export function Table({ children, className = '' }) {
  return (
    <div className={\`w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 \${className}\`}>
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }) {
  return <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">{children}</thead>;
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">{children}</tbody>;
}

export function Tr({ children, className = '' }) {
  return <tr className={\`hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors \${className}\`}>{children}</tr>;
}

export function Th({ children, className = '' }) {
  return <th className={\`px-6 py-4 font-semibold tracking-wider \${className}\`}>{children}</th>;
}

export function Td({ children, className = '' }) {
  return <td className={\`px-6 py-4 whitespace-nowrap \${className}\`}>{children}</td>;
}
`,

  'Pagination.jsx': `
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-between px-2 py-3">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Page <span className="font-medium text-slate-900 dark:text-white">{currentPage}</span> of <span className="font-medium text-slate-900 dark:text-white">{totalPages}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft size={16} />
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
`
};

const toastContextStr = `
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
            <div key={toast.id} className={\`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all animate-in slide-in-from-right-4 \${bgs[toast.type]}\`}>
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

export const useToast = () => useContext(ToastContext);
`;

Object.entries(components).forEach(([name, content]) => {
  fs.writeFileSync(path.join(uiPath, name), content.trim() + '\\n');
});

fs.writeFileSync(path.join(contextPath, 'ToastContext.jsx'), toastContextStr.trim() + '\\n');
console.log('UI components generated successfully.');
