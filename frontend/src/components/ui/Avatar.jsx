export default function Avatar({ src, fallback, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt="Avatar" className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium text-slate-600 dark:text-slate-300 uppercase">
          {fallback?.substring(0, 2) || 'NA'}
        </span>
      )}
    </div>
  );
}\n