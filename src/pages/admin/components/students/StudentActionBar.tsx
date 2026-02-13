import React, { useMemo } from 'react';
import { Icon } from '@/constants';

import { ActiveFilters, type FilterItem } from '@/components/shared/ActiveFilters';
import { PrimaryButton } from '@/components/shared/Button';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

interface StudentActionBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  assignmentFilter: string;
  onAssignmentChange: (val: string) => void;
  progressFilter: string;
  onProgressChange: (val: string) => void;
  onAddClick: () => void;
  showAddButton?: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const StudentActionBar: React.FC<StudentActionBarProps> = ({
  searchQuery,
  onSearchChange,
  assignmentFilter,
  onAssignmentChange,
  progressFilter,
  onProgressChange,
  onAddClick,
  showAddButton = true,
  onClearFilters,
}) => {
  const filters: FilterItem[] = useMemo(
    () => [
      {
        key: 'assignment',
        label: `Missing: ${assignmentFilter}`,
        value: assignmentFilter !== 'Assignments' ? assignmentFilter : '',
        variant: 'primary' as const,
      },
      {
        key: 'progress',
        label: progressFilter,
        value: progressFilter !== 'All Progress' ? progressFilter : '',
      },
      {
        key: 'search',
        label: `Search: ${searchQuery}`,
        value: searchQuery,
      },
    ],
    [assignmentFilter, progressFilter, searchQuery]
  );

  const handleRemoveFilter = (key: string) => {
    if (key === 'assignment') onAssignmentChange('Assignments');
    if (key === 'progress') onProgressChange('All Progress');
    if (key === 'search') onSearchChange('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-background-dark/30 border-card-border/50 relative grid grid-cols-1 items-center gap-4 rounded-2xl border p-4 lg:grid-cols-12">
        <div className={`group relative ${showAddButton ? 'lg:col-span-4' : 'lg:col-span-6'}`}>
          <Icon
            name="search"
            className="text-text-secondary group-focus-within:text-primary absolute top-1/2 left-5 -translate-y-1/2 text-xl transition-colors"
          />
          <Input
            variant="search"
            hasIcon="left"
            className="border-card-border/60 bg-surface-dark/40 focus:border-primary focus:ring-primary/30 h-14 w-full rounded-xl border pr-5 pl-[3.25rem] text-white placeholder:text-gray-600 focus:ring-1"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="relative lg:col-span-3">
          <Select value={assignmentFilter} onValueChange={onAssignmentChange}>
            <SelectTrigger icon="pending_actions">
              <SelectValue placeholder="Assignments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Assignments">Assignments</SelectItem>
              <SelectItem value="A1">A1</SelectItem>
              <SelectItem value="A2">A2</SelectItem>
              <SelectItem value="A3">A3</SelectItem>
              <SelectItem value="A4">A4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-3">
          <Select value={progressFilter} onValueChange={onProgressChange}>
            <SelectTrigger icon="filter_list">
              <SelectValue placeholder="All Progress" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Progress">All Filters</SelectItem>
              <SelectItem value="At Risk (< 50%)">At Risk (&lt; 50%)</SelectItem>
              <SelectItem value="Average (50-80%)">Average (50-80%)</SelectItem>
              <SelectItem value="Excelling (> 80%)">Excelling (&gt; 80%)</SelectItem>
              <SelectItem value="Last 2 Days Absence">Last 2 Days Absence</SelectItem>
              <SelectItem value="Last 3 Days Absence">Last 3 Days Absence</SelectItem>
              <SelectItem value="Last 2 Weeks Absence">Last 2 Weeks Absence</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-2">
          {showAddButton && (
            <PrimaryButton onClick={onAddClick} className="h-14 w-full tracking-[0.15em]">
              <Icon name="person_add" className="text-lg" />
              <span>ADD STUDENT</span>
            </PrimaryButton>
          )}
        </div>
      </div>

      <ActiveFilters
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={onClearFilters}
      />
    </div>
  );
};
