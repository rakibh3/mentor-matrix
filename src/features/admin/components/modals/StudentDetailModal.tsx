import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconAvatar } from '@/components/ui/icon-avatar';
import { StatusDot } from '@/components/ui/status-dot';
import { TimelineDot } from '@/components/ui/timeline-dot';
import { TimelineLine } from '@/components/ui/timeline-line';
import { BackgroundGlow } from '@/components/ui/background-glow';
import type { AdminStudent } from '@/types';

interface StudentDetailModalProps {
  student: AdminStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onEmail: (student: AdminStudent) => void;
  onEdit: (student: AdminStudent) => void;
  onDelete: (student: AdminStudent) => void;
}

const mockActivity = [
  { title: 'Frontend Basics', description: 'Module 1 Complete', time: '4 days ago', type: 'progress' },
  { title: 'Attendance Risk', description: 'Missed 2 consecutive days', time: 'Yesterday', type: 'alert' },
  { title: 'Call Outreach', description: 'Left voicemail for parent', time: '3 hours ago', type: 'call' },
];

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ 
  student, 
  isOpen, 
  onClose,
  onEmail,
  onEdit,
  onDelete 
}) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent variant="slide-over" size="xl">
        <VisuallyHidden>
          <DialogTitle>Student Details: {student.name}</DialogTitle>
          <DialogDescription>View and manage student information</DialogDescription>
        </VisuallyHidden>
        <div className="h-full flex flex-col bg-surface-dark">
          {/* Header Section */}
          <div className="px-10 py-12 border-b border-card-border/30 bg-white/[0.01] relative overflow-hidden">
            <BackgroundGlow shape="corner-bl" size="md" blur="md" position="top-right" />
            
            <div className="flex flex-col gap-8 relative z-10">
              <div className="flex items-center justify-between">
                <IconAvatar variant="danger" size="xl" bordered className="border-4 border-surface-dark shadow-2xl ring-1 ring-red-500/20 font-black">
                  {student.name[0]}
                </IconAvatar>
                <Button variant="outline" size="icon-lg" onClick={onClose} className="bg-background-dark shadow-lg">
                  <Icon name="close" className="text-2xl" />
                </Button>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">{student.name}</h3>
                  <StatusDot variant="danger" pulse />
                </div>
                <p className="text-text-secondary text-sm font-medium tracking-wide">{student.email}</p>
              </div>

              <div className="flex gap-2">
                <Badge variant="danger" size="lg">
                  {student.risk} Priority Risk
                </Badge>
                <Badge variant="outline" size="lg">
                  Cohort {student.cohort}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Bar - The Move functionality */}
          <div className="px-10 py-8 bg-background-dark/30 border-b border-card-border/20 flex items-center gap-3">
            <Button 
              onClick={() => onEmail(student)}
              variant="outline"
              className="flex-1 h-14 bg-card-dark hover:border-primary/50 hover:bg-primary/5"
            >
              <Icon name="mail" className="text-xl" />
              <span>Email</span>
            </Button>
            <Button 
              onClick={() => onEdit(student)}
              variant="outline"
              className="flex-1 h-14 bg-card-dark hover:border-white"
            >
              <Icon name="edit" className="text-xl" />
              <span>Edit</span>
            </Button>
            <Button 
              onClick={() => onDelete(student)}
              variant="outline"
              className="flex-1 h-14 bg-card-dark text-red-500 hover:border-red-500/50 hover:bg-red-500/5"
            >
              <Icon name="delete" className="text-xl" />
              <span>Delete</span>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent flex flex-col gap-12">
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {[
                { label: 'Issue Flag', val: student.reason || 'No issue flagged', icon: 'report' },
                { label: 'Discord', val: student.discord, icon: 'forum' },
                { label: 'Phone', val: student.phone, icon: 'call' },
                { label: 'Total Calls', val: `${student.callCount} Outreach Attempts`, icon: 'history' }
              ].map((field, i) => (
                <div key={i} className="flex flex-col gap-2 group">
                  <div className="flex items-center gap-2">
                    <Icon name={field.icon} className="text-[14px] text-gray-600 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{field.label}</span>
                  </div>
                  <p className="text-base text-white font-bold leading-relaxed">{field.val}</p>
                </div>
              ))}
            </div>

            {/* Performance Trend */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Recent Activity</h4>
              <div className="flex flex-col gap-6 relative pl-8">
                <TimelineLine className="left-[11px] top-2 bottom-2" />
                {mockActivity.map((act, i) => (
                  <div key={i} className="relative flex flex-col gap-1">
                    <TimelineDot 
                      variant={act.type === 'progress' ? 'primary' : act.type === 'alert' ? 'danger' : 'info'} 
                      className="absolute -left-[30px] top-1.5 z-10" 
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white uppercase tracking-tight">{act.title}</span>
                      <span className="text-[11px] font-medium text-gray-500 uppercase">{act.time}</span>
                    </div>
                    <p className="text-sm text-text-secondary font-medium">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-10 border-t border-card-border/30 bg-background-dark/50 mt-auto">
            <Button 
              onClick={() => onEmail(student)}
              size="lg"
              className="w-full rounded-[1.5rem] shadow-xl shadow-primary/10"
            >
              <Icon name="bolt" className="text-2xl" />
              Quick Outreach Response
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
