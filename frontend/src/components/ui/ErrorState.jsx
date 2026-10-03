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
}\n