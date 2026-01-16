import React from 'react';
import { Icon } from '@/constants';

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
          <div 
            key={filter.key}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full group ${
              isPrimary 
                ? 'bg-primary/10 border border-primary/20 text-primary' 
                : 'bg-white/5 border border-white/10 text-text-secondary'
            }`}
          >
            <span className="text-xs font-black uppercase tracking-tight">
              {filter.label}
            </span>
            <button 
              onClick={() => onRemoveFilter(filter.key)} 
              className="hover:text-white transition-colors"
            >
              <Icon name="close" className="text-sm" />
            </button>
          </div>
        );
      })}
      <button 
        onClick={onClearAll}
        className="text-xs font-black text-red-500/70 hover:text-red-500 uppercase tracking-widest ml-auto underline underline-offset-4 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
};
