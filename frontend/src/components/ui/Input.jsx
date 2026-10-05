import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', error, id, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? 'true' : 'false'}
        className={`flex w-full rounded-md border-[1.5px] bg-surface dark:bg-[#211F1C] px-3 py-2 text-sm text-foreground dark:text-[#F4EFE6] placeholder:text-foreground-muted/70 dark:placeholder-[#8F887E] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-[#211F1C] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted/40 motion-reduce:transition-none
          ${error 
            ? 'border-red-500 focus-visible:ring-red-500' 
            : 'border-border-dark dark:border-[#575048] hover:border-foreground-muted dark:hover:border-[#8F887E] focus-visible:ring-primary'
          } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium" role="alert">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';
export default Input;