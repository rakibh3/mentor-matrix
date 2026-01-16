
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/layout/AdminLayout';
import { fetchStudents } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CallOutcome } from '@/types';
import { 
  useToggleBlock, 
  useToggleAssignment, 
  useLogCall 
} from '@/hooks/useStudentMutations';

// Sub-components
import { StudentActionBar } from '@/components/admin/student/StudentActionBar';
import { StudentTable } from '@/components/admin/student/StudentTable';

// Modals
import { AddStudentModal } from '@/components/admin/modal/AddStudentModal';
import { EditStudentModal } from '@/components/admin/modal/EditStudentModal';
import { DeleteStudentConfirmModal } from '@/components/admin/modal/DeleteStudentConfirmModal';
import { StudentDetailModal } from '@/components/admin/modal/StudentDetailModal';
import { OutreachEmailModal } from '@/components/admin/modal/OutreachEmailModal';
import { LogCallModal } from '@/components/admin/modal/LogCallModal';
import { CallHistoryModal } from '@/components/admin/modal/CallHistoryModal';

interface AdminStudentsProps {
  onLogout: () => void;
}

const AdminStudents: React.FC<AdminStudentsProps> = ({ onLogout }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Data Fetching
  const { data: students = [], isLoading } = useQuery<unknown[]>({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });
  
  // Selection/Modal States
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profileStudent, setProfileStudent] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [actionStudent, setActionStudent] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loggingCallStudent, setLoggingCallStudent] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viewingHistoryStudent, setViewingHistoryStudent] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [emailingStudent, setEmailingStudent] = useState<any | null>(null);
  
  // Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [progressFilter, setProgressFilter] = useState('All Progress');
  const [assignmentFilter, setAssignmentFilter] = useState('Assignments');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return (students as Record<string, unknown>[]).filter((s: Record<string, unknown>) => {
      const name = s.name as string;
      const email = s.email as string;
      const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const progress = s.progress as number;
      const matchProgress = (() => {
        if (progressFilter === 'All Progress') return true;
        if (progressFilter === 'At Risk (< 50%)') return progress < 50;
        if (progressFilter === 'Average (50-80%)') return progress >= 50 && progress <= 80;
        if (progressFilter === 'Excelling (> 80%)') return progress > 80;
        return true;
      })();
      
      const completedAssignments = s.completedAssignments as string[];
      const matchAssignment = assignmentFilter === 'Assignments' || 
                             !completedAssignments.includes(assignmentFilter);
      
      return matchSearch && matchProgress && matchAssignment;
    });
  }, [students, progressFilter, assignmentFilter, searchQuery]);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const currentStudents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredStudents.slice(start, start + rowsPerPage);
  }, [filteredStudents, currentPage]);

  // Custom hooks for mutations
  const toggleBlockMutation = useToggleBlock('students', 'email');
  const toggleAssignmentMutation = useToggleAssignment('students', 'email');
  const logCallMutation = useLogCall('students', 'email');

  const handleToggleBlock = (email: string) => {
    toggleBlockMutation.mutate(email);
  };

  const handleToggleAssignment = (studentEmail: string, assignment: string) => {
    toggleAssignmentMutation.mutate({ identifier: studentEmail, assignment });
  };

  const handleLogCall = (outcome: CallOutcome) => {
    if (!loggingCallStudent) return;
    const studentId = (loggingCallStudent.id || loggingCallStudent.email) as string;
    logCallMutation.mutate({ studentId, outcome });
    setLoggingCallStudent(null);
  };

  const editStudentMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (updated: any) => updated,
    onSuccess: (data) => {
      queryClient.setQueryData(['students'], (old: unknown[] | undefined) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return old?.map((s: any) => (s.email === data.email ? data : s));
      });
      setIsEditModalOpen(false);
      setActionStudent(null);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditSave = (updatedStudent: any) => {
    editStudentMutation.mutate(updatedStudent);
  };

  const deleteStudentMutation = useMutation({
    mutationFn: async (email: string) => email,
    onSuccess: (email) => {
      queryClient.setQueryData(['students'], (old: unknown[] | undefined) => {
        return old?.filter((s: Record<string, unknown>) => s.email !== email);
      });
      setIsDeleteModalOpen(false);
      setActionStudent(null);
      setProfileStudent(null);
    }
  });

  const handleConfirmDelete = () => {
    if (actionStudent) {
      const email = actionStudent.email as string;
      deleteStudentMutation.mutate(email);
    }
  };

  const addStudentMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (newStudent: any) => newStudent,
    onSuccess: (newStudent) => {
      const cohort = newStudent.cohort as string;
      const studentToAdd = {
        ...newStudent,
        status: 'Active',
        cohort: cohort.split(' ')[1],
        module: 'Intro: Onboarding',
        rate: 100,
        progress: 0,
        color: 'primary',
        isBlocked: false
      };
      queryClient.setQueryData(['students'], (old: unknown[] | undefined) => [studentToAdd, ...(old || [])]);
      setIsAddModalOpen(false);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddStudent = (newStudent: any) => {
    addStudentMutation.mutate(newStudent);
  };

  const handleSendEmail = () => {
    if (!emailingStudent) return;
    const emailAddr = emailingStudent.email as string;
    addToast({ type: 'success', title: 'Outreach Dispatched', message: `Email outreach sent to ${emailAddr}.` });
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
      <AdminLayout onLogout={onLogout}>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="w-full flex flex-col gap-6 animate-fade-in-up">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-lg">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-2xl font-black uppercase tracking-tight">STUDENT MANAGEMENT</h1>
              <p className="text-text-secondary text-sm font-medium">Tracking submissions and performance trends</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-2.5 rounded-full border border-primary/20">

            <span>TOTAL STUDENTS: {students.length}</span>
          </div>
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

    </AdminLayout>
  );
};

export default AdminStudents;
