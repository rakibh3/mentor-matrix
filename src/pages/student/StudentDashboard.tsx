/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import { Icon } from '@/constants';

import { useStudentAttendance } from '@/api/hooks/attendance';
import { useCurrentTask, useUpcomingTask } from '@/api/hooks/tasks';
import { useDueTasks } from '@/api/hooks/tasks/useDueTasks';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { BackgroundGlow, Card, CardContent, IconAvatar, Progress } from '@/components/ui';
import { getUserDisplayName } from '@/utils/userUtils';
import type { User } from '@/types/auth';

import { AttendanceForm } from './AttendanceForm';
import { AttendanceTable } from './AttendanceTable';
import { StudentHeader } from './StudentHeader';
import { TaskSlider } from './TaskSlider';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [isLoaded] = useState(true);
  console.log('Std Dashboard', user);

  // Use the new useStudentAttendance hook
  const { data: attendanceResponse, isLoading: isAttendanceLoading } = useStudentAttendance();

  // Fetch tasks for the slider
  const { data: currentTasksData, isLoading: isCurrentTaskLoading } = useCurrentTask();
  const { data: upcomingTasksData, isLoading: isUpcomingTaskLoading } = useUpcomingTask();
  const { data: dueTasksData, isLoading: isDueTaskLoading } = useDueTasks();

  const yesterdayTasks = useMemo(
    () =>
      Array.isArray(dueTasksData?.data)
        ? dueTasksData.data
        : dueTasksData?.data
          ? [dueTasksData.data]
          : [],
    [dueTasksData]
  );

  const todayTasks = Array.isArray(currentTasksData?.data)
    ? currentTasksData.data
    : currentTasksData?.data
      ? [currentTasksData.data]
      : [];

  const tomorrowTasks = Array.isArray(upcomingTasksData?.data)
    ? upcomingTasksData.data
    : upcomingTasksData?.data
      ? [upcomingTasksData.data]
      : [];

  const isTasksLoading = isCurrentTaskLoading || isUpcomingTaskLoading || isDueTaskLoading;
  const isLoading = isAttendanceLoading;

  const { attendanceHistory, presentDays, missedDays, completionPercentage } = useMemo(() => {
    if (!attendanceResponse || !attendanceResponse.success || !attendanceResponse.data) {
      return { attendanceHistory: [], presentDays: 0, missedDays: 0, completionPercentage: 0 };
    }

    const responseData = attendanceResponse.data;
    let rawHistory: any[] = [];
    let present = 0;
    let missed = 0;
    let completion = 0;

    // Handle student profile object structure
    if (responseData && typeof responseData === 'object' && 'attendance' in responseData) {
      rawHistory = (responseData as any).attendance;
      present = (responseData as any).totalPresent || 0;
      missed = (responseData as any).totalAbsent || 0;
      completion = (responseData as any).attendancePercentage || 0;
    }
    // Handle array structure as fallback
    else if (Array.isArray(responseData)) {
      rawHistory = responseData;
      present = rawHistory.filter((r) => r.status === 'ATTENDED' || r.status === 'Present').length;
      missed = rawHistory.filter((r) => r.status === 'ABSENT' || r.status === 'Absent').length;
      const total = present + missed;
      completion = total > 0 ? Math.round((present / total) * 100) : 0;
    }

    // Transform to AttendanceRecord format expected by AttendanceTable
    const history = rawHistory.map((record) => ({
      date: record.date
        ? new Date(record.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '',
      module: record.module !== undefined ? `Module ${record.module}` : 'N/A',
      topic: `Mission ${record.mission || 0}`,
      status: (record.status === 'ATTENDED' || record.status === 'Present'
        ? 'Present'
        : 'Absent') as 'Present' | 'Absent',
      note: record.note,
    }));

    return {
      attendanceHistory: history,
      presentDays: present,
      missedDays: missed,
      completionPercentage: completion,
    };
  }, [attendanceResponse]);

  const wasYesterdayAbsent = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const hasYesterdayTask = yesterdayTasks.length > 0;
    const yesterdayRecord = attendanceHistory.find((record) => record.date === yesterdayStr);

    // Absent if explicitly marked OR if there was a task but no record found
    return yesterdayRecord?.status === 'Absent' || (hasYesterdayTask && !yesterdayRecord);
  }, [attendanceHistory, yesterdayTasks]);

  if (isLoading) {
    return (
      <div className="bg-background-dark flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="md" fullHeight={false} />
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display selection:bg-primary/30 relative flex h-screen flex-col overflow-hidden text-white">
      <StudentHeader user={user} onLogout={onLogout} />

      {/* Main Content - Full Width */}
      <main className="scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent flex flex-1 flex-col items-center overflow-y-auto px-4 py-4 md:px-10 lg:px-12">
        <div className="flex w-full flex-col gap-4 md:gap-6">
          <div
            className={`transition-all delay-100 duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <h1 className="text-3xl leading-none font-black tracking-tighter text-white uppercase md:text-5xl">
              Student Dashboard
            </h1>
            <p className="text-text-secondary mt-3 text-sm font-medium opacity-60 md:text-lg">
              Checking in for <span className="text-primary">{getUserDisplayName(user)}</span>.
              You're doing great!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Card
              className={`group relative overflow-hidden rounded-[2rem] border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-xl md:rounded-[3rem] lg:col-span-8 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              <div className="from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <CardContent className="relative z-10 flex flex-col gap-8 p-8 md:gap-12 md:p-12">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight text-white uppercase md:text-2xl">
                      Bootcamp Completion
                    </h3>
                    <p className="text-text-secondary max-w-sm text-sm leading-relaxed font-medium opacity-70">
                      Track your progress through the curriculum. You've reached{' '}
                      <span className="text-primary font-bold">{completionPercentage}%</span>{' '}
                      mission!
                    </p>
                  </div>
                  <div className="group/percent relative">
                    <div className="bg-primary/20 absolute inset-0 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/percent:opacity-100" />
                    <span className="text-primary relative z-10 text-5xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] md:text-7xl">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
                <div className="group/progress relative">
                  <div className="bg-primary/5 absolute inset-0 -m-2 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover/progress:opacity-100" />
                  <Progress
                    value={isLoaded ? completionPercentage : 0}
                    className="h-8 overflow-hidden rounded-2xl border-white/5 bg-white/[0.03] p-1.5"
                    indicatorClassName="shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] duration-[2s] ease-out rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              <Card
                className={`hover:border-primary/30 group relative overflow-hidden rounded-[2rem] border-white/5 bg-white/[0.02] shadow-xl backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.04] ${isLoaded ? 'animate-fade-in-up animate-delay-100' : 'opacity-0'}`}
              >
                <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative z-10 flex items-center gap-6 p-8">
                  <IconAvatar
                    variant="primary"
                    size="lg"
                    bordered={false}
                    className="shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  >
                    <Icon name="calendar_today" className="text-3xl" />
                  </IconAvatar>
                  <div>
                    <p className="group-hover:text-primary mb-1 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase transition-colors">
                      Present Days
                    </p>
                    <p className="text-4xl font-black tracking-tighter text-white tabular-nums">
                      {presentDays.toString().padStart(2, '0')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`group relative overflow-hidden rounded-[2rem] border-white/5 bg-white/[0.02] shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-red-500/30 hover:bg-white/[0.04] ${isLoaded ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative z-10 flex items-center gap-6 p-8">
                  <IconAvatar
                    variant="danger"
                    size="lg"
                    bordered={false}
                    className="shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6"
                  >
                    <Icon name="event_busy" className="text-3xl" />
                  </IconAvatar>
                  <div>
                    <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase transition-colors group-hover:text-red-400">
                      Missed Days
                    </p>
                    <p className="text-4xl font-black tracking-tighter text-white tabular-nums">
                      {missedDays.toString().padStart(2, '0')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            <div className="flex flex-col items-stretch lg:col-span-8">
              <AttendanceForm userId={user._id || user.id || ''} isLoaded={isLoaded} className="flex-1" />
            </div>

            <div
              className={`flex flex-col items-stretch lg:col-span-4 ${isLoaded ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}
            >
              <Card className="group/task relative w-full flex-1 overflow-hidden rounded-[2rem] border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-xl md:rounded-[3rem]">
                <div className="from-primary/5 absolute inset-0 bg-gradient-to-b via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover/task:opacity-100" />
                <CardContent className="relative z-10 flex h-full w-full flex-col overflow-hidden p-8 md:p-14">
                  <div className="mb-6 md:mb-10">
                    <IconAvatar
                      variant="inverted"
                      size="md"
                      bordered={false}
                      className="size-14 border border-white/10 bg-white/5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover/task:scale-110 group-hover/task:rotate-[15deg] md:size-20"
                    >
                      <Icon
                        name="rocket_launch"
                        className="text-primary text-2xl drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] md:text-4xl"
                      />
                    </IconAvatar>
                  </div>

                  <div className="flex w-full flex-1 flex-col">
                    <div className="mb-6 flex flex-col gap-2">
                      <h3 className="text-2xl font-black tracking-tight text-white uppercase md:text-3xl">
                        Mission
                      </h3>
                      <p className="text-text-secondary text-xs leading-relaxed font-medium tracking-widest uppercase opacity-50 md:text-sm">
                        Your focus for{' '}
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>

                    <TaskSlider
                      yesterdayTasks={yesterdayTasks}
                      todayTasks={todayTasks}
                      tomorrowTasks={tomorrowTasks}
                      isLoading={isTasksLoading}
                      wasYesterdayAbsent={wasYesterdayAbsent}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <AttendanceTable attendanceHistory={attendanceHistory} isLoaded={isLoaded} />
        </div>
      </main>

      <BackgroundGlow fixed variant="primary" size="2xl" blur="2xl" position="bottom-right" />
      <BackgroundGlow fixed variant="primary" size="xl" blur="xl" position="top-left-fixed" />
    </div>
  );
};

export default StudentDashboard;
