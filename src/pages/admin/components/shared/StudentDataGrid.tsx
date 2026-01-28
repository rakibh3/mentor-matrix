import React, { useState } from 'react';
import { Icon } from '@/constants';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, Badge, Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';





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
    <TooltipProvider>
    <Card className="rounded-3xl border-card-border/50 bg-card-dark/40 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col group isolate relative ring-1 ring-white/5">
      {/* Decorative Top Highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      
      <TableContainer className="scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
        <Table className="text-left min-w-[950px] border-separate border-spacing-0">
          <TableHeader className="bg-gradient-to-b from-white/[0.03] to-transparent">
            <TableRow className="hover:bg-transparent border-b border-white/5">
              <TableHead className="py-5">
                {onSort && sortConfig ? (
                  <Button variant="ghost" onClick={onSort} className="group/sort flex items-center gap-2 hover:text-primary h-auto p-0 hover:bg-transparent transition-all active:scale-95">
                    <span className="tracking-widest">Student & Risk</span>
                    <div className="flex flex-col -gap-1 opacity-40 group-hover/sort:opacity-100 transition-opacity">
                      <Icon name="arrow_drop_up" className={`text-base leading-none ${sortConfig.direction === 'asc' ? 'text-primary' : ''}`} />
                      <Icon name="arrow_drop_down" className={`text-base leading-none -mt-2 ${sortConfig.direction === 'desc' ? 'text-primary' : ''}`} />
                    </div>
                  </Button>
                ) : (
                  <span className="tracking-widest">Student & Risk</span>
                )}
              </TableHead>
              <TableHead className="py-5 tracking-widest">Contact Details</TableHead>
              <TableHead className="py-5 tracking-widest">Assignments</TableHead>
              <TableHead className="py-5 tracking-widest">Attendance</TableHead>
              <TableHead className="py-5 tracking-widest">Status</TableHead>
              <TableHead className="text-right py-5 tracking-widest">Quick Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s, idx) => {
               // Use the specified ID field, falling back to id or email if not found/specified (though idField default is 'id')
               const identifier = s[idField] || s.id || s.email; 

               return (
              <TableRow 
                key={idx} 
                className={cn(
                  s.isBlocked ? 'opacity-40 grayscale-[0.5]' : '',
                  idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]',
                  'hover:bg-white/[0.04] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] transition-all duration-300 group/row'
                )}
              >
                {/* Student & Risk Column */}
                <TableCell className="relative overflow-hidden">
                  {/* Active Indicator Line */}
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary scale-y-0 group-hover/row:scale-y-100 transition-transform duration-300 origin-center rounded-full" />
                  
                  <div className="flex items-center gap-2 cursor-pointer group/student" onClick={() => onViewDetails(s)}>
                    <Avatar className={`size-10 rounded-xl border-2 transition-all duration-500 shadow-lg ${
                      s.risk === 'High' ? 'border-red-500/40 shadow-red-500/5' : 
                      s.risk === 'Medium' ? 'border-amber-500/40 shadow-amber-500/5' :
                      'border-white/10 group-hover/student:border-primary shadow-primary/5'
                    }`}>
                      <AvatarFallback className={`rounded-lg font-black text-sm transition-all duration-300 ${
                        s.risk === 'High' ? 'bg-red-500/20 text-red-400' : 
                        s.risk === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-background-dark/60 text-text-secondary group-hover/student:text-primary group-hover/student:bg-primary/5'
                      }`}>
                        {s.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-white text-sm font-bold tracking-tight transition-colors group-hover/student:text-primary flex items-center gap-1.5">
                        {s.name}
                        {s.isBlocked && <Icon name="lock" className="text-red-500 text-[10px] animate-pulse" />}
                      </p>
                      <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-opacity duration-300 ${
                        s.risk === 'High' ? 'text-red-400' : 
                        s.risk === 'Medium' ? 'text-amber-400' : 
                        'text-gray-500 group-hover/row:text-gray-400'
                      }`}>
                        {s.risk || 'Low'}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Contact Details Column */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {[
                      { val: s.email, icon: 'mail', color: 'text-white/90' },
                      { val: s.phone || 'No phone', icon: 'call', color: 'text-text-secondary/80' },
                      { val: s.discord ? `@${s.discord.split('#')[0]}` : 'No Discord', icon: 'forum', color: 'text-primary/90 font-bold' }
                    ].map((item, i) => (
                      <Button 
                        key={i} 
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); handleCopy(item.val); }}
                        className="flex items-center gap-2 px-1.5 py-0.5 rounded-md h-auto text-left group/item relative w-fit max-w-full hover:bg-white/[0.08] transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <Icon name={item.icon} className={`text-[12px] transition-colors ${activeCopiedText === item.val ? 'text-primary' : 'text-gray-500 group-hover/item:text-gray-300'}`} />
                        <span className={`text-[12px] font-medium truncate transition-colors ${item.color} group-hover/item:text-white`}>
                          {item.val}
                        </span>
                      </Button>
                    ))}
                  </div>
                </TableCell>

                {/* Submissions Column */}
                <TableCell>
                  <div className="p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] w-fit shadow-inner">
                    <div className="grid grid-cols-4 gap-1.5">
                      {['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'].map((a) => {
                        const isSubmitted = s.completedAssignments?.includes(a);
                        return (
                          <Button 
                            key={a} 
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleAssignment(identifier, a);
                            }} 
                            className={cn(
                              "h-7 w-8 rounded-md text-xs font-bold border relative overflow-hidden p-0 transition-all duration-300 hover:scale-110 active:scale-90",
                              isSubmitted 
                                ? 'bg-primary text-background-dark border-primary/50 shadow-[0_0_15px_rgba(19,236,106,0.3)] hover:shadow-primary/50' 
                                : 'border-white/10 bg-white/5 text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/10'
                            )}
                          >
                            {a}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </TableCell>

                {/* Recent Attendance Column */}
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 px-0.5">
                      {s.recentAttendance?.map((record: { present: boolean; date: string }, idx: number) => (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <div 
                              className={cn(
                                "size-3 rounded-full transition-all duration-300 hover:scale-150 cursor-help shadow-sm",
                                record.present ? 'bg-primary' : 'bg-red-500'
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-[10px] font-bold py-1 px-2">
                            {record.date} • {record.present ? 'Attended' : 'Missed'}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500/70 flex items-center gap-1.5 px-1 group-hover/row:text-primary/50 transition-colors">
                      <Icon name="monitoring" className="text-[10px]" />
                      Attendance Metric
                    </p>
                  </div>
                </TableCell>

                {/* Status Column */}
                <TableCell>
                  {s.isBlocked ? (
                    <Badge variant="danger" className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 text-[10px] px-2.5 py-1 font-black tracking-wider shadow-lg shadow-red-500/5 animate-pulse">
                      BLOCKED
                    </Badge>
                  ) : (
                    <Badge 
                      variant={s.status === 'Active' ? 'primary' : s.status === 'Probation' ? 'warning' : 'default'}
                      className={cn(
                        "rounded-lg text-[10px] px-2.5 py-1 border select-none transition-all duration-300 font-black tracking-wider shadow-lg",
                        s.status === 'Active' ? 'border-primary/40 bg-primary/10 text-primary shadow-primary/5' : 
                        s.status === 'Probation' ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 shadow-amber-500/5' :
                        'border-white/10 bg-white/5 text-gray-400'
                      )}
                    >
                      {s.status.toUpperCase()}
                    </Badge>
                  )}
                </TableCell>

                {/* Actions Column */}
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-1.5">
                    {/* Block Icon Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="icon"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); onToggleBlock(identifier); }} 
                          className={cn(
                            "size-9 rounded-xl border transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg",
                            s.isBlocked 
                            ? 'border-red-500 bg-red-500 text-white shadow-red-500/30 hover:bg-red-600' 
                            : 'border-white/10 bg-white/5 text-gray-400 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/5 hover:shadow-red-500/10'
                          )}
                        >
                          <Icon name={s.isBlocked ? "lock_open" : "block"} className="text-base" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{s.isBlocked ? "Unblock Access" : "Restrict Access"}</TooltipContent>
                    </Tooltip>

                    {/* Log Call Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="icon"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); onLogCall(s); }} 
                          className="size-9 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-primary hover:border-primary/40 hover:bg-primary/10 hover:scale-110 active:scale-90 hover:shadow-primary/20 transition-all duration-300"
                        >
                          <Icon name="add_call" className="text-base" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Log Contact</TooltipContent>
                    </Tooltip>

                    {/* History Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="icon"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); onViewHistory(s); }}
                          className="size-9 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-amber-500 hover:border-amber-500/40 hover:bg-amber-500/10 hover:scale-110 active:scale-90 hover:shadow-amber-500/20 transition-all duration-300" 
                        >
                          <Icon name="history" className="text-lg" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Review History</TooltipContent>
                    </Tooltip>

                    {/* View Details Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="icon"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); onViewDetails(s); }}
                          className="size-9 rounded-xl bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 hover:border-primary/60 hover:scale-110 active:scale-90 shadow-xl shadow-primary/10 transition-all duration-300" 
                        >
                          <Icon name="visibility" className="text-lg" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Full Profile</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      
      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        footerText={`${onSort ? 'Monitoring' : 'Managing'} ${totalFilteredCount} ${onSort ? 'Students' : 'Total Students'} • Page ${currentPage}/${totalPages || 1}`}
      />
    </Card>
    </TooltipProvider>
  );
};
