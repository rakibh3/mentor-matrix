
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@/constants';
import { StatusDot, useToast } from '@/components/ui';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

import { 
  StatCards,
  SessionMonitor,
  AnalyticsSnapshot,
  FlaggedStudentsList
} from '@/pages/admin/components/overview';
import type { FlaggedStudent, RiskLevel, CallOutcome } from '@/types';
import { 
  useToggleBlock, 
  useToggleAssignment, 
  useLogCall,
  useEditStudent,
  useDeleteStudent
} from '@/pages/admin/hooks/useStudentMutations';
import { useMarkAbsent, useWindowStatus, useOpenWindow, useCloseWindow } from '@/api/hooks/attendance';

// Modals
import { 
  BulkAbsentModal,
  StudentDetailModal,
  LogCallModal,
  OutreachEmailModal,
  CallHistoryModal,
  EditStudentModal,
  DeleteStudentConfirmModal
} from '@/pages/admin/components/modals';

const cohortStats = [
  { name: 'Cohort 12', students: 42, progress: 72, attendance: 92 },
  { name: 'Cohort 11', students: 38, progress: 85, attendance: 95 },
  { name: 'Cohort 10', students: 45, progress: 91, attendance: 98 },
];

const AdminDashboard: React.FC = () => {
  const { addToast } = useToast();
  const [isBulkAbsentModalOpen, setIsBulkAbsentModalOpen] = useState(false);
  // Remove local isAttendanceOpen state, using useWindowStatus instead
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Selection states for modals
  const [selectedDetailStudent, setSelectedDetailStudent] = useState<FlaggedStudent | null>(null);
  const [loggingCallStudent, setLoggingCallStudent] = useState<FlaggedStudent | null>(null);
  const [viewingHistoryStudent, setViewingHistoryStudent] = useState<FlaggedStudent | null>(null);
  const [emailingStudent, setEmailingStudent] = useState<FlaggedStudent | null>(null);
  const [editingStudent, setEditingStudent] = useState<FlaggedStudent | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<FlaggedStudent | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('Assignments');
  const [sortConfig, setSortConfig] = useState<{ key: 'risk'; direction: 'asc' | 'desc' | null }>({
    key: 'risk',
    direction: 'desc',
  });

  // Data Fetching
  const { data: flaggedStudents = [], isLoading } = useQuery<FlaggedStudent[]>({
    queryKey: ['flaggedStudents'],
    queryFn: async () => {
      // Temporary fallback until a real /flagged endpoint exists
      // For now, we return empty as we are removing demo mock data
      return []; 
    },
  });

  const riskPriority = useMemo<Record<RiskLevel, number>>(() => ({ 'High': 3, 'Medium': 2, 'Low': 1 }), []);

  const handleSort = () => {
    let direction: 'asc' | 'desc' | null = 'desc';
    if (sortConfig.direction === 'desc') direction = 'asc';
    else if (sortConfig.direction === 'asc') direction = null;
    setSortConfig({ key: 'risk', direction });
  };

  const filteredAndSortedStudents = useMemo(() => {
    const result = [...flaggedStudents].filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesAssignment = assignmentFilter === 'Assignments' || 
                               !s.completedAssignments?.includes(assignmentFilter);
                               
      return matchesSearch && matchesAssignment;
    });

    if (sortConfig.direction !== null) {
      result.sort((a, b) => {
        const priorityA = riskPriority[a.risk];
        const priorityB = riskPriority[b.risk];
        return sortConfig.direction === 'asc' ? priorityA - priorityB : priorityB - priorityA;
      });
    }
    return result;
  }, [flaggedStudents, sortConfig, searchQuery, assignmentFilter, riskPriority]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20; 
  const totalPages = Math.ceil(filteredAndSortedStudents.length / rowsPerPage);
  const currentFlagged = useMemo(() => filteredAndSortedStudents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage), [currentPage, filteredAndSortedStudents]);

  const clearFilters = () => {
    setSearchQuery('');
    setAssignmentFilter('Assignments');
    setCurrentPage(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Session Window Status and Mutations
  const { data: windowStatusData } = useWindowStatus();
  const { mutate: openWindow, isPending: isOpening } = useOpenWindow();
  const { mutate: closeWindow, isPending: isClosing } = useCloseWindow();
  const { mutate: markAbsent, isPending: isMarkingAbsent } = useMarkAbsent();

  const isAttendanceOpen = windowStatusData?.data?.isOpen ?? false;

  const handleToggleAttendance = () => {
    if (isAttendanceOpen) {
      closeWindow(undefined, {
        onSuccess: (res) => {
          addToast({ type: 'success', title: 'Session Closed', message: res.message || 'Attendance window closed.' });
        },
        onError: (err: any) => {
          addToast({ type: 'error', title: 'Error', message: err.response?.data?.message || 'Failed to close window.' });
        }
      });
    } else {
      openWindow(undefined, {
        onSuccess: (res) => {
          addToast({ type: 'success', title: 'Session Opened', message: res.message || 'Attendance window opened.' });
        },
        onError: (err: any) => {
          addToast({ type: 'error', title: 'Error', message: err.response?.data?.message || 'Failed to open window.' });
        }
      });
    }
  };

  const handleBulkAbsentConfirm = () => {
    markAbsent({ date: new Date().toISOString() }, {
      onSuccess: (response) => {
        setIsBulkAbsentModalOpen(false);
        addToast({ 
          type: 'success', 
          title: 'Action Complete', 
          message: response.message || 'All enrolled students marked absent for the day.' 
        });
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to mark students as absent.';
        addToast({
          type: 'error',
          title: 'Action Failed',
          message: errorMessage
        });
      }
    });
  };

  // Custom hooks for mutations
  const toggleBlockMutation = useToggleBlock('flaggedStudents', 'id');
  const toggleAssignmentMutation = useToggleAssignment('flaggedStudents', 'id');
  const logCallMutation = useLogCall('flaggedStudents', 'id');
  const editStudentMutation = useEditStudent('flaggedStudents', 'id');
  const deleteStudentMutation = useDeleteStudent('flaggedStudents', 'id');

  const handleLogCall = (outcome: CallOutcome, note?: string) => {
    if (!loggingCallStudent) return;
    logCallMutation.mutate({ studentId: loggingCallStudent.id, outcome, note });
    setLoggingCallStudent(null);
  };

  const handleToggleAssignment = (id: string, assignment: string) => {
    toggleAssignmentMutation.mutate({ identifier: id, assignment });
  };

  const handleToggleBlock = (id: string) => {
    toggleBlockMutation.mutate(id);
  };

  const handleSendEmail = () => {
    if (!emailingStudent) return;
    addToast({ type: 'success', title: 'Outreach Dispatched', message: `Email outreach sent to ${emailingStudent.email}.` });
    setEmailingStudent(null);
  };

  const handleEditSave = (updatedStudent: FlaggedStudent) => {
    editStudentMutation.mutate(updatedStudent);
    setEditingStudent(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingStudent) return;
    deleteStudentMutation.mutate(deletingStudent.id);
    setDeletingStudent(null);
    setSelectedDetailStudent(null);
  };

  const handleExport = () => {
    if (filteredAndSortedStudents.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'Discord', 'Risk Level', 'Primary Reason', 'Call Count'];
    const rows = filteredAndSortedStudents.map(s => [s.name, s.email, s.phone, s.discord, s.risk, s.reason.replace(/,/g, ';'), s.callCount]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `at-risk-students-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-10 selection:bg-primary/30 animate-fade-in-up pb-20">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-white text-4xl font-black leading-tight tracking-tight uppercase">Admin Overview</h2>
            <p className="text-text-secondary text-base font-medium flex items-center gap-2">
              <StatusDot variant="primary" pulse glow />
              System Live • Fall 2023 Session Monitoring
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-text-secondary bg-surface-dark px-5 py-3 h-[60px] rounded-2xl border border-border-dark shadow-inner">
            <Icon name="calendar_today" className="text-xl text-primary" />
            <span>09:42 AM • Oct 24</span>
          </div>
        </div>

        <StatCards />

        <SessionMonitor 
          isAttendanceOpen={isAttendanceOpen} 
          onToggleAttendance={handleToggleAttendance} 
          onMarkAllAbsent={() => setIsBulkAbsentModalOpen(true)}
          isLoading={isOpening || isClosing}
        />

        <FlaggedStudentsList 
          students={currentFlagged}
          totalFilteredCount={filteredAndSortedStudents.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          assignmentFilter={assignmentFilter}
          onAssignmentChange={setAssignmentFilter}
          onExport={handleExport}
          sortConfig={sortConfig}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onLogCall={setLoggingCallStudent}
          onViewHistory={setViewingHistoryStudent}
          onViewDetails={setSelectedDetailStudent}
          onToggleAssignment={handleToggleAssignment}
          onToggleBlock={handleToggleBlock}
          onCopy={copyToClipboard}
          copiedText={copiedText}
          onClearFilters={clearFilters}
        />

        <AnalyticsSnapshot cohortStats={cohortStats} />
      </div>

      {/* Extracted Modals */}
      <BulkAbsentModal 
        isOpen={isBulkAbsentModalOpen} 
        onClose={() => setIsBulkAbsentModalOpen(false)} 
        onConfirm={handleBulkAbsentConfirm} 
        isLoading={isMarkingAbsent}
      />

      <StudentDetailModal 
        student={selectedDetailStudent} 
        isOpen={!!selectedDetailStudent} 
        onClose={() => setSelectedDetailStudent(null)}
        onEmail={setEmailingStudent}
        onEdit={setEditingStudent}
        onDelete={setDeletingStudent}
      />

      <LogCallModal 
        student={loggingCallStudent} 
        isOpen={!!loggingCallStudent} 
        onClose={() => setLoggingCallStudent(null)} 
        onLog={handleLogCall} 
      />

      <OutreachEmailModal 
        student={emailingStudent} 
        isOpen={!!emailingStudent} 
        onClose={() => setEmailingStudent(null)} 
        onSend={handleSendEmail} 
      />

      <CallHistoryModal 
        student={viewingHistoryStudent} 
        isOpen={!!viewingHistoryStudent} 
        onClose={() => setViewingHistoryStudent(null)} 
      />

      <EditStudentModal 
        student={editingStudent} 
        isOpen={!!editingStudent} 
        onClose={() => setEditingStudent(null)} 
        onSave={handleEditSave} 
      />

      <DeleteStudentConfirmModal 
        student={deletingStudent} 
        isOpen={!!deletingStudent} 
        onClose={() => setDeletingStudent(null)} 
        onConfirm={handleConfirmDelete} 
      />
    </>
  );
};

export default AdminDashboard;
