import React, { useState } from 'react';
import { Icon } from '@/constants';

import { Pagination } from '@/components/shared/Pagination';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { cn } from '@/lib/utils';

export interface StudentDataGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  students: any[]; // Using any[] to be compatible with both existing types for now, ideally strictly typed later
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleAssignment: (studentIdOrEmail: string, assignment: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewDetails?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditClick?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteClick?: (student: any) => void;
  onToggleBlock?: (studentIdOrEmail: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLogCall: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewHistory: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSendEmail?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDiscordAction?: (student: any, type: 'kick' | 'ban') => void;

  // Sorting props (optional)
  onSort?: (key: string) => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' | null };

  // Copy utility
  // Copy utility
  onCopy?: (text: string) => void;
  copiedText?: string | null;

  // Identifier Override
  idField?: string;

  // Selection
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  showSelection?: boolean;
  showSrmColumn?: boolean;
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
  onSendEmail,
  onDiscordAction,
  onSort,
  sortConfig,
  onCopy,
  copiedText: externalCopiedText,
  idField = 'id',
  selectedIds = [],
  onSelectionChange,
  showSelection = true,
  showSrmColumn = true,
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
      <Card className="border-card-border/50 bg-card-dark/40 group relative isolate flex flex-col overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/5 backdrop-blur-md">
        {/* Decorative Top Highlight */}
        <div className="pointer-events-none absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <TableContainer className="scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
          <Table className="min-w-[950px] border-separate border-spacing-0 text-left">
            <TableHeader className="bg-gradient-to-b from-white/[0.03] to-transparent">
              <TableRow className="border-b border-white/5 hover:bg-transparent">
                {showSelection && (
                  <TableHead className="w-12 py-5 pl-6">
                    <input
                      type="checkbox"
                      className="text-primary focus:ring-primary/20 size-4 rounded border-white/20 bg-white/5"
                      checked={
                        students.length > 0 &&
                        students.every((s) => selectedIds.includes(s[idField] || s.id || s.email))
                      }
                      onChange={(e) => {
                        if (onSelectionChange) {
                          const pageIds = students.map((s) => s[idField] || s.id || s.email);
                          if (e.target.checked) {
                            const newSelection = [...new Set([...selectedIds, ...pageIds])];
                            onSelectionChange(newSelection);
                          } else {
                            const newSelection = selectedIds.filter((id) => !pageIds.includes(id));
                            onSelectionChange(newSelection);
                          }
                        }
                      }}
                    />
                  </TableHead>
                )}
                <TableHead className="py-5">
                  {onSort && sortConfig ? (
                      <Button
                        variant="ghost"
                        onClick={() => onSort('risk')}
                      className="group/sort hover:text-primary flex h-auto items-center gap-2 p-0 transition-all hover:bg-transparent active:scale-95"
                    >
                      <span className="tracking-widest">Student & Risk</span>
                      <div className="-gap-1 flex flex-col opacity-40 transition-opacity group-hover/sort:opacity-100">
                        <Icon
                          name="arrow_drop_up"
                          className={`text-base leading-none ${sortConfig.direction === 'asc' ? 'text-primary' : ''}`}
                        />
                        <Icon
                          name="arrow_drop_down"
                          className={`-mt-2 text-base leading-none ${sortConfig.direction === 'desc' ? 'text-primary' : ''}`}
                        />
                      </div>
                    </Button>
                  ) : (
                    <span className="tracking-widest">Student & Risk</span>
                  )}
                </TableHead>
                <TableHead className="py-5 tracking-widest">Contact Details</TableHead>
                {showSrmColumn && <TableHead className="py-5 tracking-widest">Assigned To</TableHead>}
                <TableHead className="py-5 tracking-widest">Assignments</TableHead>
                <TableHead className="py-5 tracking-widest">Attendance</TableHead>
                <TableHead className="py-5 tracking-widest">Status</TableHead>
                <TableHead className="py-5 text-right tracking-widest">Quick Action</TableHead>
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
                      'group/row transition-all duration-300 hover:bg-white/[0.04] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]'
                    )}
                  >
                    {/* Selection Column */}
                    {showSelection && (
                      <TableCell className="py-5 pl-6">
                        <input
                          type="checkbox"
                          className="text-primary focus:ring-primary/20 size-4 rounded border-white/20 bg-white/5"
                          checked={selectedIds.includes(identifier)}
                          onChange={(e) => {
                            if (onSelectionChange) {
                              if (e.target.checked) {
                                onSelectionChange([...selectedIds, identifier]);
                              } else {
                                onSelectionChange(selectedIds.filter((id) => id !== identifier));
                              }
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    {/* Student & Risk Column */}
                    <TableCell className="relative overflow-hidden">
                      {/* Active Indicator Line */}
                      <div className="bg-primary absolute top-2 bottom-2 left-0 w-0.5 origin-center scale-y-0 rounded-full transition-transform duration-300 group-hover/row:scale-y-100" />

                      <div
                        className="group/student flex cursor-pointer items-center gap-2"
                        onClick={() => onViewDetails?.(s)}
                      >
                        <Avatar
                          className={`size-10 rounded-xl border-2 shadow-lg transition-all duration-500 ${
                            s.risk === 'High'
                              ? 'border-red-500/40 shadow-red-500/5'
                              : s.risk === 'Medium'
                                ? 'border-amber-500/40 shadow-amber-500/5'
                                : 'group-hover/student:border-primary shadow-primary/5 border-white/10'
                          }`}
                        >
                          <AvatarFallback
                            className={`rounded-lg text-sm font-black transition-all duration-300 ${
                              s.risk === 'High'
                                ? 'bg-red-500/20 text-red-400'
                                : s.risk === 'Medium'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-background-dark/60 text-text-secondary group-hover/student:text-primary group-hover/student:bg-primary/5'
                            }`}
                          >
                            {(s.name || 'U')[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="group-hover/student:text-primary flex items-center gap-1.5 text-sm font-bold tracking-tight text-white transition-colors">
                            {s.name}
                            {s.isBlocked && (
                              <Icon
                                name="lock"
                                className="animate-pulse text-[10px] text-red-500"
                              />
                            )}
                          </p>
                          <span
                            className={`text-[10px] font-black tracking-[0.15em] uppercase transition-opacity duration-300 ${
                              s.risk === 'High'
                                ? 'text-red-400'
                                : s.risk === 'Medium'
                                  ? 'text-amber-400'
                                  : 'text-gray-500 group-hover/row:text-gray-400'
                            }`}
                          >
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
                          {
                            val: s.phone || 'No phone',
                            icon: 'call',
                            color: 'text-text-secondary/80',
                          },
                          {
                            val: s.discord ? `@${s.discord.split('#')[0]}` : 'No Discord',
                            icon: 'forum',
                            color: 'text-primary/90 font-bold',
                          },
                        ].map((item, i) => (
                          <Button
                            key={i}
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.val);
                            }}
                            className="group/item relative flex h-auto w-fit max-w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-left transition-all hover:scale-[1.02] hover:bg-white/[0.08] active:scale-95"
                          >
                            <Icon
                              name={item.icon}
                              className={`text-[12px] transition-colors ${activeCopiedText === item.val ? 'text-primary' : 'text-gray-500 group-hover/item:text-gray-300'}`}
                            />
                            <span
                              className={`truncate text-[12px] font-medium transition-colors ${item.color} group-hover/item:text-white`}
                            >
                              {item.val}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </TableCell>

                    {/* Assigned To Column */}
                    {showSrmColumn && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {s.assignedSrmId ? (
                            <>
                              <Icon
                                name="person"
                                className="text-primary text-sm"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">
                                  {typeof s.assignedSrmId === 'object' && s.assignedSrmId?.name
                                    ? s.assignedSrmId.name
                                    : 'SRM'}
                                </span>
                                {typeof s.assignedSrmId === 'object' && s.assignedSrmId?.email && (
                                  <span className="text-[10px] text-text-secondary/70">
                                    {s.assignedSrmId.email}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Icon
                                name="person_off"
                                className="text-gray-500 text-sm"
                              />
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unassigned
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    )}

                    {/* Submissions Column */}
                    <TableCell>
                      <div className="w-fit rounded-xl border border-white/[0.05] bg-white/[0.03] p-1.5 shadow-inner">
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
                                  'relative h-7 w-8 overflow-hidden rounded-md border p-0 text-xs font-bold transition-all duration-300 hover:scale-110 active:scale-90',
                                  isSubmitted
                                    ? 'bg-primary text-background-dark border-primary/50 hover:shadow-primary/50 shadow-[0_0_15px_rgba(19,236,106,0.3)]'
                                    : 'border-white/10 bg-white/5 text-gray-500 hover:border-white/30 hover:bg-white/10 hover:text-white'
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
                          {s.recentAttendance?.map(
                            (
                              record: {
                                present: boolean;
                                date: string;
                                module?: number | string;
                                moduleVideo?: number;
                                note?: string;
                              },
                              idx: number
                            ) => (
                              <Tooltip key={idx}>
                                <TooltipTrigger asChild>
                                  <div
                                    className={cn(
                                      'size-3 cursor-help rounded-full shadow-sm transition-all duration-300 hover:scale-150',
                                      record.present ? 'bg-primary' : 'bg-red-500'
                                    )}
                                  />
                                </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="flex flex-col gap-1 px-3 py-2 text-[10px] font-bold"
                                  >
                                    <div className="flex items-center justify-between gap-4">
                                      <span className="text-gray-400 uppercase">Session</span>
                                      <span>{record.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                      <span className="text-gray-400 uppercase">Status</span>
                                      <span className={record.present ? 'text-primary' : 'text-red-400'}>
                                        {record.present ? 'Attended' : 'Missed'}
                                      </span>
                                    </div>
                                    {record.module !== undefined && (
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="text-gray-400 uppercase">Module</span>
                                        <span>
                                          {record.module} (V-{record.moduleVideo || 0})
                                        </span>
                                      </div>
                                    )}
                                    {record.note && (
                                      <div className="mt-1 max-w-[150px] border-t border-white/10 pt-1">
                                        <p className="line-clamp-2 text-[9px] font-medium italic text-gray-300">
                                          "{record.note}"
                                        </p>
                                      </div>
                                    )}
                                  </TooltipContent>
                              </Tooltip>
                            )
                          )}
                        </div>
                        <p className="group-hover/row:text-primary/50 flex items-center gap-1.5 px-1 text-[9px] font-black tracking-[0.2em] text-gray-500/70 uppercase transition-colors">
                          <Icon name="monitoring" className="text-[10px]" />
                          Attendance Metric
                        </p>
                      </div>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      {s.isBlocked ? (
                        <Badge
                          variant="danger"
                          className="animate-pulse rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-[10px] font-black tracking-wider text-red-400 shadow-lg shadow-red-500/5"
                        >
                          BLOCKED
                        </Badge>
                      ) : (
                        <Badge
                          variant={
                            s.status === 'Active'
                              ? 'primary'
                              : s.status === 'Probation'
                                ? 'warning'
                                : 'default'
                          }
                          className={cn(
                            'rounded-lg border px-2.5 py-1 text-[10px] font-black tracking-wider shadow-lg transition-all duration-300 select-none',
                            s.status === 'Active'
                              ? 'border-primary/40 bg-primary/10 text-primary shadow-primary/5'
                              : s.status === 'Probation'
                                ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 shadow-amber-500/5'
                                : 'border-white/10 bg-white/5 text-gray-400'
                          )}
                        >
                          {(s.status || 'Active').toUpperCase()}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Block Icon Button */}
                        {onToggleBlock && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="icon"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleBlock(identifier);
                                }}
                                className={cn(
                                  'size-9 rounded-xl border shadow-lg transition-all duration-300 hover:scale-110 active:scale-90',
                                  s.isBlocked
                                    ? 'border-red-500 bg-red-500 text-white shadow-red-500/30 hover:bg-red-600'
                                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-500 hover:shadow-red-500/10'
                                )}
                              >
                                <Icon
                                  name={s.isBlocked ? 'lock_open' : 'block'}
                                  className="text-base"
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {s.isBlocked ? 'Unblock Access' : 'Restrict Access'}
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* Log Call Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="icon"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onLogCall(s);
                              }}
                              className="hover:text-primary hover:border-primary/40 hover:bg-primary/10 hover:shadow-primary/20 size-9 rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:scale-110 active:scale-90"
                            >
                              <Icon name="add_call" className="text-base" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Log Contact</TooltipContent>
                        </Tooltip>

                        {/* Email Button */}
                        {onSendEmail && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="icon"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSendEmail(s);
                                }}
                                className="hover:text-primary hover:border-primary/40 hover:bg-primary/10 hover:shadow-primary/20 size-9 rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:scale-110 active:scale-90"
                              >
                                <Icon name="mail" className="text-base" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send Email</TooltipContent>
                          </Tooltip>
                        )}

                        {/* Discord Action Button */}
                        {onDiscordAction && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="icon"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDiscordAction(s, 'kick');
                                }}
                                className="hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-red-500/20 size-9 rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:scale-110 active:scale-90"
                              >
                                <Icon name="gavel" className="text-base" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Discord Action</TooltipContent>
                          </Tooltip>
                        )}

                        {/* History Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="icon"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewHistory(s);
                              }}
                              className={cn(
                                "size-9 rounded-xl border transition-all duration-300 hover:scale-110 active:scale-90",
                                (() => {
                                  const hasCallToday = s.callHistory && s.callHistory.some((c: any) => c.isToday);
                                  
                                  if (hasCallToday) {
                                    return "border-primary bg-primary/20 text-primary hover:bg-primary/30";
                                  }

                                  if (!s.callHistory || s.callHistory.length === 0) {
                                    return "border-white/10 bg-white/5 text-gray-400 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-500 hover:shadow-amber-500/20";
                                  }
                                  
                                  const lastCall = s.callHistory[0]; // Assuming sorted newest first
                                  
                                  if (lastCall.outcome === 'Received') {
                                    return "border-green-500/40 bg-green-500/10 text-green-500 shadow-green-500/20 hover:bg-green-500/20 hover:shadow-green-500/30";
                                  }
                                  
                                  if (['Not Received', 'Busy', 'Wrong Number'].includes(lastCall.outcome)) {
                                    return "border-red-500/40 bg-red-500/10 text-red-500 shadow-red-500/20 hover:bg-red-500/20 hover:shadow-red-500/30";
                                  }
                                  
                                  if (lastCall.outcome === 'Foreign Number') {
                                    return "border-amber-500/40 bg-amber-500/10 text-amber-500 shadow-amber-500/20 hover:bg-amber-500/20 hover:shadow-amber-500/30";
                                  }
                                  
                                  if (lastCall.outcome === 'Discord Action') {
                                    return "border-blue-500/40 bg-blue-500/10 text-blue-500 shadow-blue-500/20 hover:bg-blue-500/20 hover:shadow-blue-500/30";
                                  }
                                  
                                  return "border-white/10 bg-white/5 text-gray-400 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-500 hover:shadow-amber-500/20";
                                })()
                              )}
                            >
                              <Icon name="history" className="text-lg" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex flex-col gap-1">
                              {s.callHistory && s.callHistory.some((c: any) => c.isToday) && (
                                <span className="text-primary font-black text-[10px] tracking-widest uppercase mb-1">Contacted Today</span>
                              )}
                              <span>
                                {s.callHistory && s.callHistory.length > 0 
                                  ? `Last Call: ${s.callHistory[0].outcome} (${s.callHistory[0].date})` 
                                  : 'No Call History'}
                              </span>
                            </div>
                          </TooltipContent>
                        </Tooltip>

                        {/* View Details Button */}
                        {onViewDetails && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="icon"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewDetails(s);
                                }}
                                className="bg-primary/20 text-primary border-primary/40 hover:bg-primary/30 hover:border-primary/60 shadow-primary/10 size-9 rounded-xl border shadow-xl transition-all duration-300 hover:scale-110 active:scale-90"
                              >
                                <Icon name="visibility" className="text-lg" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Full Profile</TooltipContent>
                          </Tooltip>
                        )}
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
