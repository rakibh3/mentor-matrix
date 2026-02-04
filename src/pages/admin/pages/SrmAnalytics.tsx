import React, { useMemo, useState } from 'react';
import { Icon } from '@/constants';
import { useQuery } from '@tanstack/react-query';

import { getAttendance } from '@/api/endpoints/attendance';
import { useSrmPerformance } from '@/api/hooks/analytics';
import { useLogCall } from '@/api/hooks/call-history';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { StudentDataGrid } from '@/components/shared/StudentDataGrid';
import { useToast } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { CallHistoryModal } from '@/pages/admin/components/modals/CallHistoryModal';
import { LogCallModal } from '@/pages/admin/components/modals/LogCallModal';
import { SrmStatCards } from '@/pages/admin/components/students/SrmStatCards';

interface SrmAnalyticsProps {
  srmId?: string;
  srmName?: string;
  onBack?: () => void;
}

const SrmAnalytics: React.FC<SrmAnalyticsProps> = ({ srmId, srmName, onBack }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Modal states
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isLogCallModalOpen, setIsLogCallModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Determine current SRM ID for API calls
  const currentSrmId = useMemo(() => {
    if (srmId) return srmId;
    if (user) return (user as any)._id;
    return null;
  }, [srmId, user]);

  const isRealSrmId = useMemo(() => /^[0-9a-fA-F]{24}$/.test(currentSrmId || ''), [currentSrmId]);

  // Use useSrmPerformance which now returns the full student list
  const { data: srmPerformanceData, isLoading: isSrmLoading } = useSrmPerformance(
    isRealSrmId ? currentSrmId || '' : ''
  );
  const logCallMutation = useLogCall();

  // We can fallback to getAttendance for calculations if needed, but the primary list comes from SrmPerformance
  const { data: attendanceResponse, isLoading: isAttendanceLoading } = useQuery({
    queryKey: ['attendance-list'],
    queryFn: getAttendance,
  });

  const isLoading = isSrmLoading || isAttendanceLoading;

  // Process data from SRM Performance API
  const srmAssignedStudents = useMemo(() => {
    // If we have specific students from the SRM performance endpoint, use them
    if (srmPerformanceData?.data?.students) {
      return srmPerformanceData.data.students.map((s: any) => {
        // Map API structure to StudentDataGrid structure
        const userInfo = s.userId || {};

        // Calculate recent attendance visualization
        const sortedAttendance = [...(s.recentAttendance || [])].sort(
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

        return {
          ...s,
          // Ensure we have a top-level ID
          _id: s.userId?._id || s._id,
          // Extract user info
          name: userInfo.name || 'Unknown',
          email: userInfo.email || '',
          phone: s.phone || userInfo.phone || '',
          discord: s.discordUsername || userInfo.discord || '',
          // Add mapped fields
          recentAttendance,
          rawAttendance: sortedAttendance,
          risk: s.riskLevel || 'Low',
          status: s.isBlocked ? 'Blocked' : s.riskLevel === 'High' ? 'Probation' : 'Active',
          callHistory: s.callHistory || [],
        };
      });
    }

    // Fallback to legacy filtering if stats endpoint doesn't return students
    const data = (attendanceResponse?.data as any) || [];
    let targetSrmId = srmId;
    if (!targetSrmId && user) {
      targetSrmId = (user as any)._id || (user as any).email;
    }

    if (!targetSrmId) return [];

    return data.filter((s: any) => {
      const assignedId = s.assignedSrmId?._id || s.assignedSrmId;
      return String(assignedId) === String(targetSrmId);
    });
  }, [srmPerformanceData, attendanceResponse, user, srmId]);

  const totalPages = Math.ceil(srmAssignedStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return srmAssignedStudents.slice(start, start + ITEMS_PER_PAGE);
  }, [srmAssignedStudents, currentPage]);

  const stats = useMemo(() => {
    const history = srmAssignedStudents.flatMap((s: any) => s.callHistory || []);
    const today = new Date().toISOString().split('T')[0];
    const todayCalls = history.filter((c: any) => c.date?.startsWith(today));

    return {
      toCall: srmAssignedStudents.filter((s: any) => s.status === 'Probation').length,
      received: todayCalls.filter((c: any) => c.outcome === 'Received').length,
      notReceived: todayCalls.filter((c: any) => c.outcome === 'Not Received').length,
      busy: todayCalls.filter((c: any) => c.outcome === 'Busy').length,
      totalToday: todayCalls.length,
    };
  }, [srmAssignedStudents]);

  // Compute stats
  const topStats = useMemo(() => {
    const performance = srmPerformanceData?.data;
    if (performance && performance.totalCalls !== undefined) {
      return [
        {
          label: 'Total Calls',
          value: performance.totalCalls,
          icon: 'call',
          trend: 'All Time',
          color: 'primary',
        },
        {
          label: 'Calls Today',
          value: performance.callsToday,
          icon: 'call_received',
          trend: 'Performance',
          color: 'success',
        },
        {
          label: 'Assigned Students',
          value: performance.assignedStudents,
          icon: 'groups',
          trend: 'Portfolio',
          color: 'primary',
        },
        {
          label: 'This Week',
          value: performance.callsThisWeek,
          icon: 'date_range',
          trend: 'Activity',
          color: 'primary',
        },
      ];
    }

    // Fallback calculation
    const totalAssigned = srmAssignedStudents.length;
    const highRiskCount = srmAssignedStudents.filter(
      (s: any) => (s.riskLevel || s.risk) === 'High'
    ).length;
    const avgProgress =
      totalAssigned > 0
        ? Math.round(
            srmAssignedStudents.reduce((acc: number, s: any) => acc + (s.progress || 0), 0) /
              totalAssigned
          )
        : 0;

    return [
      {
        label: 'To Call Today',
        value: stats.toCall,
        icon: 'call',
        trend: 'Priority',
        color: 'primary',
      },
      {
        label: 'Received Today',
        value: stats.received,
        icon: 'call_received',
        trend: 'Performance',
        color: 'success',
      },
      {
        label: 'High Risk Leads',
        value: highRiskCount,
        icon: 'warning',
        trend: 'Action Needed',
        color: highRiskCount > 0 ? 'red-500' : 'primary',
      },
      {
        label: 'Avg Progress',
        value: `${avgProgress}%`,
        icon: 'auto_graph',
        trend: 'Portfolio',
        color: 'primary',
      },
    ];
  }, [srmAssignedStudents, stats, srmPerformanceData]);

  const lastSessionStats = useMemo(() => {
    let lastDateStr = '';
    let lastDateTs = 0;

    // Find the very last recorded attendance date across everyone
    srmAssignedStudents.forEach((s: any) => {
      const attendances = s.rawAttendance || [];
      const latest = attendances[0]; // Since we sorted them in mapping

      if (latest && latest.date) {
        const d = new Date(latest.date).getTime();
        if (d > lastDateTs) {
          lastDateTs = d;
          lastDateStr = latest.date;
        }
      }
    });

    if (!lastDateStr) return { date: 'N/A', present: 0, absent: 0, total: 0 };

    // Format date for display
    const dateObj = new Date(lastDateStr);
    const dateDisplay = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const targetDay = dateObj.toISOString().split('T')[0];

    let present = 0;
    let absent = 0;

    srmAssignedStudents.forEach((s: any) => {
      // Skip blocked students from stats
      if (s.isBlocked) return;

      const attendances = s.rawAttendance || [];
      const record = attendances.find((a: any) => a.date?.startsWith(targetDay));

      if (record) {
        if (record.status === 'ATTENDED' || record.status === 'Present') present++;
        else absent++;
      } else {
        // If active but no record for the latest global session, count as absent
        absent++;
      }
    });

    return { date: dateDisplay, present, absent, total: present + absent };
  }, [srmAssignedStudents]);

  const handleLogCall = (student: any) => {
    setSelectedStudent(student);
    setIsLogCallModalOpen(true);
  };

  const handleViewHistory = (student: any) => {
    setSelectedStudent(student);
    setIsHistoryModalOpen(true);
  };

  if (isLoading) {
    return <LoadingScreen label="Analyzing Portfolio..." />;
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-8 pr-2 pb-20">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="-ml-2 rounded-full p-2 text-white transition-colors hover:bg-white/10"
                title="Back to Dashboard"
              >
                <Icon name="arrow_back" className="text-2xl" />
              </button>
            )}
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white uppercase">
                {srmId ? (srmName ? `SRM: ${srmName}` : `SRM Analysis: ${srmId}`) : 'Personal Analytics'}
              </h2>
              <p className="text-text-secondary text-base">
                Performance overview and student tracking
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SrmStatCards stats={topStats} />
        </div>
      </div>

      {/* Student Performance Distribution */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Daily Attendance Snapshot */}
        <div className="bg-surface-dark group relative overflow-hidden rounded-3xl border border-white/5 p-6">
          <div className="bg-primary/5 group-hover:bg-primary/10 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl transition-colors duration-500" />

          <h3 className="relative z-10 mb-4 flex items-center gap-2 text-lg font-black tracking-tight text-white uppercase">
            <Icon name="event_available" className="text-primary" />
            Last Session ({lastSessionStats.date})
          </h3>

          <div className="relative z-10 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 p-3">
                <span className="text-3xl font-black text-white">{lastSessionStats.present}</span>
                <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">
                  Present
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 p-3">
                <span className="text-text-secondary text-3xl font-black">
                  {lastSessionStats.absent}
                </span>
                <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">
                  Absent
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-text-secondary flex justify-between text-xs font-bold tracking-wider uppercase">
                <span>Attendance Rate</span>
                <span>
                  {lastSessionStats.total > 0
                    ? Math.round((lastSessionStats.present / lastSessionStats.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="from-primary h-full rounded-full bg-gradient-to-r to-emerald-400 transition-all duration-1000"
                  style={{
                    width: `${lastSessionStats.total > 0 ? (lastSessionStats.present / lastSessionStats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-surface-dark rounded-3xl border border-white/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-black tracking-tight text-white uppercase">
            <Icon name="donut_large" className="text-primary" />
            Status Overview
          </h3>
          <div className="flex flex-col gap-4">
            {['Active', 'Probation', 'Blocked'].map((status) => {
              const count = srmAssignedStudents.filter((s: any) =>
                status === 'Blocked' ? s.isBlocked : s.status === status
              ).length;
              const total = srmAssignedStudents.length || 1;
              const percentage = Math.round((count / total) * 100);
              const color =
                status === 'Active'
                  ? 'bg-primary'
                  : status === 'Probation'
                    ? 'bg-amber-500'
                    : 'bg-red-500';

              return (
                <div key={status} className="flex flex-col gap-1">
                  <div className="text-text-secondary flex justify-between text-xs font-bold tracking-wider uppercase">
                    <span>{status}</span>
                    <span>
                      {count} Students ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-surface-dark rounded-3xl border border-white/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-black tracking-tight text-white uppercase">
            <Icon name="warning" className="text-amber-500" />
            Risk Analysis
          </h3>
          <div className="flex flex-col gap-4">
            {['High', 'Medium', 'Low'].map((risk) => {
              const count = srmAssignedStudents.filter(
                (s: any) => (s.riskLevel || s.risk) === risk
              ).length;
              const total = srmAssignedStudents.length || 1;
              const percentage = Math.round((count / total) * 100);
              const color =
                risk === 'High' ? 'bg-red-500' : risk === 'Medium' ? 'bg-amber-500' : 'bg-primary';

              return (
                <div key={risk} className="flex flex-col gap-1">
                  <div className="text-text-secondary flex justify-between text-xs font-bold tracking-wider uppercase">
                    <span>{risk} Risk</span>
                    <span>
                      {count} Students ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Student List Section - Only shown when viewing specific SRM (Admin View) */}
      {srmId && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight text-white uppercase">
              Assigned Students
            </h3>
            <div className="text-text-secondary rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-black tracking-widest uppercase">
              Total: {srmAssignedStudents.length} Students
            </div>
          </div>

          <div className="flex flex-col">
            <StudentDataGrid
              students={paginatedStudents}
              totalFilteredCount={srmAssignedStudents.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onToggleAssignment={() => {}} // Read-only view mainly
              onViewDetails={() => {}}
              onToggleBlock={() => {}}
              onLogCall={handleLogCall}
              onViewHistory={handleViewHistory}
              showSelection={false}
              showSrmColumn={false}
              showViewDetails={false}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedStudent && (
        <>
          <LogCallModal
            isOpen={isLogCallModalOpen}
            onClose={() => {
              setIsLogCallModalOpen(false);
              setSelectedStudent(null);
            }}
            student={selectedStudent}
            isPending={logCallMutation.isPending}
            onLog={(outcome, note) => {
              // Get student ID - try multiple fields
              const studentId = selectedStudent._id || selectedStudent.userId?._id;

              if (!studentId) {
                addToast({
                  type: 'error',
                  title: 'Error',
                  message: 'Could not determine student ID for call logging.',
                });
                return;
              }

              logCallMutation.mutate(
                {
                  student: studentId,
                  calledBy: (user as any)?._id || (user as any)?.id,
                  outcome: outcome,
                  note: note,
                  callType: 'FOLLOW_UP',
                  status: outcome === 'Received' ? 'COMPLETED' : 'NO_ANSWER',
                } as any,
                {
                  onSuccess: () => {
                    addToast({
                      type: 'success',
                      title: 'Call Logged',
                      message: `Successfully logged ${outcome} call for ${selectedStudent.name}.`,
                    });
                    setIsLogCallModalOpen(false);
                    setSelectedStudent(null);
                  },
                  onError: (error: any) => {
                    addToast({
                      type: 'error',
                      title: 'Failed to Log Call',
                      message:
                        error.response?.data?.message ||
                        'Could not log the call. Please try again.',
                    });
                  },
                }
              );
            }}
          />
          <CallHistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => {
              setIsHistoryModalOpen(false);
              setSelectedStudent(null);
            }}
            student={selectedStudent}
          />
        </>
      )}
    </div>
  );
};

export default SrmAnalytics;
