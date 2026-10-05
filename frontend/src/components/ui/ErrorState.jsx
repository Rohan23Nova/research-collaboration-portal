import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ title = 'Something went wrong', message, onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-red-500/10 border-[1.5px] border-red-500/30 dark:border-red-500/20 rounded-xl transition-colors ${className}`} role="alert">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-600 dark:text-red-400 mb-3">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-red-700 dark:text-red-300">{title}</h3>
      {message && <p className="mt-1.5 text-sm text-foreground-muted dark:text-[#B8B0A5] max-w-sm">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}