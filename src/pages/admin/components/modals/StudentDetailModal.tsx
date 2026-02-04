import { Icon } from '@/constants';
import type { RiskLevel } from '@/types';

import {
  BackgroundGlow,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  IconAvatar,
  StatusDot,
  TimelineDot,
  TimelineLine,
  VisuallyHidden,
} from '@/components/ui';

// Base type for student that can be displayed in detail modal
interface DetailStudent {
  name: string;
  email: string;
  phone: string;
  discord: string;
  cohort?: string;
  risk: RiskLevel;
  reason?: string;
  callCount: number;
}

interface StudentDetailModalProps<T extends DetailStudent> {
  student: T | null;
  isOpen: boolean;
  onClose: () => void;
  onEmail: (student: T) => void;
  onEdit: (student: T) => void;
  onDelete: (student: T) => void;
}

const mockActivity = [
  {
    title: 'Frontend Basics',
    description: 'Module 1 Complete',
    time: '4 days ago',
    type: 'progress',
  },
  {
    title: 'Attendance Risk',
    description: 'Missed 2 consecutive days',
    time: 'Yesterday',
    type: 'alert',
  },
  {
    title: 'Call Outreach',
    description: 'Left voicemail for parent',
    time: '3 hours ago',
    type: 'call',
  },
];

export const StudentDetailModal = <T extends DetailStudent>({
  student,
  isOpen,
  onClose,
  onEmail,
  onEdit,
  onDelete,
}: StudentDetailModalProps<T>) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent variant="slide-over" size="xl">
        <VisuallyHidden>
          <DialogTitle>Student Details: {student.name}</DialogTitle>
          <DialogDescription>View and manage student information</DialogDescription>
        </VisuallyHidden>
        <div className="bg-surface-dark flex h-full flex-col">
          {/* Header Section */}
          <div className="border-card-border/30 relative overflow-hidden border-b bg-white/[0.01] px-10 py-12">
            <BackgroundGlow shape="corner-bl" size="md" blur="md" position="top-right" />

            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <IconAvatar
                  variant="danger"
                  size="xl"
                  bordered
                  className="border-surface-dark border-4 font-black shadow-2xl ring-1 ring-red-500/20"
                >
                  {student.name[0]}
                </IconAvatar>
                <Button
                  variant="outline"
                  size="icon-lg"
                  onClick={onClose}
                  className="bg-background-dark shadow-lg"
                >
                  <Icon name="close" className="text-2xl" />
                </Button>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="text-4xl font-black tracking-tighter text-white uppercase">
                    {student.name}
                  </h3>
                  <StatusDot variant="danger" pulse />
                </div>
                <p className="text-text-secondary text-sm font-medium tracking-wide">
                  {student.email}
                </p>
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
          <div className="bg-background-dark/30 border-card-border/20 flex items-center gap-3 border-b px-10 py-8">
            <Button
              onClick={() => onEmail(student)}
              variant="outline"
              className="bg-card-dark hover:border-primary/50 hover:bg-primary/5 h-14 flex-1"
            >
              <Icon name="mail" className="text-xl" />
              <span>Email</span>
            </Button>
            <Button
              onClick={() => onEdit(student)}
              variant="outline"
              className="bg-card-dark h-14 flex-1 hover:border-white"
            >
              <Icon name="edit" className="text-xl" />
              <span>Edit</span>
            </Button>
            <Button
              onClick={() => onDelete(student)}
              variant="outline"
              className="bg-card-dark h-14 flex-1 text-red-500 hover:border-red-500/50 hover:bg-red-500/5"
            >
              <Icon name="delete" className="text-xl" />
              <span>Delete</span>
            </Button>
          </div>

          <div className="scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent flex flex-1 flex-col gap-12 overflow-y-auto p-10">
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {[
                { label: 'Issue Flag', val: student.reason || 'No issue flagged', icon: 'report' },
                { label: 'Discord', val: student.discord, icon: 'forum' },
                { label: 'Phone', val: student.phone, icon: 'call' },
                {
                  label: 'Total Calls',
                  val: `${student.callCount} Outreach Attempts`,
                  icon: 'history',
                },
              ].map((field, i) => (
                <div key={i} className="group flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      name={field.icon}
                      className="group-hover:text-primary text-[14px] text-gray-600 transition-colors"
                    />
                    <span className="text-xs font-black tracking-widest text-gray-500 uppercase">
                      {field.label}
                    </span>
                  </div>
                  <p className="text-base leading-relaxed font-bold text-white">{field.val}</p>
                </div>
              ))}
            </div>

            {/* Performance Trend */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-black tracking-widest text-white uppercase">
                Recent Activity
              </h4>
              <div className="relative flex flex-col gap-6 pl-8">
                <TimelineLine className="top-2 bottom-2 left-[11px]" />
                {mockActivity.map((act, i) => (
                  <div key={i} className="relative flex flex-col gap-1">
                    <TimelineDot
                      variant={
                        act.type === 'progress'
                          ? 'primary'
                          : act.type === 'alert'
                            ? 'danger'
                            : 'info'
                      }
                      className="absolute top-1.5 -left-[30px] z-10"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black tracking-tight text-white uppercase">
                        {act.title}
                      </span>
                      <span className="text-[11px] font-medium text-gray-500 uppercase">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm font-medium">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="border-card-border/30 bg-background-dark/50 mt-auto border-t p-10">
            <Button
              onClick={() => onEmail(student)}
              size="lg"
              className="shadow-primary/10 w-full rounded-[1.5rem] shadow-xl"
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
