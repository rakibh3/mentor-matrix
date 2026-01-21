import React, { useMemo } from 'react';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ActiveFilters, type FilterItem } from '@/components/shared/ActiveFilters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StudentActionBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  assignmentFilter: string;
  onAssignmentChange: (val: string) => void;
  progressFilter: string;
  onProgressChange: (val: string) => void;
  onAddClick: () => void;
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
  onClearFilters,
}) => {
  const filters: FilterItem[] = useMemo(() => [
    { 
      key: 'assignment', 
      label: `Missing: ${assignmentFilter}`, 
      value: assignmentFilter !== 'Assignments' ? assignmentFilter : '',
      variant: 'primary' as const
    },
    { 
      key: 'progress', 
      label: progressFilter, 
      value: progressFilter !== 'All Progress' ? progressFilter : '' 
    },
    { 
      key: 'search', 
      label: `Search: ${searchQuery}`, 
      value: searchQuery 
    },
  ], [assignmentFilter, progressFilter, searchQuery]);

  const handleRemoveFilter = (key: string) => {
    if (key === 'assignment') onAssignmentChange('Assignments');
    if (key === 'progress') onProgressChange('All Progress');
    if (key === 'search') onSearchChange('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 bg-background-dark/30 border border-card-border/50 rounded-2xl relative">
        <div className="lg:col-span-6 relative group">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl group-focus-within:text-primary transition-colors" />
          <Input 
            variant="search"
            hasIcon="left"
            className="w-full h-14 rounded-xl border border-card-border bg-card-dark placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary/40 pl-12 pr-4" 
            placeholder="Search by name or email..." 
            value={searchQuery} 
            onChange={(e) => onSearchChange(e.target.value)} 
          />
        </div>
        <div className="lg:col-span-2 relative">
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
        <div className="lg:col-span-2">
          <Select value={progressFilter} onValueChange={onProgressChange}>
            <SelectTrigger icon="filter_list">
              <SelectValue placeholder="All Progress" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Progress">All Progress</SelectItem>
              <SelectItem value="At Risk (< 50%)">At Risk (&lt; 50%)</SelectItem>
              <SelectItem value="Average (50-80%)">Average (50-80%)</SelectItem>
              <SelectItem value="Excelling (> 80%)">Excelling (&gt; 80%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-2">
          <Button 
            onClick={onAddClick}
            className="w-full h-14 tracking-[0.15em]"
          >
            <Icon name="person_add" className="text-lg" />
            <span>ADD STUDENT</span>
          </Button>
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
