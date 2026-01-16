import React from 'react';
import { StudentDataGrid } from '@/components/admin/shared/StudentDataGrid';

interface StudentTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  students: any[];
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleAssignment: (email: string, assignment: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewDetails: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditClick: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteClick: (student: any) => void;
  onToggleBlock: (email: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLogCall: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewHistory: (student: any) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  totalFilteredCount,
  currentPage,
  totalPages,
  onPageChange,
  onToggleAssignment,
  onViewDetails,
  onEditClick,
  onDeleteClick,
  onToggleBlock,
  onLogCall,
  onViewHistory,
}) => {
  return (
    <StudentDataGrid
      students={students}
      totalFilteredCount={totalFilteredCount}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onToggleAssignment={onToggleAssignment}
      onViewDetails={onViewDetails}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
      onToggleBlock={onToggleBlock}
      onLogCall={onLogCall}
      onViewHistory={onViewHistory}
      idField="email"
    />
  );
};
