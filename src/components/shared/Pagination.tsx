import React from 'react';
import { Icon } from '@/constants';

import { Button } from '@/components/ui';

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
      <div className="border-card-border/30 flex flex-col items-center justify-between gap-6 border-t bg-black/20 px-10 py-8 sm:flex-row">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`flex h-auto items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-black tracking-widest uppercase transition-all active:scale-95 ${isFirstPage ? 'cursor-not-allowed border-gray-800/30 text-gray-800' : 'text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40'}`}
        >
          <Icon name="arrow_back_ios" className="text-sm" /> Prev
        </Button>
        <div className="flex items-center gap-2">
          {totalPages > 0 &&
            Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant="ghost"
                onClick={() => onPageChange(p)}
                className={`flex size-10 items-center justify-center rounded-lg border-2 p-0 text-sm font-black transition-all active:scale-90 ${currentPage === p ? 'bg-primary text-background-dark border-primary hover:bg-primary hover:text-background-dark z-10 scale-110 shadow-[0_0_15px_rgba(19,236,106,0.2)]' : 'text-text-secondary bg-background-dark/40 border-card-border hover:bg-white/5 hover:text-white'}`}
              >
                {p}
              </Button>
            ))}
        </div>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className={`flex h-auto items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-black tracking-widest uppercase transition-all active:scale-95 ${isLastPage ? 'cursor-not-allowed border-gray-800/30 text-gray-800' : 'text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40'}`}
        >
          Next <Icon name="arrow_forward_ios" className="text-sm" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-card-border/30 flex flex-col items-center justify-between gap-6 border-t bg-black/20 px-10 py-8 sm:flex-row">
      {footerText && (
        <span className="text-sm font-black tracking-widest text-gray-500 uppercase">
          {footerText}
        </span>
      )}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={isFirstPage}
          className={`size-10 rounded-lg border p-2 transition-all active:scale-90 ${isFirstPage ? 'border-gray-800/10 text-gray-800' : 'text-primary border-primary/20 hover:bg-primary/5'}`}
        >
          <Icon name="chevron_left" className="text-xl" />
        </Button>
        <div className="flex items-center gap-2">
          {totalPages > 0 &&
            Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant="ghost"
                onClick={() => onPageChange(p)}
                className={`flex size-10 items-center justify-center rounded-lg p-0 text-sm font-black transition-all ${currentPage === p ? 'bg-primary text-background-dark border-primary hover:bg-primary hover:text-background-dark z-10 scale-110 shadow-lg' : 'border-card-border bg-background-dark/30 border text-gray-500 hover:text-white'}`}
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
          className={`size-10 rounded-lg border p-2 transition-all active:scale-90 ${isLastPage ? 'border-gray-800/10 text-gray-800' : 'text-primary border-primary/20 hover:bg-primary/5'}`}
        >
          <Icon name="chevron_right" className="text-xl" />
        </Button>
      </div>
    </div>
  );
};
