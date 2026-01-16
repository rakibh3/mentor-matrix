import React, { useState } from 'react';
import { Icon } from '@/constants';
import { Pagination } from '@/components/shared/Pagination';

export interface StudentDataGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  students: any[]; // Using any[] to be compatible with both existing types for now, ideally strictly typed later
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleAssignment: (studentIdOrEmail: string, assignment: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewDetails: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditClick?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteClick?: (student: any) => void;
  onToggleBlock: (studentIdOrEmail: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLogCall: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewHistory: (student: any) => void;
  
  // Sorting props (optional)
  onSort?: () => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' | null };
  
  // Copy utility
  // Copy utility
  onCopy?: (text: string) => void;
  copiedText?: string | null;
  
  // Identifier Override
  idField?: string;
}

export const StudentDataGrid: React.FC<StudentDataGridProps> = ({
  students,
  totalFilteredCount,
  currentPage,
  totalPages,
  onPageChange,
  onToggleAssignment,
  onViewDetails,
  // onEditClick and onDeleteClick intentionally unused - kept for API compatibility
  onToggleBlock,
  onLogCall,
  onViewHistory,
  onSort,
  sortConfig,
  onCopy,
  copiedText: externalCopiedText,
  idField = 'id'
}) => {
  const [internalCopiedText, setInternalCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    if (onCopy) {
      onCopy(text);
    } else {
      navigator.clipboard.writeText(text);
      setInternalCopiedText(text);
      setTimeout(() => setInternalCopiedText(null), 2000);
    }
  };

  const activeCopiedText = externalCopiedText || internalCopiedText;

  return (
    <div className="rounded-3xl border border-card-border/50 bg-card-dark shadow-2xl overflow-hidden flex flex-col group isolate">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
        <table className="w-full text-left min-w-[1300px]">
          <thead className="bg-surface-dark/90 text-gray-400 text-sm font-black uppercase tracking-[0.3em] border-b border-card-border/50">
            <tr>
              <th className="px-8 py-6">
                {onSort && sortConfig ? (
                  <button onClick={onSort} className="group/sort flex items-center gap-2 hover:text-primary transition-colors focus:outline-none">
                    <span>Student & Risk</span>
                    <div className="flex flex-col -gap-1 opacity-40 group-hover/sort:opacity-100 transition-opacity">
                      <Icon name="arrow_drop_up" className={`text-base leading-none ${sortConfig.direction === 'asc' ? 'text-primary' : ''}`} />
                      <Icon name="arrow_drop_down" className={`text-base leading-none -mt-2 ${sortConfig.direction === 'desc' ? 'text-primary' : ''}`} />
                    </div>
                  </button>
                ) : (
                  "Student & Risk"
                )}
              </th>
              <th className="px-8 py-6">Contact Details</th>
              <th className="px-8 py-6">Submissions (A1-A8)</th>
              <th className="px-8 py-6">Recent Attendance</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/10">
            {students.map((s, idx) => {
               // Use the specified ID field, falling back to id or email if not found/specified (though idField default is 'id')
               const identifier = s[idField] || s.id || s.email; 

               return (
              <tr key={idx} className={`hover:bg-white/[0.01] transition-colors group ${s.isBlocked ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                {/* Student & Risk Column */}
                <td className="px-8 py-7">
                  <div className="flex items-center gap-5 cursor-pointer" onClick={() => onViewDetails(s)}>
                    <div className={`size-12 rounded-lg flex items-center justify-center font-black border-2 transition-all ${
                      s.risk === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      s.risk === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-background-dark/40 border-card-border/60 text-text-secondary group-hover:border-primary group-hover:text-primary'
                    }`}>
                      {s.name[0]}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white text-base font-black tracking-tight transition-colors flex items-center gap-2">
                        {s.name}
                        {s.isBlocked && <Icon name="lock" className="text-red-500 text-xs" />}
                      </p>
                      <span className={`text-xs font-black uppercase tracking-[0.15em] ${
                        s.risk === 'High' ? 'text-red-400' : 
                        s.risk === 'Medium' ? 'text-amber-400' : 
                        'text-gray-600'
                      }`}>
                        {s.risk || 'Low'} Priority
                      </span>
                    </div>
                  </div>
                </td>

                {/* Contact Details Column */}
                <td className="px-8 py-7">
                  <div className="flex flex-col gap-1.5">
                    {[
                      { val: s.email, icon: 'mail', color: 'text-white' },
                      { val: s.phone || 'No phone', icon: 'call', color: 'text-text-secondary' },
                      { val: s.discord ? `@${s.discord.split('#')[0]}` : 'No Discord', icon: 'forum', color: 'text-primary font-bold' }
                    ].map((item, i) => (
                      <button 
                        key={i} 
                        onClick={(e) => { e.stopPropagation(); handleCopy(item.val); }}
                        className="flex items-center gap-2.5 px-2 py-0.5 rounded-lg hover:bg-white/5 transition-all text-left group/item relative w-fit max-w-full"
                      >
                        <Icon name={item.icon} className={`text-[14px] ${activeCopiedText === item.val ? 'text-primary' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium truncate ${item.color}`}>
                          {item.val}
                        </span>
                      </button>
                    ))}
                  </div>
                </td>

                {/* Submissions Column */}
                <td className="px-8 py-7">
                  <div className="p-1.5 rounded-xl bg-background-dark/30 border border-card-border/40 w-fit">
                    <div className="grid grid-cols-4 gap-2">
                      {['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'].map((a) => {
                        const isSubmitted = s.completedAssignments?.includes(a);
                        return (
                          <button 
                            key={a} 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleAssignment(identifier, a);
                            }} 
                            className={`size-7 rounded-lg flex items-center justify-center text-xs font-black uppercase transition-all active:scale-90 border relative overflow-hidden ${
                              isSubmitted ? 'bg-primary text-background-dark border-primary shadow-[0_0_12px_rgba(19,236,106,0.25)]' : 'border-card-border/60 bg-background-dark/20 text-gray-600 hover:text-white hover:border-white/30'
                            }`}
                          >
                            {a}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </td>

                {/* Recent Attendance Column */}
                <td className="px-8 py-7">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1.5">
                      {(s.recentAttendance || [true, true, true, true, true, true]).map((present: boolean, idx: number) => (
                        <div 
                          key={idx} 
                          className={`size-5 rounded-md border border-white/5 transition-all duration-300 ${
                            present 
                              ? 'bg-primary shadow-[0_0_10px_rgba(19,236,106,0.15)]' 
                              : 'bg-red-500/10 border-red-500/20'
                          }`}
                        >
                          <div className={`size-full flex items-center justify-center ${present ? 'opacity-100' : 'opacity-0'}`}>
                            <Icon name="check" className="text-[10px] text-background-dark font-black" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-600 flex items-center gap-2">
                      <Icon name="history" className="text-xs" />
                      Last 6 Sessions
                    </p>
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-8 py-7">
                  {s.isBlocked ? (
                    <span className="inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-xs font-black uppercase tracking-widest border border-red-500/20 bg-red-500/5 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                      Blocked
                    </span>
                  ) : (
                    <span className={`inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-xs font-black uppercase tracking-widest border transition-all ${
                      s.status === 'Active' ? 'bg-primary/5 text-primary border-primary/20 shadow-[0_0_10px_rgba(19,236,106,0.05)]' : 
                      s.status === 'Probation' ? 'bg-orange-500/5 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]' :
                      'bg-gray-500/5 text-gray-400 border-gray-500/20'
                    }`}>
                      {s.status}
                    </span>
                  )}
                </td>

                {/* Actions Column */}
                <td className="px-8 py-7 text-right">
                  <div className="flex justify-end items-center gap-2.5">
                    {/* Block Icon Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleBlock(identifier); }} 
                      className={`size-11 rounded-lg border flex items-center justify-center transition-all active:scale-90 ${
                        s.isBlocked 
                        ? 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                        : 'border-card-border bg-background-dark/30 text-gray-500 hover:text-red-500 hover:border-red-500/30'
                      }`}
                      title={s.isBlocked ? "Unblock Student" : "Block Student"}
                    >
                      <Icon name={s.isBlocked ? "lock_open" : "block"} className="text-lg" />
                    </button>

                    {/* Log Call Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onLogCall(s); }} 
                      className="size-11 rounded-lg border border-card-border bg-background-dark/30 text-gray-500 hover:text-primary hover:border-primary/50 transition-all active:scale-90 flex items-center justify-center group/log"
                      title="Log Call"
                    >
                      <Icon name="add_call" className="text-lg" />
                    </button>

                    {/* History Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewHistory(s); }}
                      className="size-11 rounded-lg border border-card-border bg-background-dark/30 text-gray-500 hover:text-amber-500 hover:border-amber-500/50 transition-all active:scale-90 flex items-center justify-center" 
                      title="Call History"
                    >
                      <Icon name="history" className="text-xl" />
                    </button>

                    {/* View Details Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewDetails(s); }}
                      className="size-11 rounded-lg bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all active:scale-90 flex items-center justify-center" 
                      title="View Full Profile"
                    >
                      <Icon name="visibility" className="text-xl" />
                    </button>
                    
                    {/* Extra Actions for Admin Student Table (Edit/Delete) if provided */}
                    {/* Note: Original Admin table didn't have specific Edit/Delete buttons in the row in the final screenshot/code I saw above? 
                        Wait, looking at StudentTable.tsx (lines 178-218), it only has Block, LogCall, History, ViewDetails. 
                        It DOES NOT have Edit/Delete in the row actions. 
                        However, the props `onEditClick` and `onDeleteClick` WERE defined in interface but NOT USED in the row render of StudentTable.tsx.
                        I will omit them from row actions to match StudentTable.tsx behavior, but keep them in interface if we want to add them later.
                    */}
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
      
      
      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        footerText={`${onSort ? 'Monitoring' : 'Managing'} ${totalFilteredCount} ${onSort ? 'Students' : 'Total Students'} • Page ${currentPage}/${totalPages || 1}`}
      />
    </div>
  );
};
