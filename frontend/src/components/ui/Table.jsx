export function Table({ children, className = '' }) {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 ${className}`}>
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
  return <tr className={`hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors ${className}`}>{children}</tr>;
}

export function Th({ children, className = '' }) {
  return <th className={`px-6 py-4 font-semibold tracking-wider ${className}`}>{children}</th>;
}

export function Td({ children, className = '' }) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>;
}\n