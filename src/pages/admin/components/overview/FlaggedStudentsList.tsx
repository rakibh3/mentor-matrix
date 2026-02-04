import React, { useMemo } from 'react';
import { Icon } from '@/constants';
import type { FlaggedStudent } from '@/types';

import { ActiveFilters, type FilterItem } from '@/components/shared/ActiveFilters';
import {
  Button,
  IconAvatar,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { StudentDataGrid } from '@/pages/admin/components/shared/StudentDataGrid';

interface FlaggedStudentsListProps {
  students: FlaggedStudent[];
  totalFilteredCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  assignmentFilter: string;
  onAssignmentChange: (val: string) => void;
  onExport: () => void;
  sortConfig: { key: 'risk'; direction: 'asc' | 'desc' | null };
  onSort: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLogCall: (student: FlaggedStudent) => void;
  onViewHistory: (student: FlaggedStudent) => void;
  onViewDetails: (student: FlaggedStudent) => void;
  onToggleAssignment: (studentId: string, assignment: string) => void;
  onToggleBlock: (studentId: string) => void;
  onCopy: (text: string) => void;
  copiedText: string | null;
  onClearFilters: () => void;
}

export const FlaggedStudentsList: React.FC<FlaggedStudentsListProps> = ({
  students,
  totalFilteredCount,
  searchQuery,
  onSearchChange,
  assignmentFilter,
  onAssignmentChange,
  onExport,
  sortConfig,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
  onLogCall,
  onViewHistory,
  onViewDetails,
  onToggleAssignment,
  onToggleBlock,
  onCopy,
  copiedText,
  onClearFilters,
}) => {
  const filters: FilterItem[] = useMemo(
    () => [
      {
        key: 'search',
        label: `"${searchQuery}"`,
        value: searchQuery,
      },
      {
        key: 'assignment',
        label: `Missing ${assignmentFilter}`,
        value: assignmentFilter !== 'Assignments' ? assignmentFilter : '',
        variant: 'primary' as const,
      },
    ],
    [searchQuery, assignmentFilter]
  );

  const handleRemoveFilter = (key: string) => {
    if (key === 'search') onSearchChange('');
    if (key === 'assignment') onAssignmentChange('Assignments');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Filter Section */}
      <div className="flex flex-col justify-between gap-6 px-2 lg:flex-row lg:items-center">
        <div className="flex items-center gap-5">
          <IconAvatar variant="danger" size="md" className="shadow-lg">
            <Icon name="warning" className="text-2xl" />
          </IconAvatar>
          <div className="flex flex-col">
            <h4 className="text-2xl font-black tracking-tight text-white uppercase">
              Urgent Attention Required
            </h4>
            <p className="text-text-secondary text-sm font-medium">
              Outreach tracking for at-risk students.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="group relative w-full lg:w-72">
            <div className="group-focus-within:text-primary absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 transition-colors">
              <Icon name="search" className="text-xl" />
            </div>
            <Input
              type="text"
              placeholder="Search name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              variant="search"
              hasIcon="left"
              className="bg-surface-dark/40 border-card-border/60 h-14 w-full rounded-xl border pr-4 pl-12 shadow-md"
            />
          </div>
          <div className="h-14 w-52">
            <Select value={assignmentFilter} onValueChange={onAssignmentChange}>
              <SelectTrigger icon="assignment">
                <SelectValue placeholder="Assignments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Assignments">Assignments</SelectItem>
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="A3">A3</SelectItem>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="A5">A5</SelectItem>
                <SelectItem value="A6">A6</SelectItem>
                <SelectItem value="A7">A7</SelectItem>
                <SelectItem value="A8">A8</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onExport}
            variant="outline"
            className="bg-surface-dark/40 border-card-border/60 h-14 rounded-xl px-5 shadow-md"
          >
            <Icon name="download" className="text-lg" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="-mt-4 px-2">
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={onClearFilters}
        />
      </div>

      {/* Main Table Container */}
      <StudentDataGrid
        students={students}
        totalFilteredCount={totalFilteredCount}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onToggleAssignment={onToggleAssignment}
        onViewDetails={onViewDetails}
        onToggleBlock={onToggleBlock}
        onLogCall={onLogCall}
        onViewHistory={onViewHistory}
        onSort={onSort}
        sortConfig={sortConfig}
        onCopy={onCopy}
        copiedText={copiedText}
      />
    </div>
  );
};
