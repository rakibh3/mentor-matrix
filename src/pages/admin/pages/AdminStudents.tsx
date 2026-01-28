import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAttendance } from '@/api/endpoints/attendance';
import { Badge, IconAvatar, useToast } from '@/components/ui';
import { Icon } from '@/constants';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { CallOutcome, AdminStudent } from '@/types';
import { 
  useToggleBlock, 
  useToggleAssignment, 
  useLogCall
} from '@/pages/admin/hooks/useStudentMutations';
import { useUpdateUserData, useDeleteUser } from '@/api/hooks/users';

// Sub-components
import { StudentActionBar } from '@/pages/admin/components/students/StudentActionBar';
import { StudentTable } from '@/pages/admin/components/students/StudentTable';

// Modals
import { 
  AddStudentModal,
  EditStudentModal,
  DeleteStudentConfirmModal,
  StudentDetailModal,
  OutreachEmailModal,
  LogCallModal,
  CallHistoryModal
} from '@/pages/admin/components/modals';

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
      const sortedAttendance = [...(user.attendance || [])].sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const recentAttendance = sortedAttendance
        .slice(0, 6)
        .map((a: any) => {
          const d = new Date(a.date);
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const dateStr = `${d.getDate()}${months[d.getMonth()]}`;
          return { present: a.status === 'ATTENDED', date: dateStr };
        })
        .reverse(); // Left to right: oldest to newest (last 6)

      const attendancePercentage = user.attendancePercentage || 0;
      const riskLevel = attendancePercentage < 70 ? 'High' : attendancePercentage < 85 ? 'Medium' : 'Low';

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

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter((s: AdminStudent) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchProgress = (() => {
        if (progressFilter === 'All Progress') return true;
        if (progressFilter === 'At Risk (< 50%)') return s.progress < 50;
        if (progressFilter === 'Average (50-80%)') return s.progress >= 50 && s.progress <= 80;
        if (progressFilter === 'Excelling (> 80%)') return s.progress > 80;
        return true;
      })();
      
      const matchAssignment = assignmentFilter === 'Assignments' || 
                             !s.completedAssignments.includes(assignmentFilter);
      
      return matchSearch && matchProgress && matchAssignment;
    });
  }, [students, progressFilter, assignmentFilter, searchQuery]);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const currentStudents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredStudents.slice(start, start + rowsPerPage);
  }, [filteredStudents, currentPage]);

  // Custom hooks for mutations
  const toggleBlockMutation = useToggleBlock('attendance-list', 'id');
  const toggleAssignmentMutation = useToggleAssignment('attendance-list', 'id');
  const logCallMutation = useLogCall('attendance-list', 'id');
  
  // Real API mutations from users hooks
  const { mutate: updateUserData } = useUpdateUserData();
  const { mutate: deleteUser } = useDeleteUser();

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
      updateUserData({
        userId,
        data: {
          name: updatedStudent.name,
          phone: updatedStudent.phone,
          discordUsername: updatedStudent.discord
        }
      }, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setActionStudent(null);
          addToast({ type: 'success', title: 'Student Updated', message: 'Student information has been successfully synced with the backend.' });
        },
        onError: (err: any) => {
          addToast({ type: 'error', title: 'Update Failed', message: err.response?.data?.message || 'Failed to update student data.' });
        }
      });
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
          addToast({ type: 'info', title: 'Student Removed', message: 'Student record has been successfully deleted from the database.' });
        },
        onError: (err: any) => {
          addToast({ type: 'error', title: 'Delete Failed', message: err.response?.data?.message || 'Failed to delete student.' });
        }
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
        isBlocked: false
      };
      queryClient.setQueryData(['students'], (old: AdminStudent[] | undefined) => [studentToAdd, ...(old || [])]);
      setIsAddModalOpen(false);
    }
  });

  const handleAddStudent = (newStudent: Partial<AdminStudent>) => {
    addStudentMutation.mutate(newStudent);
  };

  const handleSendEmail = () => {
    if (!emailingStudent) return;
    addToast({ type: 'success', title: 'Outreach Dispatched', message: `Email outreach sent to ${emailingStudent.email}.` });
    setEmailingStudent(null);
  };

  const clearAllFilters = () => {
    setProgressFilter('All Progress');
    setAssignmentFilter('Assignments');
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery !== '' || progressFilter !== 'All Progress' || assignmentFilter !== 'Assignments';

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-6 animate-fade-in-up">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <IconAvatar variant="primary" size="md" className="shadow-lg">
              <Icon name="school" className="text-2xl" />
            </IconAvatar>
            <div className="flex flex-col">
              <h1 className="text-white text-2xl font-black uppercase tracking-tight">STUDENT MANAGEMENT</h1>
              <p className="text-text-secondary text-sm font-medium">Tracking submissions and performance trends</p>
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

        {/* Table Section */}
        <StudentTable 
          students={currentStudents}
          totalFilteredCount={filteredStudents.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onToggleAssignment={handleToggleAssignment}
          onViewDetails={setProfileStudent}
          onEditClick={(s) => { setActionStudent(s); setIsEditModalOpen(true); }}
          onDeleteClick={(s) => { setActionStudent(s); setIsDeleteModalOpen(true); }}
          onToggleBlock={handleToggleBlock}
          onLogCall={setLoggingCallStudent}
          onViewHistory={setViewingHistoryStudent}
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
        onEdit={(s) => { setProfileStudent(null); setActionStudent(s); setIsEditModalOpen(true); }}
        onDelete={(s) => { setProfileStudent(null); setActionStudent(s); setIsDeleteModalOpen(true); }}
      />

      <OutreachEmailModal 
        student={emailingStudent} 
        isOpen={!!emailingStudent} 
        onClose={() => setEmailingStudent(null)} 
        onSend={handleSendEmail} 
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
