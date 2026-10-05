export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    neutral: 'bg-[#F0ECE3] text-[#514D46] border border-[#DDD5C8] dark:bg-[#302C28] dark:text-[#B8B0A5] dark:border-[#3D3934]',
    success: 'bg-[#E5E9E5] text-[#2F4D46] border border-[#C5D0CB] dark:bg-[#20302B] dark:text-[#8CB4A9] dark:border-[#2D453D]',
    warning: 'bg-[#FDF4E7] text-[#8C5E23] border border-[#E8D4BB] dark:bg-[#3D2E1A] dark:text-[#D1A056] dark:border-[#5C4527]',
    danger: 'bg-red-50 text-red-700 border border-red-200 dark:bg-[#3E1F1F] dark:border-[#5C2B2B] dark:text-[#E07A7A]',
    primary: 'bg-primary-soft text-primary-hover border border-primary/20 dark:bg-[#6E4634] dark:text-[#D88959] dark:border-[#C96F3D]/40',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}