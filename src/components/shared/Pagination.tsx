import React from 'react';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  footerText?: string;
  variant?: 'default' | 'compact';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  footerText,
  variant = 'default',
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  if (variant === 'compact') {
    return (
      <div className="px-10 py-8 border-t border-card-border/30 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Button 
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={isFirstPage} 
          className={`flex items-center gap-2 px-6 py-2.5 h-auto rounded-lg text-sm font-black uppercase tracking-widest transition-all border active:scale-95 ${isFirstPage ? 'text-gray-800 border-gray-800/30 cursor-not-allowed' : 'text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40'}`}
        >
          <Icon name="arrow_back_ios" className="text-sm" /> Prev
        </Button>
        <div className="flex items-center gap-2">
          {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button 
              key={p}
              variant="ghost"
              onClick={() => onPageChange(p)} 
              className={`size-10 p-0 rounded-lg flex items-center justify-center text-sm font-black transition-all active:scale-90 border-2 ${currentPage === p ? 'bg-primary text-background-dark border-primary shadow-[0_0_15px_rgba(19,236,106,0.2)] scale-110 z-10 hover:bg-primary hover:text-background-dark' : 'text-text-secondary bg-background-dark/40 border-card-border hover:bg-white/5 hover:text-white'}`}
            >
              {p}
            </Button>
          ))}
        </div>
        <Button 
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={isLastPage} 
          className={`flex items-center gap-2 px-6 py-2.5 h-auto rounded-lg text-sm font-black uppercase tracking-widest transition-all border active:scale-95 ${isLastPage ? 'text-gray-800 border-gray-800/30 cursor-not-allowed' : 'text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40'}`}
        >
          Next <Icon name="arrow_forward_ios" className="text-sm" />
        </Button>
      </div>
    );
  }

  return (
    <div className="px-10 py-8 border-t border-card-border/30 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-6">
      {footerText && (
        <span className="text-sm font-black uppercase tracking-widest text-gray-500">
          {footerText}
        </span>
      )}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))} 
          disabled={isFirstPage} 
          className={`p-2 size-10 rounded-lg border transition-all active:scale-90 ${isFirstPage ? 'text-gray-800 border-gray-800/10' : 'text-primary border-primary/20 hover:bg-primary/5'}`}
        >
          <Icon name="chevron_left" className="text-xl" />
        </Button>
        <div className="flex items-center gap-2">
          {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Button 
              key={p}
              variant="ghost"
              onClick={() => onPageChange(p)} 
              className={`size-10 p-0 rounded-lg flex items-center justify-center text-sm font-black transition-all ${currentPage === p ? 'bg-primary text-background-dark border-primary shadow-lg scale-110 z-10 hover:bg-primary hover:text-background-dark' : 'text-gray-500 hover:text-white border border-card-border bg-background-dark/30'}`}
            >
              {p}
            </Button>
          ))}
        </div>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} 
          disabled={isLastPage} 
          className={`p-2 size-10 rounded-lg border transition-all active:scale-90 ${isLastPage ? 'text-gray-800 border-gray-800/10' : 'text-primary border-primary/20 hover:bg-primary/5'}`}
        >
          <Icon name="chevron_right" className="text-xl" />
        </Button>
      </div>
    </div>
  );
};
