import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/constants';
import { Link } from 'react-router-dom';
import type { CallOutcome } from '@/pages/admin/types/call';
import { useQuery } from '@tanstack/react-query';
import { getSrmAttendance } from '@/api/endpoints/attendance';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { Badge, IconAvatar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  CallHistoryModal,
  DiscordActionModal,
  LogCallModal,
  OutreachEmailModal,
  StudentDetailModal,
} from '@/pages/admin/components/modals';
import { BulkActionBar } from '@/pages/admin/components/students/BulkActionBar';
import { StudentActionBar } from '@/pages/admin/components/students/StudentActionBar';
import { StudentTable } from '@/pages/admin/components/students/StudentTable';
import { useSendOutreachEmail } from '@/pages/admin/hooks/useSrmSettings';
import { useLogCall } from '@/pages/admin/hooks/useStudentMutations';
import { formatDhakaDate } from '@/lib/dhakaTime';
import type { AdminStudent } from '@/pages/admin/types/student';

const SrmDashboard: React.FC = () => {
  const { user } = useAuth();

  // Data Fetching
  const { data: attendanceResponse, isLoading } = useQuery({
    queryKey: ['attendance-list'],
    queryFn: getSrmAttendance,
  });

  // Debug logging
  console.log('SRM Dashboard - Attendance Response:', attendanceResponse);
  console.log('SRM Dashboard - User:', user);

  // Filters and Searching State
  const [searchQuery, setSearchQuery] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('Assignments');
  const [progressFilter, setProgressFilter] = useState('All Progress');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Campaign and Sorting State
  const [activeCampaign, setActiveCampaign] = useState<
    'all' | 'attendance' | 'assignment' | 'high-risk'
  >('all');
  const [manualCampaigns, setManualCampaigns] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: 'risk',
    direction: 'desc',
  });

  // Selection states for modals
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null);
  const [loggingCallStudent, setLoggingCallStudent] = useState<AdminStudent | null>(null);
  const [viewingHistoryStudent, setViewingHistoryStudent] = useState<AdminStudent | null>(null);
  const [emailingStudents, setEmailingStudents] = useState<AdminStudent[]>([]);
  const [discordActionStudent, setDiscordActionStudent] = useState<AdminStudent | null>(null);
  const [discordActionType, setDiscordActionType] = useState<'kick' | 'ban' | null>(null);

  // Mutations
  const logCallMutation = useLogCall('attendance-list', '_id');
  const sendEmailMutation = useSendOutreachEmail();

  const handleLogCall = (outcome: CallOutcome, note?: string) => {
    if (!loggingCallStudent) return;
    const studentId = loggingCallStudent._id || (loggingCallStudent as any)._id;
    logCallMutation.mutate({ studentId, outcome, note });
    setLoggingCallStudent(null);
  };

  const handleSendEmail = async (subject: string, body: string) => {
    if (emailingStudents.length === 0) return;

    const emails = emailingStudents
      .map((student) => student.email)
      .filter((email): email is string => !!email);

    if (emails.length === 0) return;

    try {
      await sendEmailMutation.mutateAsync({
        to: emails,
        subject,
        body,
      });
      setEmailingStudents([]);
    } catch (error) {
      // Error is handled by mutation's onError (toast)
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
    else if (sortConfig.key === key && sortConfig.direction === 'asc') direction = null;
    setSortConfig({ key, direction });
  };

  const handleDiscordModeration = (reason: string, details: string, preventRejoin?: boolean) => {
    if (!discordActionStudent || !discordActionType) return;

    // Log the action to history
    logCallMutation.mutate({
      studentId: discordActionStudent._id || (discordActionStudent as any)._id,
      outcome: 'Discord Action',
      note: `Discord ${discordActionType.toUpperCase()}: ${reason}. ${details}${preventRejoin ? ' (Prevent Re-join Active)' : ''}`,
    });

    setDiscordActionStudent(null);
    setDiscordActionType(null);
  };

  const handleAllocateToCampaign = (campaignId: string) => {
    const newAllocations = { ...manualCampaigns };
    selectedIds.forEach((id) => {
      newAllocations[id] = campaignId;
    });
    setManualCampaigns(newAllocations);
    setSelectedIds([]);
  };

  const handleBulkAssignToCampaign = () => {
    // Use the active campaign as the default allocation
    if (activeCampaign !== 'all') {
      handleAllocateToCampaign(activeCampaign);
    }
  };

  const handleBulkEmail = () => {
    const studentsToEmail = assignedStudents.filter((s: any) =>
      selectedIds.includes(s.email || s._id)
    );
    setEmailingStudents(studentsToEmail as any);
  };

  const handleExport = () => {
    const selectedStudents = assignedStudents.filter((s: any) =>
      selectedIds.includes(s.email || s._id)
    );
    const headers = ['Name', 'Email', 'Progress', 'Risk Level', 'Campaign'];
    const rows = selectedStudents.map((s: any) => [
      s.name,
      s.email,
      `${s.progress}%`,
      s.riskLevel || s.risk,
      manualCampaigns[s.email || s._id] || 'None',
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `srm_export_${formatDhakaDate()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const assignedStudents = useMemo(() => {
    const data = (attendanceResponse?.data as any) || [];
    if (!user) return [];

    // Backend already filters students by assignedSrmId, so we don't need to filter again
    // Just map the data to the format we need
    return data.map((s: any) => {
      const userInfo = s.userId || {};
      const name = s.name || userInfo.name || 'Unknown';
      const email = s.email || userInfo.email || '';

      // Calculate recent attendance for the grid visualizations
      const sortedAttendance = [...(s.attendance || [])].sort(
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
          return { present: a.status === 'ATTENDED' || a.status === 'Present', date: dateStr };
        })
        .reverse();

      const attendancePercentage = s.attendancePercentage || 0;
      const calculatedRisk =
        attendancePercentage < 70 ? 'High' : attendancePercentage < 85 ? 'Medium' : 'Low';

      return {
        ...s,
        _id: s._id || userInfo._id,
        name,
        email,
        phone: s.phone || userInfo.phone || '',
        discord: s.discordUsername || userInfo.discord || '',
        recentAttendance,
        risk: s.riskLevel || s.risk || calculatedRisk,
        // Inject campaign tag for UI display in 'All' tab
        assignmentCriteria: manualCampaigns[email || s._id]
          ? `Campaign: ${manualCampaigns[email || s._id].replace('-', ' ')}`
          : s.assignmentCriteria,
        callHistory: s.callHistory || [],
      };
    });
  }, [attendanceResponse, user, manualCampaigns]);

  const campaignFilteredStudents = useMemo(() => {
    let results = [...assignedStudents];

    // Filter by Manual Campaign Allocation
    if (activeCampaign !== 'all') {
      results = results.filter((s: any) => manualCampaigns[s.email || s._id] === activeCampaign);
    }

    return results;
  }, [assignedStudents, activeCampaign, manualCampaigns]);

  const finalFilteredStudents = useMemo(() => {
    let results = campaignFilteredStudents.filter((s: any) => {
      const name = s.name ? String(s.name) : '';
      const email = s.email ? String(s.email) : '';
      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAssignment =
        assignmentFilter === 'Assignments' ||
        !(s.completedAssignments || []).includes(assignmentFilter);

      let matchesProgress = true;
      if (progressFilter !== 'All Progress') {
        const progress = s.progress || 0;
        if (progressFilter === 'At Risk (< 50%)') matchesProgress = progress < 50;
        else if (progressFilter === 'Average (50-80%)')
          matchesProgress = progress >= 50 && progress <= 80;
        else if (progressFilter === 'Excelling (> 80%)') matchesProgress = progress > 80;
      }

      return matchesSearch && matchesAssignment && matchesProgress;
    });

    // Apply Sorting
    if (sortConfig.direction) {
      results.sort((a, b) => {
        let valA: any = 0;
        let valB: any = 0;

        if (sortConfig.key === 'risk') {
          const priority: any = { High: 3, Medium: 2, Low: 1 };
          valA = priority[a.riskLevel || a.risk] || 0;
          valB = priority[b.riskLevel || b.risk] || 0;
        } else if (sortConfig.key === 'assignments') {
          valA = (a.completedAssignments || []).length;
          valB = (b.completedAssignments || []).length;
        } else if (sortConfig.key === 'attendance') {
          valA = (a.recentAttendance || []).filter((r: any) => r.present).length;
          valB = (b.recentAttendance || []).filter((r: any) => r.present).length;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return results;
  }, [campaignFilteredStudents, searchQuery, assignmentFilter, progressFilter, sortConfig]);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, assignmentFilter, progressFilter]);

  const totalPages = Math.ceil(finalFilteredStudents.length / rowsPerPage);
  const currentStudents = useMemo(
    () => finalFilteredStudents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [currentPage, finalFilteredStudents]
  );

  const hasActiveFilters =
    searchQuery !== '' || assignmentFilter !== 'Assignments' || progressFilter !== 'All Progress';

  if (isLoading) {
    return <LoadingScreen label="Accessing Command Center..." />;
  }

  return (
    <div className="selection:bg-primary/30 animate-fade-in-up flex w-full flex-col gap-6 pb-20">
      {/* SMTP Configuration Warning */}
      {!user?.smtpConfig?.appPassword && (
        <div className="bg-amber-500/10 border-amber-500/20 flex flex-col items-center justify-between gap-4 rounded-2xl border p-4 backdrop-blur-md md:flex-row md:px-6">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/20 flex h-10 w-10 items-center justify-center rounded-full text-amber-500">
              <Icon name="warning" className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Email Integration Required</p>
              <p className="text-text-secondary text-xs">
                You haven't configured your Gmail App Password. Outreach emails will not be sent.
              </p>
            </div>
          </div>
          <Link
            to="/srm/settings"
            className="bg-amber-500 hover:bg-amber-600 w-full rounded-xl px-6 py-2.5 text-center text-xs font-black uppercase tracking-widest text-black transition-all md:w-auto"
          >
            Configure Now
          </Link>
        </div>
      )}
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-5">
          <IconAvatar variant="primary" size="md" className="shadow-lg">
            <Icon name="assignment_ind" className="text-2xl" />
          </IconAvatar>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              Personal Command Center
            </h1>
            <p className="text-text-secondary text-sm font-medium">
              Hello, {user?.name || 'SRM'} • Monitoring {assignedStudents.length} assigned learners
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/srm/settings"
            className="hover:bg-white/5 flex h-12 items-center gap-3 rounded-xl border border-white/5 px-5 text-sm font-bold tracking-wide text-white transition-all"
          >
            <Icon name="settings" className="text-xl text-gray-400" />
            SETTINGS
          </Link>
          <Badge
            variant="primary"
            size="lg"
            className="flex h-12 items-center justify-center px-6 tracking-[0.2em]"
          >
            ACTIVE ASSIGNMENTS: {assignedStudents.length}
          </Badge>
        </div>
      </div>

      {/* Campaign Selection Tabs */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-8">
            {[
              { id: 'all', label: 'All Students', icon: 'groups' },
              { id: 'attendance', label: 'Attendance Focus', icon: 'person_off' },
              { id: 'assignment', label: 'Assignment Recovery', icon: 'assignment_late' },
              { id: 'high-risk', label: 'High Risk Leads', icon: 'auto_fix_high' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCampaign(tab.id as any);
                  setCurrentPage(1);
                  setSelectedIds([]);
                  // Auto-sort based on campaign (Initial preference)
                  if (tab.id === 'attendance')
                    setSortConfig({ key: 'attendance', direction: 'asc' });
                  else if (tab.id === 'assignment')
                    setSortConfig({ key: 'assignments', direction: 'asc' });
                  else if (tab.id === 'high-risk')
                    setSortConfig({ key: 'risk', direction: 'desc' });
                  else setSortConfig({ key: 'risk', direction: 'desc' });
                }}
                className={cn(
                  'group relative flex items-center gap-2 px-1 pb-4 transition-all duration-300',
                  activeCampaign === tab.id
                    ? 'text-primary font-black'
                    : 'text-text-secondary hover:text-white'
                )}
              >
                <Icon
                  name={tab.icon}
                  className={cn(
                    'text-xl',
                    activeCampaign === tab.id ? 'text-primary' : 'text-gray-500'
                  )}
                />
                <span className="text-xs tracking-widest uppercase">{tab.label}</span>
                {activeCampaign === tab.id && (
                  <div className="bg-primary animate-fade-in absolute right-0 bottom-0 left-0 h-0.5" />
                )}
              </button>
            ))}
          </div>
          <div className="text-text-secondary/50 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
            <Icon name="tips_and_updates" className="text-primary/40" />
            {activeCampaign === 'all'
              ? 'Select students to allocate'
              : `Campaign active: ${activeCampaign.replace('-', ' ')}`}
          </div>
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
        onAddClick={() => {}}
        showAddButton={false}
        hasActiveFilters={searchQuery !== '' || assignmentFilter !== 'Assignments' || progressFilter !== 'All Progress'}
        onClearFilters={() => {
          setSearchQuery('');
          setAssignmentFilter('Assignments');
          setProgressFilter('All Progress');
        }}
      />

        {/* Bulk Action Bar - Inline */}
      {(selectedIds.length > 0 || hasActiveFilters) && (
        <BulkActionBar
          selectedCount={selectedIds.length}
          onAssignSRM={handleBulkAssignToCampaign}
          onSendEmail={handleBulkEmail}
          onExport={handleExport}
          onClearSelection={() => setSelectedIds([])}
          isVisible={selectedIds.length > 0 || hasActiveFilters}
          showAssignSRM={false}
        />
      )}

      {/* Main Table Content */}
      <div className="bg-surface-dark/20 relative overflow-visible rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
        <StudentTable
          students={currentStudents}
          totalFilteredCount={finalFilteredStudents.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onToggleAssignment={() => {}}
          // onViewDetails is removed to hide the eye button
          onToggleBlock={() => {}}
          onLogCall={(s) => setLoggingCallStudent(s as any)}
          onViewHistory={(s) => setViewingHistoryStudent(s as any)}
          onSendEmail={(s) => setEmailingStudents([s as any])}
          onDiscordKick={(s) => {
            setDiscordActionStudent(s as any);
            setDiscordActionType('kick');
          }}
          onDiscordBan={(s) => {
            setDiscordActionStudent(s as any);
            setDiscordActionType('ban');
          }}
          onSort={handleSort}
          sortConfig={sortConfig}
          showSrmColumn={false}
          showSelection={activeCampaign === 'all'}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      {/* Modals */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEmail={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />

      <LogCallModal
        student={loggingCallStudent}
        isOpen={!!loggingCallStudent}
        onClose={() => setLoggingCallStudent(null)}
        onLog={handleLogCall}
        isPending={logCallMutation.isPending}
      />

      <CallHistoryModal
        student={viewingHistoryStudent}
        isOpen={!!viewingHistoryStudent}
        onClose={() => setViewingHistoryStudent(null)}
      />

      <OutreachEmailModal
        students={emailingStudents}
        isOpen={emailingStudents.length > 0}
        onClose={() => setEmailingStudents([])}
        onSend={handleSendEmail}
      />

      <DiscordActionModal
        student={discordActionStudent}
        isOpen={!!discordActionStudent}
        type={discordActionType}
        onClose={() => {
          setDiscordActionStudent(null);
          setDiscordActionType(null);
        }}
        onConfirm={handleDiscordModeration}
      />
    </div>
  );
};

export default SrmDashboard;
