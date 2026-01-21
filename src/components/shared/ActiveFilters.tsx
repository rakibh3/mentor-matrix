import React from 'react';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface FilterItem {
  key: string;
  label: string;
  value: string;
  variant?: 'primary' | 'default';
}

interface ActiveFiltersProps {
  filters: FilterItem[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  const activeFilters = filters.filter(f => f.value !== '');

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 px-2">
      <span className="text-xs font-black text-gray-500 uppercase tracking-widest mr-1">
        Active Filters:
      </span>
      {activeFilters.map((filter) => {
        const isPrimary = filter.variant === 'primary';
        return (
          <Badge 
            key={filter.key}
            variant={isPrimary ? 'primary' : 'default'}
            className="py-1.5 group"
          >
            <span className="text-xs font-black uppercase tracking-tight">
              {filter.label}
            </span>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => onRemoveFilter(filter.key)} 
              className="size-5 p-0 hover:text-white"
            >
              <Icon name="close" className="text-sm" />
            </Button>
          </Badge>
        );
      })}
      <Button 
        variant="link"
        onClick={onClearAll}
        className="text-xs font-black text-red-500/70 hover:text-red-500 uppercase tracking-widest ml-auto underline underline-offset-4 p-0 h-auto"
      >
        Clear All
      </Button>
    </div>
  );
};
