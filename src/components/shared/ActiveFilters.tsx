import React from 'react';
import { Icon } from '@/constants';
import { Badge, Button } from '@/components/ui';

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
  const activeFilters = filters.filter((f) => f.value !== '');

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 px-2">
      <span className="mr-1 text-xs font-black tracking-widest text-gray-500 uppercase">
        Active Filters:
      </span>
      {activeFilters.map((filter) => {
        const isPrimary = filter.variant === 'primary';
        return (
          <Badge
            key={filter.key}
            variant={isPrimary ? 'primary' : 'default'}
            className="group py-1.5"
          >
            <span className="text-xs font-black tracking-tight uppercase">{filter.label}</span>
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
        className="ml-auto h-auto p-0 text-xs font-black tracking-widest text-red-500/70 uppercase underline underline-offset-4 hover:text-red-500"
      >
        Clear All
      </Button>
    </div>
  );
};
