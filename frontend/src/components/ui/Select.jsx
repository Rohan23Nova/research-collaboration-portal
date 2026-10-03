import { forwardRef } from 'react';

const Select = forwardRef(({ className = '', error, children, ...props }, ref) => {
  return (
    <div className="w-full">
      <select
        ref={ref}
        className={`flex w-full appearance-none rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
          } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';
export default Select;\n