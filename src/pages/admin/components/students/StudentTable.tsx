import React from 'react';

import { StudentDataGrid } from '@/pages/admin/components/shared/StudentDataGrid';

interface StudentTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  students: any[];
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleAssignment: (email: string, assignment: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewDetails?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditClick?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteClick?: (student: any) => void;
  onToggleBlock?: (email: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLogCall: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewHistory: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSendEmail?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDiscordKick?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDiscordBan?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSort?: (key: string) => void;
  sortConfig?: any;
  showSrmColumn?: boolean;
  showSelection?: boolean;
  selectedIds?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectionChange?: (ids: string[]) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  totalFilteredCount,
  currentPage,
  totalPages,
  onPageChange,
  onToggleAssignment,
  onViewDetails,
  onToggleBlock,
  onLogCall,
  onViewHistory,
  onSendEmail,
  onDiscordKick,
  onDiscordBan,
  onSort,
  sortConfig,
  selectedIds,
  onSelectionChange,
  showSrmColumn,
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
      onToggleBlock={onToggleBlock}
      onLogCall={onLogCall}
      onViewHistory={onViewHistory}
      onSendEmail={onSendEmail}
      onDiscordAction={
        onDiscordKick || onDiscordBan
          ? (student, type) => {
              if (type === 'kick') onDiscordKick?.(student);
              if (type === 'ban') onDiscordBan?.(student);
            }
          : undefined
      }
      onSort={onSort}
      sortConfig={sortConfig}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      idField="email"
      showSrmColumn={showSrmColumn}
    />
  );
};
