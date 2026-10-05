export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface rounded-xl border-[1.5px] border-border-dark overflow-hidden transition-colors duration-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-4 border-b border-border-muted ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`px-6 py-4 border-t border-border-muted bg-surface-muted transition-colors duration-200 ${className}`}>{children}</div>;
}