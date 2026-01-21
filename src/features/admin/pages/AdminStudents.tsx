
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/layouts/AdminLayout';
import { fetchStudents } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/constants';
import { IconAvatar } from '@/components/ui/icon-avatar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { CallOutcome, AdminStudent } from '@/types';
import { 
  useToggleBlock, 
  useToggleAssignment, 
  useLogCall,
  useEditStudent,
  useDeleteStudent
} from '@/features/admin/hooks/useStudentMutations';

// Sub-components
import { StudentActionBar } from '@/features/admin/components/students/StudentActionBar';
import { StudentTable } from '@/features/admin/components/students/StudentTable';

// Modals
import { AddStudentModal } from '@/features/admin/components/modals/AddStudentModal';
import { EditStudentModal } from '@/features/admin/components/modals/EditStudentModal';
import { DeleteStudentConfirmModal } from '@/features/admin/components/modals/DeleteStudentConfirmModal';
import { StudentDetailModal } from '@/features/admin/components/modals/StudentDetailModal';
import { OutreachEmailModal } from '@/features/admin/components/modals/OutreachEmailModal';
import { LogCallModal } from '@/features/admin/components/modals/LogCallModal';
import { CallHistoryModal } from '@/features/admin/components/modals/CallHistoryModal';

interface AdminStudentsProps {
  onLogout: () => void;
}

const AdminStudents: React.FC<AdminStudentsProps> = ({ onLogout }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Data Fetching
  const { data: students = [], isLoading } = useQuery<AdminStudent[]>({
    queryKey: ['students'],
    queryFn: fetchStudents as () => Promise<AdminStudent[]>,
  });
  
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
    return students.filter((s) => {
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
  const toggleBlockMutation = useToggleBlock('students', 'email');
  const toggleAssignmentMutation = useToggleAssignment('students', 'email');
  const logCallMutation = useLogCall('students', 'email');
  const editStudentMutation = useEditStudent('students', 'email');
  const deleteStudentMutation = useDeleteStudent('students', 'email');

  const handleToggleBlock = (email: string) => {
    toggleBlockMutation.mutate(email);
  };

  const handleToggleAssignment = (studentEmail: string, assignment: string) => {
    toggleAssignmentMutation.mutate({ identifier: studentEmail, assignment });
  };

  const handleLogCall = (outcome: CallOutcome) => {
    if (!loggingCallStudent) return;
    logCallMutation.mutate({ studentId: loggingCallStudent.email, outcome });
    setLoggingCallStudent(null);
  };

  const handleEditSave = (updatedStudent: AdminStudent) => {
    editStudentMutation.mutate(updatedStudent);
    setIsEditModalOpen(false);
    setActionStudent(null);
  };

  const handleConfirmDelete = () => {
    if (actionStudent) {
      deleteStudentMutation.mutate(actionStudent.email);
      setIsDeleteModalOpen(false);
      setActionStudent(null);
      setProfileStudent(null);
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

    </AdminLayout>
  );
};

export default AdminStudents;
