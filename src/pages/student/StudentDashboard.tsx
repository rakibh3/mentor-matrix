import React, { useState, useMemo } from 'react';
import { BackgroundGlow, Card, CardContent, IconAvatar, Progress } from '@/components/ui';


import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

import { Icon } from '@/constants';
import type { User } from '@/types/auth';
import { getUserDisplayName } from '@/utils/userUtils';
import { useStudentAttendance } from '@/api/hooks/attendance';
import { StudentHeader } from './StudentHeader';
import { AttendanceForm } from './AttendanceForm';
import { AttendanceTable } from './AttendanceTable';
import { TaskSlider } from './TaskSlider';
import { useCurrentTask, useUpcomingTask } from '@/api/hooks/tasks';
import { useDueTasks } from '@/api/hooks/tasks/useDueTasks';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [isLoaded] = useState(true);
  console.log("Std Dashboard", user)

  // Use the new useStudentAttendance hook
  const { data: attendanceResponse, isLoading: isAttendanceLoading } = useStudentAttendance();

  // Fetch tasks for the slider
  const { data: currentTasksData, isLoading: isCurrentTaskLoading } = useCurrentTask();
  const { data: upcomingTasksData, isLoading: isUpcomingTaskLoading } = useUpcomingTask();
  const { data: dueTasksData, isLoading: isDueTaskLoading } = useDueTasks();

  const yesterdayTasks = Array.isArray(dueTasksData?.data)
    ? dueTasksData.data
    : (dueTasksData?.data ? [dueTasksData.data] : []);

  const todayTasks = Array.isArray(currentTasksData?.data) 
    ? currentTasksData.data 
    : (currentTasksData?.data ? [currentTasksData.data] : []);
    
  const tomorrowTasks = Array.isArray(upcomingTasksData?.data)
    ? upcomingTasksData.data
    : (upcomingTasksData?.data ? [upcomingTasksData.data] : []);

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
      present = rawHistory.filter(r => r.status === 'ATTENDED' || r.status === 'Present').length;
      missed = rawHistory.filter(r => r.status === 'ABSENT' || r.status === 'Absent').length;
      const total = present + missed;
      completion = total > 0 ? Math.round((present / total) * 100) : 0;
    }
    
    // Transform to AttendanceRecord format expected by AttendanceTable
    const history = rawHistory.map(record => ({
      date: record.date ? new Date(record.date).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) : '',
      module: record.module !== undefined ? `Module ${record.module}` : 'N/A',
      topic: `Mission ${record.mission || 0}, Video ${record.moduleVideo || 0}`,
      status: ((record.status === 'ATTENDED' || record.status === 'Present') ? 'Present' : 'Absent') as 'Present' | 'Absent',
      note: record.note
    }));
    
    return { attendanceHistory: history, presentDays: present, missedDays: missed, completionPercentage: completion };
  }, [attendanceResponse]);

  const wasYesterdayAbsent = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    
    const hasYesterdayTask = yesterdayTasks.length > 0;
    const yesterdayRecord = attendanceHistory.find(record => record.date === yesterdayStr);
    
    // Absent if explicitly marked OR if there was a task but no record found
    return (yesterdayRecord?.status === 'Absent') || (hasYesterdayTask && !yesterdayRecord);
  }, [attendanceHistory, yesterdayTasks]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-dark">
        <LoadingSpinner size="md" fullHeight={false} />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col bg-background-dark text-white overflow-hidden font-display selection:bg-primary/30">
      <StudentHeader user={user} onLogout={onLogout} />

      {/* Main Content - Full Width */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-10 lg:px-12 flex flex-col items-center scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
        <div className="w-full flex flex-col gap-4 md:gap-6">
          
          <div className={`transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Student Dashboard</h1>
            <p className="text-text-secondary text-sm md:text-lg font-medium mt-3 opacity-60">
              Checking in for <span className="text-primary">{getUserDisplayName(user)}</span>. You're doing great!
            </p>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className={`lg:col-span-8 rounded-[2rem] md:rounded-[3rem] border-white/5 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group shadow-2xl ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <CardContent className="p-8 md:p-12 relative z-10 flex flex-col gap-8 md:gap-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Bootcamp Completion</h3>
                    <p className="text-text-secondary text-sm font-medium max-w-sm leading-relaxed opacity-70">
                      Track your progress through the curriculum. You've reached <span className="text-primary font-bold">{completionPercentage}%</span> mission!
                    </p>
                  </div>
                  <div className="relative group/percent">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover/percent:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 text-primary text-5xl md:text-7xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">{completionPercentage}%</span>
                  </div>
                </div>
                <div className="relative group/progress">
                  <div className="absolute inset-0 -m-2 bg-primary/5 blur-xl rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity duration-500" />
                  <Progress 
                    value={isLoaded ? completionPercentage : 0} 
                    className="h-8 p-1.5 border-white/5 bg-white/[0.03] rounded-2xl overflow-hidden" 
                    indicatorClassName="shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] duration-[2s] ease-out rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <Card className={`rounded-[2rem] border-white/5 bg-white/[0.02] backdrop-blur-xl hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden shadow-xl ${isLoaded ? 'animate-fade-in-up animate-delay-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8 flex items-center gap-6 relative z-10">
                  <IconAvatar 
                    variant="primary" 
                    size="lg" 
                    bordered={false} 
                    className="shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                  >
                    <Icon name="calendar_today" className="text-3xl" />
                  </IconAvatar>
                  <div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">
                      Present Days
                    </p>
                    <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{presentDays.toString().padStart(2, '0')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className={`rounded-[2rem] border-white/5 bg-white/[0.02] backdrop-blur-xl hover:border-red-500/30 hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden shadow-xl ${isLoaded ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8 flex items-center gap-6 relative z-10">
                  <IconAvatar 
                    variant="danger" 
                    size="lg" 
                    bordered={false} 
                    className="shadow-[0_0_20px_rgba(239,68,68,0.2)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500"
                  >
                    <Icon name="event_busy" className="text-3xl" />
                  </IconAvatar>
                  <div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1 group-hover:text-red-400 transition-colors">
                      Missed Days
                    </p>
                    <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{missedDays.toString().padStart(2, '0')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 flex flex-col items-stretch">
              <AttendanceForm userId={user.id || ''} isLoaded={isLoaded} className="flex-1" />
            </div>
            
            <div className={`lg:col-span-4 flex flex-col items-stretch ${isLoaded ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}>
              <Card className="w-full flex-1 rounded-[2rem] md:rounded-[3rem] border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl relative overflow-hidden group/task">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover/task:opacity-100 transition-opacity duration-700" />
                <CardContent className="p-8 md:p-14 flex flex-col h-full relative z-10 w-full overflow-hidden">
                  <div className="mb-6 md:mb-10">
                    <IconAvatar variant="inverted" size="md" bordered={false} className="size-14 md:size-20 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] bg-white/5 border border-white/10 group-hover/task:rotate-[15deg] group-hover/task:scale-110 transition-all duration-700">
                      <Icon name="rocket_launch" className="text-2xl md:text-4xl text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                    </IconAvatar>
                  </div>
                  
                  <div className="flex-1 w-full flex flex-col">
                    <div className="flex flex-col gap-2 mb-6">
                      <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Mission</h3>
                      <p className="text-xs md:text-sm text-text-secondary font-medium opacity-50 leading-relaxed uppercase tracking-widest">Your focus for {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
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
