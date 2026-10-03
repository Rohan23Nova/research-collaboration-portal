import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-between px-2 py-3">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Page <span className="font-medium text-slate-900 dark:text-white">{currentPage}</span> of <span className="font-medium text-slate-900 dark:text-white">{totalPages}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft size={16} />
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}\n