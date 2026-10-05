import { FolderOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = FolderOpen, title = 'No data found', description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-10 text-center bg-surface dark:bg-[#292622] border-2 border-dashed border-border-muted dark:border-[#3D3934] rounded-xl transition-colors duration-200 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft dark:bg-[#6E4634]/40 text-primary mb-3">
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground dark:text-[#F4EFE6]">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-foreground-muted dark:text-[#B8B0A5] max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}