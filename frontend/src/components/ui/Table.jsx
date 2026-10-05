export function Table({ children, className = '' }) {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border-[1.5px] border-border-dark dark:border-[#575048] bg-surface dark:bg-[#292622] ${className}`}>
      <table className="w-full text-left text-sm text-foreground">
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }) {
  return <thead className="bg-surface-muted dark:bg-[#24211E] text-xs uppercase text-foreground-muted border-b border-border-muted dark:border-[#3D3934]">{children}</thead>;
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-border-muted dark:divide-[#3D3934] bg-surface dark:bg-[#292622]">{children}</tbody>;
}

export function Tr({ children, className = '' }) {
  return <tr className={`hover:bg-surface-muted/60 dark:hover:bg-[#34302B]/50 transition-colors duration-150 ${className}`}>{children}</tr>;
}

export function Th({ children, className = '' }) {
  return <th className={`px-6 py-4 font-semibold tracking-wider text-foreground ${className}`}>{children}</th>;
}

export function Td({ children, className = '' }) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>;
}