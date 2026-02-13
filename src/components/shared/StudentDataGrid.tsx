import React, { useState } from 'react';
import { Icon } from '@/constants';

import { Pagination } from '@/components/shared/Pagination';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  onViewDetails: (student: any) => void;
  // View Details is the main action
  onToggleBlock: (userId: string, currentBlocked: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLogCall: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewHistory: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSendEmail?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDiscordKick?: (student: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDiscordBan?: (student: any) => void;

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

  // SRM Assignment
  srms?: { _id: string; name: string }[];
  onAssignSRM?: (studentId: string, srmId: string) => void;
  showSrmColumn?: boolean;
  showSelection?: boolean;
  showViewDetails?: boolean;
}

export const StudentDataGrid: React.FC<StudentDataGridProps> = ({
  students,
  totalFilteredCount,
  currentPage,
  totalPages,
  onPageChange,
  onToggleAssignment,
  onViewDetails,
  onToggleBlock,
  onLogCall,
  onViewHistory,
  onSendEmail,
  onDiscordKick,
  onDiscordBan,
  onSort,
  sortConfig,
  onCopy,
  copiedText: externalCopiedText,
  idField = '_id',
  selectedIds = [],
  onSelectionChange,
  srms = [],
  onAssignSRM,
  showSrmColumn = true,
  showSelection = true,
  showViewDetails = true,
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
      <Card className="border-card-border/50 bg-card-dark/40 group relative isolate flex h-auto flex-col overflow-visible rounded-3xl shadow-2xl ring-1 ring-white/5 backdrop-blur-md">
        {/* Decorative Top Highlight */}
        <div className="pointer-events-none absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <TableContainer className="scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
          <Table className="min-w-[950px] border-separate border-spacing-0 text-left">
            <TableHeader className="sticky top-[-1px] z-30 bg-[#0a0f0d] shadow-sm">
              <TableRow className="border-b border-white/5 hover:bg-transparent">
                {showSelection && (
                  <TableHead className="w-12 py-5">
                    <input
                      type="checkbox"
                      className="text-primary focus:ring-primary/20 size-4 rounded border-white/20 bg-white/5"
                      checked={
                        students.length > 0 &&
                        students.every((s) => selectedIds.includes(s[idField] || s._id || s.email))
                      }
                      onChange={(e) => {
                        if (onSelectionChange) {
                          const pageIds = students.map((s) => s[idField] || s._id || s.email);
                          if (e.target.checked) {
                            // Add only missing IDs from the current page
                            const newSelection = [...new Set([...selectedIds, ...pageIds])];
                            onSelectionChange(newSelection);
                          } else {
                            // Remove only IDs that are on the current page
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
                          className={`text-base leading-none ${sortConfig.key === 'risk' && sortConfig.direction === 'asc' ? 'text-primary' : ''}`}
                        />
                        <Icon
                          name="arrow_drop_down"
                          className={`-mt-2 text-base leading-none ${sortConfig.key === 'risk' && sortConfig.direction === 'desc' ? 'text-primary' : ''}`}
                        />
                      </div>
                    </Button>
                  ) : (
                    <span className="tracking-widest">Student & Risk</span>
                  )}
                </TableHead>
                <TableHead className="py-5 tracking-widest">Contact Details</TableHead>
                <TableHead className="py-5">
                  {onSort && sortConfig ? (
                    <Button
                      variant="ghost"
                      onClick={() => onSort('assignments')}
                      className="group/sort hover:text-primary mx-auto flex h-auto items-center gap-2 p-0 transition-all hover:bg-transparent active:scale-95"
                    >
                      <span className="tracking-widest capitalize">Assignments</span>
                      <div className="-gap-1 flex flex-col opacity-40 transition-opacity group-hover/sort:opacity-100">
                        <Icon
                          name="arrow_drop_up"
                          className={`text-base leading-none ${sortConfig.key === 'assignments' && sortConfig.direction === 'asc' ? 'text-primary' : ''}`}
                        />
                        <Icon
                          name="arrow_drop_down"
                          className={`-mt-2 text-base leading-none ${sortConfig.key === 'assignments' && sortConfig.direction === 'desc' ? 'text-primary' : ''}`}
                        />
                      </div>
                    </Button>
                  ) : (
                    <span className="block text-center tracking-widest">Assignments</span>
                  )}
                </TableHead>
                <TableHead className="py-5">
                  {onSort && sortConfig ? (
                    <Button
                      variant="ghost"
                      onClick={() => onSort('attendance')}
                      className="group/sort hover:text-primary mx-auto flex h-auto items-center gap-2 p-0 transition-all hover:bg-transparent active:scale-95"
                    >
                      <span className="tracking-widest capitalize">Attendance</span>
                      <div className="-gap-1 flex flex-col opacity-40 transition-opacity group-hover/sort:opacity-100">
                        <Icon
                          name="arrow_drop_up"
                          className={`text-base leading-none ${sortConfig.key === 'attendance' && sortConfig.direction === 'asc' ? 'text-primary' : ''}`}
                        />
                        <Icon
                          name="arrow_drop_down"
                          className={`-mt-2 text-base leading-none ${sortConfig.key === 'attendance' && sortConfig.direction === 'desc' ? 'text-primary' : ''}`}
                        />
                      </div>
                    </Button>
                  ) : (
                    <span className="block text-center tracking-widest">Attendance</span>
                  )}
                </TableHead>
                <TableHead className="py-5 text-center tracking-widest">Status</TableHead>
                {showSrmColumn && (
                  <TableHead className="py-5 text-center tracking-widest">Assigned SRM</TableHead>
                )}
                <TableHead className="py-5 text-right tracking-widest">Quick Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s, idx) => {
                // Use the specified ID field, falling back to _id or email if not found/specified (though idField default is '_id')
                const identifier = s[idField] || s._id || s.email;

                return (
                  <TableRow
                    key={idx}
                    className={cn(
                      s.isBlocked ? 'opacity-40 grayscale-[0.5]' : '',
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]',
                      selectedIds.includes(identifier) ? 'bg-primary/5' : '',
                      'group/row transition-all duration-300 hover:bg-white/[0.04] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]'
                    )}
                  >
                    {/* Selection Column */}
                    {showSelection && (
                      <TableCell className="py-5">
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
                        onClick={() => onViewDetails(s)}
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
                            {(s.name && s.name[0]) || '?'}
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

                    {/* Submissions Column */}
                    <TableCell className="text-center">
                      <div className="mx-auto w-fit rounded-xl border border-white/[0.05] bg-white/[0.03] p-1.5 shadow-inner">
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
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1.5 px-0.5">
                          {s.recentAttendance?.map(
                            (record: { present: boolean; date: string }, idx: number) => (
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
                                  className="px-2 py-1 text-[10px] font-bold"
                                >
                                  {record.date} • {record.present ? 'Attended' : 'Missed'}
                                </TooltipContent>
                              </Tooltip>
                            )
                          )}
                        </div>
                        {(() => {
                          const absences = (s.recentAttendance || []).filter(
                            (r: any) => !r.present
                          ).length;
                          let label = 'Regular';
                          let color = 'text-primary/70';

                          if (absences >= 3) {
                            label = 'Irregular';
                            color = 'text-red-500/80 animate-pulse';
                          } else if (absences === 2) {
                            label = 'Warning';
                            color = 'text-amber-500/80';
                          }

                          return (
                            <p
                              className={cn(
                                'flex items-center gap-1.5 px-1 text-[10px] font-black tracking-[0.2em] uppercase transition-colors',
                                color
                              )}
                            >
                              <Icon
                                name={absences >= 2 ? 'warning' : 'monitoring'}
                                className="text-[11px]"
                              />
                              {label}
                            </p>
                          );
                        })()}
                      </div>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell className="text-center">
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

                    {/* SRM Assignment Column */}
                    {showSrmColumn && (
                      <TableCell className="text-center">
                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={s.assignedSrmId || 'none'}
                            onValueChange={(val) =>
                              onAssignSRM && onAssignSRM(identifier, val === 'none' ? '' : val)
                            }
                          >
                            <SelectTrigger className="hover:border-primary/40 !h-9 !min-h-0 w-[130px] rounded-lg border-white/10 bg-white/5 px-3 py-0 text-[10px] font-black tracking-widest uppercase focus:ring-0">
                              <SelectValue placeholder="No SRM" />
                            </SelectTrigger>
                            <SelectContent className="bg-surface-dark border-white/10">
                              <SelectItem
                                value="none"
                                className="text-[10px] font-black tracking-widest uppercase"
                              >
                                No SRM
                              </SelectItem>
                              {srms.map((srm: any) => (
                                <SelectItem
                                  key={srm._id}
                                  value={srm._id}
                                  className="text-[10px] font-black tracking-widest uppercase"
                                >
                                  {srm.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {s.assignmentCriteria && (
                          <div className="text-primary/70 mt-1 text-[9px] font-black tracking-tighter uppercase">
                            {s.assignmentCriteria}
                          </div>
                        )}
                      </TableCell>
                    )}

                    {/* Actions Column */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Block Icon Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="icon"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleBlock(identifier, s.isBlocked || false);
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
                                'size-9 rounded-xl border transition-all duration-300 hover:scale-110 active:scale-90',
                                (() => {
                                  if (!s.callHistory || s.callHistory.length === 0) {
                                    return 'border-white/10 bg-white/5 text-gray-400 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-500 hover:shadow-amber-500/20';
                                  }

                                  const lastCall = s.callHistory[0]; // Assuming sorted newest first

                                  if (lastCall.outcome === 'Received') {
                                    return 'border-green-500/40 bg-green-500/10 text-green-500 shadow-green-500/20 hover:bg-green-500/20 hover:shadow-green-500/30';
                                  }

                                  if (
                                    ['Not Received', 'Busy', 'Wrong Number'].includes(
                                      lastCall.outcome
                                    )
                                  ) {
                                    return 'border-red-500/40 bg-red-500/10 text-red-500 shadow-red-500/20 hover:bg-red-500/20 hover:shadow-red-500/30';
                                  }

                                  if (lastCall.outcome === 'Left Voicemail') {
                                    return 'border-amber-500/40 bg-amber-500/10 text-amber-500 shadow-amber-500/20 hover:bg-amber-500/20 hover:shadow-amber-500/30';
                                  }

                                  if (lastCall.outcome === 'Discord Action') {
                                    return 'border-blue-500/40 bg-blue-500/10 text-blue-500 shadow-blue-500/20 hover:bg-blue-500/20 hover:shadow-blue-500/30';
                                  }

                                  return 'border-white/10 bg-white/5 text-gray-400 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-500 hover:shadow-amber-500/20';
                                })()
                              )}
                            >
                              <Icon name="history" className="text-lg" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {s.callHistory && s.callHistory.length > 0
                              ? `Last Call: ${s.callHistory[0].outcome} (${s.callHistory[0].date})`
                              : 'No Call History'}
                          </TooltipContent>
                        </Tooltip>

                        {/* View Details Button */}
                        {showViewDetails && (
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

                        {/* Send Email Button */}
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
                                className="size-9 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-xl shadow-blue-500/5 transition-all duration-300 hover:scale-110 hover:border-blue-500/40 hover:bg-blue-500/20 active:scale-90"
                              >
                                <Icon name="mail" className="text-lg" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send Instant Email</TooltipContent>
                          </Tooltip>
                        )}

                        {/* Discord Kick Button */}
                        {onDiscordKick && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="icon"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDiscordKick(s);
                                }}
                                className="size-9 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500 shadow-xl shadow-amber-500/5 transition-all duration-300 hover:scale-110 hover:border-amber-500/40 hover:bg-amber-500/20 active:scale-90"
                              >
                                <Icon name="person_remove" className="text-lg" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Kick from Server</TooltipContent>
                          </Tooltip>
                        )}

                        {/* Discord Ban Button */}
                        {onDiscordBan && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="icon"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDiscordBan(s);
                                }}
                                className="size-9 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 shadow-xl shadow-red-500/5 transition-all duration-300 hover:scale-110 hover:border-red-500/40 hover:bg-red-500/20 active:scale-90"
                              >
                                <Icon name="gavel" className="text-lg" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Permanent Server Ban</TooltipContent>
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
