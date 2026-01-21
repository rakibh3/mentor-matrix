import React, { useState } from 'react';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
    <Card className="rounded-3xl border-card-border/50 shadow-2xl overflow-hidden flex flex-col group isolate">
      <TableContainer>
        <Table className="text-left min-w-[1300px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                {onSort && sortConfig ? (
                  <Button variant="ghost" onClick={onSort} className="group/sort flex items-center gap-2 hover:text-primary h-auto p-0 hover:bg-transparent">
                    <span>Student & Risk</span>
                    <div className="flex flex-col -gap-1 opacity-40 group-hover/sort:opacity-100 transition-opacity">
                      <Icon name="arrow_drop_up" className={`text-base leading-none ${sortConfig.direction === 'asc' ? 'text-primary' : ''}`} />
                      <Icon name="arrow_drop_down" className={`text-base leading-none -mt-2 ${sortConfig.direction === 'desc' ? 'text-primary' : ''}`} />
                    </div>
                  </Button>
                ) : (
                  "Student & Risk"
                )}
              </TableHead>
              <TableHead>Contact Details</TableHead>
              <TableHead>Submissions (A1-A8)</TableHead>
              <TableHead>Recent Attendance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Quick Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s, idx) => {
               // Use the specified ID field, falling back to id or email if not found/specified (though idField default is 'id')
               const identifier = s[idField] || s.id || s.email; 

               return (
              <TableRow key={idx} className={s.isBlocked ? 'opacity-40 grayscale-[0.5]' : ''}>
                {/* Student & Risk Column */}
                <TableCell>
                  <div className="flex items-center gap-5 cursor-pointer" onClick={() => onViewDetails(s)}>
                    <Avatar className={`size-12 rounded-lg border-2 transition-all ${
                      s.risk === 'High' ? 'border-red-500/20' : 
                      s.risk === 'Medium' ? 'border-amber-500/20' :
                      'border-card-border/60 group-hover:border-primary'
                    }`}>
                      <AvatarFallback className={`rounded-lg font-black ${
                        s.risk === 'High' ? 'bg-red-500/10 text-red-500' : 
                        s.risk === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-background-dark/40 text-text-secondary group-hover:text-primary'
                      }`}>
                        {s.name[0]}
                      </AvatarFallback>
                    </Avatar>
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
                </TableCell>

                {/* Contact Details Column */}
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { val: s.email, icon: 'mail', color: 'text-white' },
                      { val: s.phone || 'No phone', icon: 'call', color: 'text-text-secondary' },
                      { val: s.discord ? `@${s.discord.split('#')[0]}` : 'No Discord', icon: 'forum', color: 'text-primary font-bold' }
                    ].map((item, i) => (
                      <Button 
                        key={i} 
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); handleCopy(item.val); }}
                        className="flex items-center gap-2.5 px-2 py-0.5 rounded-lg h-auto text-left group/item relative w-fit max-w-full normal-case tracking-normal"
                      >
                        <Icon name={item.icon} className={`text-[14px] ${activeCopiedText === item.val ? 'text-primary' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium truncate ${item.color}`}>
                          {item.val}
                        </span>
                      </Button>
                    ))}
                  </div>
                </TableCell>

                {/* Submissions Column */}
                <TableCell>
                  <div className="p-1.5 rounded-xl bg-background-dark/30 border border-card-border/40 w-fit">
                    <div className="grid grid-cols-4 gap-2">
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
                            className={`size-7 rounded-lg text-xs border relative overflow-hidden p-0 ${
                              isSubmitted ? 'bg-primary text-background-dark border-primary shadow-[0_0_12px_rgba(19,236,106,0.25)] hover:bg-primary hover:text-background-dark' : 'border-card-border/60 bg-background-dark/20 text-gray-600 hover:text-white hover:border-white/30 hover:bg-background-dark/20'
                            }`}
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
                </TableCell>

                {/* Status Column */}
                <TableCell>
                  {s.isBlocked ? (
                    <Badge variant="danger" className="rounded-lg">
                      Blocked
                    </Badge>
                  ) : (
                    <Badge 
                      variant={s.status === 'Active' ? 'primary' : s.status === 'Probation' ? 'warning' : 'default'}
                      className="rounded-lg"
                    >
                      {s.status}
                    </Badge>
                  )}
                </TableCell>

                {/* Actions Column */}
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2.5">
                    {/* Block Icon Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="icon"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); onToggleBlock(identifier); }} 
                          className={`size-11 rounded-lg border ${
                            s.isBlocked 
                            ? 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:bg-red-500/10' 
                            : 'border-card-border bg-background-dark/30 hover:text-red-500 hover:border-red-500/30'
                          }`}
                        >
                          <Icon name={s.isBlocked ? "lock_open" : "block"} className="text-lg" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{s.isBlocked ? "Unblock Student" : "Block Student"}</TooltipContent>
                    </Tooltip>

                    {/* Log Call Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="icon"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); onLogCall(s); }} 
                          className="size-11 rounded-lg border border-card-border bg-background-dark/30 hover:text-primary hover:border-primary/50 group/log"
                        >
                          <Icon name="add_call" className="text-lg" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Log Call</TooltipContent>
                    </Tooltip>

                    {/* History Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="icon"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); onViewHistory(s); }}
                          className="size-11 rounded-lg border border-card-border bg-background-dark/30 hover:text-amber-500 hover:border-amber-500/50" 
                        >
                          <Icon name="history" className="text-xl" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Call History</TooltipContent>
                    </Tooltip>

                    {/* View Details Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="icon"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); onViewDetails(s); }}
                          className="size-11 rounded-lg bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 hover:border-primary/40" 
                        >
                          <Icon name="visibility" className="text-xl" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View Full Profile</TooltipContent>
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
