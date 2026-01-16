
import React from 'react';
import { Icon, CustomSelect } from '@/constants';
import { FlaggedStudent } from '@/types';
import { StudentDataGrid } from '@/components/admin/shared/StudentDataGrid';

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
  hasActiveFilters: boolean;
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
  hasActiveFilters,
}) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Header & Filter Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
          <div className="size-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 shadow-lg">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div className="flex flex-col">
            <h4 className="text-white text-2xl font-black uppercase tracking-tight">Urgent Attention Required</h4>
            <p className="text-text-secondary text-sm font-medium">Outreach tracking for at-risk students.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group w-full lg:w-72">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
              <Icon name="search" className="text-xl" />
            </div>
            <input 
              type="text"
              placeholder="Search name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-14 bg-surface-dark/40 border border-card-border/60 rounded-xl pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-600 shadow-md"
            />
          </div>
          <div className="w-52 h-14">
            <CustomSelect 
              value={assignmentFilter}
              options={["Assignments", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]}
              onChange={onAssignmentChange}
              placeholder="Assignments"
              icon="assignment"
            />
          </div>
          <button 
            onClick={onExport}
            className="px-5 h-14 rounded-xl bg-surface-dark/40 border border-card-border/60 text-sm font-black uppercase tracking-widest text-text-secondary hover:text-primary hover:border-primary/50 transition-all flex items-center gap-2 whitespace-nowrap shadow-md active:scale-95"
          >
            <Icon name="download" className="text-lg" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-3 px-2 -mt-4">
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Active Filters:</span>
          {searchQuery && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-text-secondary px-3 py-1 rounded-full text-xs font-bold">
              <span>"{searchQuery}"</span>
              <button onClick={() => onSearchChange('')} className="hover:text-white transition-colors"><Icon name="close" className="text-xs" /></button>
            </div>
          )}
          {assignmentFilter !== 'Assignments' && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
              <span>Missing {assignmentFilter}</span>
              <button onClick={() => onAssignmentChange('Assignments')} className="hover:text-white transition-colors"><Icon name="close" className="text-xs" /></button>
            </div>
          )}
          <button 
            onClick={onClearFilters}
            className="text-xs font-black text-red-500/70 hover:text-red-500 uppercase tracking-widest ml-auto underline underline-offset-4 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}


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

