
import React from 'react';
import { Icon, CustomSelect } from '@/constants';

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
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 bg-background-dark/30 border border-card-border/50 rounded-2xl relative">
        <div className="lg:col-span-6 relative group">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full h-14 rounded-xl border border-card-border bg-card-dark text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary/40 pl-12 pr-4 text-sm font-bold outline-none transition-all" 
            placeholder="Search by name or email..." 
            value={searchQuery} 
            onChange={(e) => onSearchChange(e.target.value)} 
          />
        </div>
        <div className="lg:col-span-2 relative">
          <CustomSelect 
            value={assignmentFilter} 
            options={["Assignments", "A1", "A2", "A3", "A4"]} 
            onChange={onAssignmentChange} 
            icon="pending_actions" 
          />
        </div>
        <div className="lg:col-span-2">
          <CustomSelect 
            value={progressFilter} 
            options={["All Progress", "At Risk (< 50%)", "Average (50-80%)", "Excelling (> 80%)"]} 
            onChange={onProgressChange} 
            icon="filter_list" 
          />
        </div>
        <div className="lg:col-span-2">
          <button 
            onClick={onAddClick} 
            className="w-full h-14 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-background-dark rounded-xl text-sm font-black uppercase tracking-[0.15em] shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Icon name="person_add" className="text-lg" />
            <span>ADD STUDENT</span>
          </button>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 px-2">
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest mr-1">Active Filters:</span>
          {assignmentFilter !== 'Assignments' && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full group">
              <span className="text-xs font-black uppercase tracking-tight">Missing: {assignmentFilter}</span>
              <button onClick={() => onAssignmentChange('Assignments')} className="hover:text-white transition-colors">
                <Icon name="close" className="text-sm" />
              </button>
            </div>
          )}
          {progressFilter !== 'All Progress' && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-text-secondary px-3 py-1.5 rounded-full group">
              <span className="text-xs font-black uppercase tracking-tight">{progressFilter}</span>
              <button onClick={() => onProgressChange('All Progress')} className="hover:text-white transition-colors">
                <Icon name="close" className="text-sm" />
              </button>
            </div>
          )}
          {searchQuery !== '' && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-text-secondary px-3 py-1.5 rounded-full group">
              <span className="text-xs font-black uppercase tracking-tight">Search: {searchQuery}</span>
              <button onClick={() => onSearchChange('')} className="hover:text-white transition-colors">
                <Icon name="close" className="text-sm" />
              </button>
            </div>
          )}
          <button 
            onClick={onClearFilters} 
            className="text-xs font-black text-red-500/70 hover:text-red-500 uppercase tracking-widest ml-auto underline underline-offset-4"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
