import React, { useMemo, useState } from 'react';
import { Icon } from '@/constants';
import type { AdminStudent, CallOutcome } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAttendance } from '@/api/endpoints/attendance';
import { useDeleteUser, useUpdateUserData } from '@/api/hooks/users';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge, IconAvatar, useToast } from '@/components/ui';
// Modals
import {
  AddStudentModal,
  CallHistoryModal,
  DeleteStudentConfirmModal,
  EditStudentModal,
  LogCallModal,
  OutreachEmailModal,
  StudentDetailModal,
  BulkAssignSrmModal,
} from '@/pages/admin/components/modals';
// Sub-components
import { StudentActionBar } from '@/pages/admin/components/students/StudentActionBar';
import { StudentTable } from '@/pages/admin/components/students/StudentTable';
import { BulkActionBar } from '@/pages/admin/components/students/BulkActionBar';
import {
  useLogCall,
  useToggleAssignment,
  useToggleBlock,
} from '@/pages/admin/hooks/useStudentMutations';
import { useSrms } from '@/api/hooks/users';
import { useBulkAssignSrm } from '@/api/hooks/students';

const AdminStudents: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Data Fetching
  const { data: attendanceResponse, isLoading } = useQuery({
    queryKey: ['attendance-list'],
    queryFn: getAttendance,
  });

  const students = useMemo(() => {
    const data = (attendanceResponse?.data as any) || [];
    return data.map((item: any) => {
      // Handle both formats if necessary, but expecting StudentAttendanceData
      const user = item;

      // Map attendance to boolean array for the last 6 sessions
      const sortedAttendance = [...(user.attendance || [])].sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      const recentAttendance = sortedAttendance
        .slice(0, 6)
        .map((a: any) => {
          const d = new Date(a.date);
          const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];
          const dateStr = `${d.getDate()}${months[d.getMonth()]}`;
          return { present: a.status === 'ATTENDED', date: dateStr };
        })
        .reverse(); // Left to right: oldest to newest (last 6)

      const attendancePercentage = user.attendancePercentage || 0;
      const riskLevel =
        attendancePercentage < 70 ? 'High' : attendancePercentage < 85 ? 'Medium' : 'Low';

      return {
        ...user,
        id: user.id || user._id,
        discord: user.discordUsername || '',
        cohort: '12',
        status: 'Active',
        risk: riskLevel,
        module: 'Module 4: React Patterns',
        rate: attendancePercentage,
        color: 'primary',
        progress: 50,
        completedAssignments: [],
        recentAttendance,
        callCount: 0,
        callHistory: [],
        isBlocked: false,
      } as AdminStudent;
    });
  }, [attendanceResponse]);

  // Selection/Modal States - using AdminStudent which is compatible with modal expectations
  // The modals expect FlaggedStudent but AdminStudent has the same shape for the fields they use
  const [profileStudent, setProfileStudent] = useState<AdminStudent | null>(null);
  const [actionStudent, setActionStudent] = useState<AdminStudent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loggingCallStudent, setLoggingCallStudent] = useState<AdminStudent | null>(null);
  const [viewingHistoryStudent, setViewingHistoryStudent] = useState<AdminStudent | null>(null);
  const [emailingStudent, setEmailingStudent] = useState<AdminStudent | null>(null);

  // Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [progressFilter, setProgressFilter] = useState('All Progress');
  const [assignmentFilter, setAssignmentFilter] = useState('Assignments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter((s: AdminStudent) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchProgress = (() => {
        if (progressFilter === 'All Progress') return true;
        
        // Progress based filters
        if (progressFilter === 'At Risk (< 50%)') return s.rate < 50;
        if (progressFilter === 'Average (50-80%)') return s.rate >= 50 && s.rate <= 80;
        if (progressFilter === 'Excelling (> 80%)') return s.rate > 80;

        // Absence based filters
        if (progressFilter.includes('Absence')) {
          const recent = s.recentAttendance || [];
          const len = recent.length;

          // recentAttendance is sorted old -> new in mapping (due to reverse), 
          // but let's check the map logic again in AdminStudents:
          // sortedAttendance is descending (newest first).
          // .reverse() makes it ascending (oldest first).
          // So index 5 is newest.
          
          if (progressFilter === 'Last 2 Days Absence') {
             // Check last 2 entries (newest)
             if (len < 2) return false;
             return !recent[len-1].present && !recent[len-2].present;
          }
          if (progressFilter === 'Last 3 Days Absence') {
             if (len < 3) return false;
             return !recent[len-1].present && !recent[len-2].present && !recent[len-3].present;
          }
          if (progressFilter === 'Last 2 Weeks Absence') {
            // Check if user has been absent for all available recent records (up to 6)
            if (len === 0) return false;
            return recent.every(r => !r.present);
          }
        }
        
        return true;
      })();

      const matchAssignment =
        assignmentFilter === 'Assignments' || !s.completedAssignments.includes(assignmentFilter);

      return matchSearch && matchProgress && matchAssignment;
    });
  }, [students, progressFilter, assignmentFilter, searchQuery]);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const currentStudents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredStudents.slice(start, start + rowsPerPage);
  }, [filteredStudents, currentPage]);

  const selectedStudents = useMemo(() => {
    return students.filter((s: AdminStudent) => selectedIds.includes(s.email));
  }, [students, selectedIds]);

  // Custom hooks for mutations
  const toggleBlockMutation = useToggleBlock('attendance-list', 'id');
  const toggleAssignmentMutation = useToggleAssignment('attendance-list', 'id');
  const logCallMutation = useLogCall('attendance-list', 'id');

  // Real API mutations from users hooks
  const { mutate: updateUserData } = useUpdateUserData();
  const { mutate: deleteUser } = useDeleteUser();
  const { data: srmsData } = useSrms();
  const bulkAssignMutation = useBulkAssignSrm();

  const handleToggleBlock = (id: string) => {
    toggleBlockMutation.mutate(id);
  };

  const handleToggleAssignment = (studentId: string, assignment: string) => {
    toggleAssignmentMutation.mutate({ identifier: studentId, assignment });
  };

  const handleLogCall = (outcome: CallOutcome, note?: string) => {
    if (!loggingCallStudent) return;
    const studentId = loggingCallStudent.id! || loggingCallStudent._id!;
    logCallMutation.mutate({ studentId, outcome, note });
    setLoggingCallStudent(null);
  };

  const handleEditSave = (updatedStudent: AdminStudent) => {
    const userId = updatedStudent.id || updatedStudent._id;
    if (userId) {
      updateUserData(
        {
          userId,
          data: {
            name: updatedStudent.name,
            phone: updatedStudent.phone,
            discordUsername: updatedStudent.discord,
          },
        },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            setActionStudent(null);
            addToast({
              type: 'success',
              title: 'Student Updated',
              message: 'Student information has been successfully synced with the backend.',
            });
          },
          onError: (err: any) => {
            addToast({
              type: 'error',
              title: 'Update Failed',
              message: err.response?.data?.message || 'Failed to update student data.',
            });
          },
        }
      );
    }
  };

  const handleConfirmDelete = () => {
    const userId = actionStudent?.id || actionStudent?._id;
    if (userId) {
      deleteUser(userId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setActionStudent(null);
          setProfileStudent(null);
          addToast({
            type: 'info',
            title: 'Student Removed',
            message: 'Student record has been successfully deleted from the database.',
          });
        },
        onError: (err: any) => {
          addToast({
            type: 'error',
            title: 'Delete Failed',
            message: err.response?.data?.message || 'Failed to delete student.',
          });
        },
      });
    }
  };

  const addStudentMutation = useMutation({
    mutationFn: async (newStudent: Partial<AdminStudent>) => newStudent,
    onSuccess: (newStudent) => {
      const studentToAdd: AdminStudent = {
        name: newStudent.name || '',
        email: newStudent.email || '',
        phone: newStudent.phone || '',
        discord: newStudent.discord || '',
        cohort: newStudent.cohort || '12',
        status: 'Active',
        risk: 'Low',
        module: 'Intro: Onboarding',
        rate: 100,
        color: 'primary',
        progress: 0,
        completedAssignments: [],
        recentAttendance: [],
        callCount: 0,
        callHistory: [],
        isBlocked: false,
      };
      queryClient.setQueryData(['students'], (old: AdminStudent[] | undefined) => [
        studentToAdd,
        ...(old || []),
      ]);
      setIsAddModalOpen(false);
    },
  });

  const handleAddStudent = (newStudent: Partial<AdminStudent>) => {
    addStudentMutation.mutate(newStudent);
  };

  const handleBulkMessage = (subject: string, body: string) => {
    // In a real app, you would send IDs to the backend to dispatch emails queue
    // For now, we'll just simulate success for the selected batch
    console.log('Sending bulk email:', { subject, body, recipients: selectedIds });
    addToast({
      type: 'success',
      title: 'Bulk Email Sent',
      message: `Successfully queued emails for ${selectedIds.length} students.`,
    });
    setIsBulkEmailModalOpen(false);
    setSelectedIds([]);
  };

  const handleSendEmail = () => {
    if (!emailingStudent) return;
    addToast({
      type: 'success',
      title: 'Outreach Dispatched',
      message: `Email outreach sent to ${emailingStudent.email}.`,
    });
    setEmailingStudent(null);
  };

  const clearAllFilters = () => {
    setProgressFilter('All Progress');
    setAssignmentFilter('Assignments');
    setSearchQuery('');
    setSelectedIds([]);
  };

  const handleBulkAssign = (srmId: string) => {
    // We need student IDs (from database) not emails
    const studentIds = selectedStudents.map((s: AdminStudent) => s.id || s._id).filter(Boolean) as string[];
    bulkAssignMutation.mutate(
      { srmId, studentIds },
      {
        onSuccess: () => {
          setIsBulkAssignModalOpen(false);
          setSelectedIds([]);
        },
      }
    );
  };

  const handleBulkExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Discord', 'Rate', 'Risk'],
      ...selectedStudents.map((s: AdminStudent) => [s.name, s.email, s.phone, s.discord, `${s.rate}%`, s.risk])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'selected_students.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToast({
      type: 'success',
      title: 'Export Successful',
      message: `${selectedIds.length} students exported to CSV.`
    });
  };

  const hasActiveFilters =
    searchQuery !== '' || progressFilter !== 'All Progress' || assignmentFilter !== 'Assignments';

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="animate-fade-in-up flex w-full flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <IconAvatar variant="primary" size="md" className="shadow-lg">
              <Icon name="school" className="text-2xl" />
            </IconAvatar>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                STUDENT MANAGEMENT
              </h1>
              <p className="text-text-secondary text-sm font-medium">
                Tracking submissions and performance trends
              </p>
            </div>
          </div>
          <Badge variant="primary" size="lg" className="tracking-[0.2em]">
            TOTAL STUDENTS: {students.length}
          </Badge>
        </div>

        {/* Action Bar */}
        <StudentActionBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          assignmentFilter={assignmentFilter}
          onAssignmentChange={setAssignmentFilter}
          progressFilter={progressFilter}
          onProgressChange={setProgressFilter}
          onAddClick={() => setIsAddModalOpen(true)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
        />

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <BulkActionBar
            selectedCount={selectedIds.length}
            isVisible={selectedIds.length > 0}
            onClearSelection={() => setSelectedIds([])}
            onAssignSRM={() => setIsBulkAssignModalOpen(true)}
            onSendEmail={() => setIsBulkEmailModalOpen(true)}
            onExport={handleBulkExport}
          />
        )}

        {/* Table Section */}
        <StudentTable
          students={currentStudents}
          totalFilteredCount={filteredStudents.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onToggleAssignment={handleToggleAssignment}
          onViewDetails={setProfileStudent}
          onEditClick={(s) => {
            setActionStudent(s);
            setIsEditModalOpen(true);
          }}
          onDeleteClick={(s) => {
            setActionStudent(s);
            setIsDeleteModalOpen(true);
          }}
          onToggleBlock={handleToggleBlock}
          onLogCall={setLoggingCallStudent}
          onViewHistory={setViewingHistoryStudent}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddStudent}
      />

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={actionStudent}
        onSave={handleEditSave}
      />

      <DeleteStudentConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        student={actionStudent}
        onConfirm={handleConfirmDelete}
      />

      <StudentDetailModal
        student={profileStudent}
        isOpen={!!profileStudent}
        onClose={() => setProfileStudent(null)}
        onEmail={setEmailingStudent}
        onEdit={(s) => {
          setProfileStudent(null);
          setActionStudent(s);
          setIsEditModalOpen(true);
        }}
        onDelete={(s) => {
          setProfileStudent(null);
          setActionStudent(s);
          setIsDeleteModalOpen(true);
        }}
      />

      <OutreachEmailModal
        students={isBulkEmailModalOpen ? selectedStudents : emailingStudent ? [emailingStudent] : []}
        isOpen={isBulkEmailModalOpen || !!emailingStudent}
        onClose={() => {
          setIsBulkEmailModalOpen(false);
          setEmailingStudent(null);
        }}
        onSend={(subject, body) => {
          if (isBulkEmailModalOpen) {
            handleBulkMessage(subject, body);
          } else {
            handleSendEmail();
          }
        }}
      />

      <BulkAssignSrmModal
        isOpen={isBulkAssignModalOpen}
        onClose={() => setIsBulkAssignModalOpen(false)}
        onAssign={handleBulkAssign}
        selectedCount={selectedIds.length}
        srms={(srmsData?.data as any) || []}
      />

      <LogCallModal
        student={loggingCallStudent}
        isOpen={!!loggingCallStudent}
        onClose={() => setLoggingCallStudent(null)}
        onLog={handleLogCall}
      />

      <CallHistoryModal
        student={viewingHistoryStudent}
        isOpen={!!viewingHistoryStudent}
        onClose={() => setViewingHistoryStudent(null)}
      />
    </>
  );
};

export default AdminStudents;
