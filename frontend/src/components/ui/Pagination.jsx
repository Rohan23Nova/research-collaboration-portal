import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  
  return (
    <nav className="flex items-center justify-between px-2 py-4" aria-label="Pagination Navigation">
      <div className="text-sm text-foreground-muted">
        Page <span className="font-semibold text-foreground">{currentPage}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}