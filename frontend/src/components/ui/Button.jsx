import { forwardRef } from 'react';

const Button = forwardRef(({ className = '', variant = 'primary', size = 'md', children, disabled = false, ...props }, ref) => {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-[#292622] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:pointer-events-none rounded-md select-none active:translate-x-[0.5px] active:translate-y-[0.5px] motion-reduce:transition-none";
  
  const variants = {
    primary: "bg-primary text-surface dark:text-[#F4EFE6] border-2 border-border-dark dark:border-[#575048] shadow-doodle-sm hover:bg-primary-hover dark:hover:bg-[#D88959] active:shadow-none",
    secondary: "bg-surface dark:bg-[#302C28] text-foreground dark:text-[#F4EFE6] border-[1.5px] border-border-dark dark:border-[#575048] hover:bg-surface-muted dark:hover:bg-[#34302B] hover:text-foreground active:bg-surface-muted/80",
    destructive: "bg-red-600 text-white border-2 border-border-dark dark:border-[#575048] shadow-doodle-sm hover:bg-red-700 active:shadow-none focus-visible:ring-red-500",
    ghost: "text-foreground-muted hover:text-foreground hover:bg-surface-muted dark:hover:bg-[#34302B] active:bg-surface-muted/80"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5"
  };

  return (
    <button ref={ref} disabled={disabled} className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';
export default Button;