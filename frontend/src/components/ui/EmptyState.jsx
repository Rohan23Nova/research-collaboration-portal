import { FolderOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = FolderOpen, title = 'No data found', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
        <Icon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}\n