import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, CustomSelect } from '@/constants';
import { useToast } from '@/context/ToastContext';
import { fetchAttendance } from '@/services/api';

interface StudentDashboardProps {
  user: { email: string };
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onLogout }) => {
  const { addToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [isLoaded] = useState(true);
  const [selectedModule, setSelectedModule] = useState('Module 4: React Patterns');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for attendance inputs
  const [videoNumber, setVideoNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // Data Fetching
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: attendanceHistory = [], isLoading } = useQuery<any[]>({
    queryKey: ['attendance'],
    queryFn: fetchAttendance,
  });

  const totalPages = Math.ceil(attendanceHistory.length / rowsPerPage);
  
  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return attendanceHistory.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, attendanceHistory]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleClear = () => {
    setVideoNumber('');
    setVerificationCode('');
    setSelectedModule('Module 4: React Patterns');
  };

  const handleMarkAttendance = () => {
    if (!videoNumber || !verificationCode) {
      addToast({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please provide both the video number and the session verification code.'
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API verification
    setTimeout(() => {
      setIsSubmitting(false);
      addToast({
        type: 'success',
        title: 'Attendance Recorded',
        message: `Successfully checked in for ${selectedModule}, Video #${videoNumber}.`
      });
      handleClear();
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-dark">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col bg-background-dark text-white overflow-hidden font-display selection:bg-primary/30">
      {/* Header */}
      <header className="flex-shrink-0 z-[60] flex items-center justify-between border-b border-card-border bg-background-dark/95 backdrop-blur-md px-4 py-3 md:px-10 md:py-4">
        <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:rotate-12">
            <Icon name="school" className="text-2xl md:text-3xl" />
          </div>
          <h2 className="text-base md:text-xl font-black leading-tight tracking-tight">DevCamp Portal</h2>
        </div>
        <div className="flex flex-1 justify-end gap-3 md:gap-6 items-center">
          <div className="hidden md:flex relative text-text-secondary focus-within:text-primary transition-colors">
            <Icon name="search" className="absolute left-3 top-2.5 text-xl" />
            <input  
              className="h-10 rounded-full bg-card-dark border border-card-border pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white w-48 lg:w-64 transition-all focus:w-80" 
              placeholder="Search history..." 
              type="text"
            />
          </div>
          <button 
            onClick={onLogout} 
            className="flex items-center justify-center text-white hover:text-primary transition-all p-2 rounded-full hover:bg-white/5 active:scale-90"
          >
            <Icon name="logout" className="text-xl md:text-2xl" />
          </button>
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 md:size-10 border-2 border-primary/20 shrink-0 shadow-lg" 
            style={{backgroundImage: 'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100")'}}
          ></div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-10 lg:px-12 flex flex-col items-center scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
        <div className="w-full flex flex-col gap-10">
          
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">Student Dashboard</h1>
            <p className="text-text-secondary text-sm md:text-base font-medium mt-1">Checking in for Alex Johnson. You're doing great!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={`lg:col-span-8 p-8 rounded-3xl bg-card-dark border border-card-border shadow-xl relative overflow-hidden group ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-black text-white mb-2 uppercase">Bootcamp Completion</h3>
                    <p className="text-text-secondary text-sm font-semibold max-w-xs">You have completed 45% of the curriculum. Next assessment in 3 days.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-primary text-6xl font-black tracking-tighter">45%</span>
                  </div>
                </div>
                <div className="h-6 w-full rounded-full bg-background-dark/50 overflow-hidden border border-card-border/50 p-1.5">
                  <div 
                    className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(19,236,106,0.3)] transition-all duration-[2s] ease-out" 
                    style={{ width: isLoaded ? '45%' : '0%' }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className={`rounded-2xl bg-card-dark border border-card-border p-6 flex items-center gap-5 group hover:border-primary/40 transition-all shadow-lg ${isLoaded ? 'animate-fade-in-up animate-delay-100' : 'opacity-0'}`}>
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Icon name="calendar_today" className="text-3xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Present Days</p>
                  <p className="text-3xl font-black text-white tracking-tight">42</p>
                </div>
              </div>
              <div className={`rounded-2xl bg-card-dark border border-card-border p-6 flex items-center gap-5 group hover:border-red-500/40 transition-all shadow-lg ${isLoaded ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
                <div className="size-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <Icon name="event_busy" className="text-3xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Missed Days</p>
                  <p className="text-3xl font-black text-white tracking-tight">03</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Today's Task / Quick Attendance Section */}
            <div className={`lg:col-span-8 flex flex-col rounded-[2.5rem] bg-card-dark border border-card-border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative group/attendance h-full ${isLoaded ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'}`}>
              <div className="p-12 relative flex flex-col h-full">
                {/* Badge and Floating Guideline Text */}
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                    <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#13ec6a]"></div>
                    Today's Session
                  </div>
                  <div className="text-right max-w-[240px]">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Today's Guideline</p>
                    <p className="text-sm text-text-secondary font-medium leading-relaxed opacity-80 group-hover/attendance:opacity-100 transition-opacity">
                      "Focus on completing the lifecycle hooks practice assignment today."
                    </p>
                  </div>
                </div>
                
                <h3 className="text-white text-4xl font-black tracking-tight uppercase mb-12">Quick Attendance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                  {/* Video Number Field - Row 1 Left */}
                  <div className="flex flex-col gap-4 group/field">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-focus-within/field:text-primary transition-colors">Video Number</span>
                    <input  
                      value={videoNumber}
                      onChange={(e) => setVideoNumber(e.target.value)}
                      className="w-full rounded-2xl bg-background-dark/40 border border-card-border px-6 py-5 text-sm font-bold text-white focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-gray-700" 
                      placeholder="e.g. 12"
                      type="number"
                    />
                  </div>
                  
                  {/* Verification Code Field - Row 1 Right */}
                  <div className="flex flex-col gap-4 group/field">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-focus-within/field:text-primary transition-colors">Verification Code</span>
                    <input 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full rounded-2xl bg-background-dark/40 border border-card-border px-6 py-5 text-sm font-bold text-white focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-gray-700" 
                      placeholder="Enter session code"
                    />
                  </div>

                  {/* Active Module Field - Row 2 Full Width Span */}
                  <div className="md:col-span-2 flex flex-col gap-4 group/field">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-focus-within/field:text-primary transition-colors">Active Module</span>
                    <CustomSelect  
                      value={selectedModule}
                      options={["Module 4: React Patterns", "Module 5: Backend & API"]}
                      onChange={setSelectedModule}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <button 
                    disabled={isSubmitting}
                    onClick={handleMarkAttendance}
                    className="flex-[3] flex items-center justify-center gap-4 rounded-[1.5rem] bg-primary hover:bg-primary-hover text-background-dark text-xl font-black py-6 transition-all shadow-[0_15px_35px_rgba(19,236,106,0.25)] active:scale-[0.98] group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="size-8 border-4 border-background-dark border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Icon name="how_to_reg" className="text-3xl group-hover/btn:scale-110 transition-transform" />
                        Mark Attendance
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleClear}
                    className="flex-1 flex items-center justify-center gap-3 rounded-[1.5rem] border border-card-border bg-transparent text-text-secondary text-base font-black uppercase tracking-[0.2em] py-6 hover:bg-white/5 hover:text-white transition-all active:scale-[0.98] group/btn"
                  >
                    <Icon name="refresh" className="text-2xl group-hover/btn:rotate-180 transition-transform duration-500" />
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Task / Next Milestone */}
            <div className={`lg:col-span-4 rounded-[2.5rem] bg-card-dark border border-card-border p-12 flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] h-full relative group/task ${isLoaded ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}>
              <div className="size-24 rounded-3xl bg-white flex items-center justify-center text-background-dark shadow-2xl mb-10 group-hover/task:rotate-[15deg] transition-transform duration-500">
                <Icon name="rocket_launch" className="text-5xl" />
              </div>
              
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Next Milestone</h3>
              <p className="text-text-secondary text-base font-medium mb-12 opacity-70">Module 5 starts tomorrow at 09:00 AM</p>
              
              <div className="flex flex-col gap-6 pt-10 border-t border-dashed border-card-border/50 flex-1 justify-center">
                <div className="flex justify-between items-center group/stat">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] group-hover/stat:text-primary transition-colors">Module</span>
                  <span className="text-base font-bold text-white">Module 5</span>
                </div>
                <div className="flex justify-between items-center group/stat">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] group-hover/stat:text-primary transition-colors">Video</span>
                  <span className="text-base font-bold text-white">Video 01-05</span>
                </div>
                <div className="flex justify-between items-center group/stat">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] group-hover/stat:text-primary transition-colors">Status</span>
                  <span className="text-base font-bold text-primary">Unlocks in 14h</span>
                </div>
                
                <div className="mt-6 space-y-3 p-6 rounded-3xl bg-background-dark/40 border border-card-border/30">
                   <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Guideline</span>
                   <p className="text-sm text-text-secondary leading-relaxed font-medium">
                     "Prep for REST API concepts before the morning session."
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex flex-col rounded-3xl bg-card-dark border border-card-border shadow-2xl overflow-hidden mb-20 ${isLoaded ? 'animate-fade-in-up animate-delay-500' : 'opacity-0'}`}>
            <div className="flex items-center justify-between p-10 border-b border-card-border bg-card-dark/60">
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="history" className="text-3xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Attendance Log</h3>
                  <p className="text-text-secondary text-xs font-bold uppercase tracking-widest mt-1">Full history of your sessions</p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-text-secondary text-xs font-black uppercase tracking-widest">Active Sync</span>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(19,236,106,1)]"></div>
                </div>
                <span className="text-gray-600 text-xs font-bold uppercase tracking-tighter">Showing {currentData.length} of {attendanceHistory.length} records</span>
              </div>
            </div>
            
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-background-dark/30 text-gray-500 text-sm font-black uppercase tracking-[0.3em] border-b border-card-border/50">
                    <th className="px-12 py-8">Session Date</th>
                    <th className="px-12 py-8">Curriculum Module</th>
                    <th className="px-12 py-8">Topic Covered</th>
                    <th className="px-12 py-8 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/30 text-sm text-white">
                  {currentData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-12 py-7">
                        <span className="text-gray-100 font-black tracking-tight group-hover:text-primary transition-colors">{row.date}</span>
                      </td>
                      <td className="px-12 py-7 text-gray-400 group-hover:text-gray-200 transition-colors">{row.module}</td>
                      <td className="px-12 py-7">
                        <div className="flex items-center gap-3 text-gray-500 group-hover:text-gray-300">
                          <Icon name="play_circle" className="text-lg opacity-40 group-hover:text-primary transition-colors" />
                          {row.topic}
                        </div>
                      </td>
                      <td className="px-12 py-7">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-black uppercase tracking-[0.2em] border transition-all duration-300 ${row.status === 'Present' ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_4px_15px_rgba(19,236,106,0.05)]' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            <Icon name={row.status === 'Present' ? 'check_circle' : 'cancel'} className="text-[16px]" /> 
                            {row.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-12 py-10 border-t border-card-border bg-card-dark/30 flex flex-col sm:flex-row items-center justify-between gap-8">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all border active:scale-95 ${currentPage === 1 ? 'text-gray-800 border-gray-800/30 cursor-not-allowed' : 'text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/40'}`}
              >
                <Icon name="arrow_back_ios" className="text-sm" /> Previous
              </button>
              
              <div className="flex items-center gap-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black transition-all active:scale-90 border-2 ${currentPage === p ? 'bg-primary text-background-dark border-primary shadow-lg scale-110 z-10' : 'text-text-secondary bg-background-dark/40 border-card-border hover:bg-white/5 hover:text-white'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all border active:scale-95 ${currentPage === totalPages ? 'text-gray-800 border-gray-800/30 cursor-not-allowed' : 'text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/40'}`}
              >
                Next <Icon name="arrow_forward_ios" className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed -bottom-64 -right-64 size-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed top-20 -left-64 size-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
    </div>
  );
};

export default StudentDashboard;