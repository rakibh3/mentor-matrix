
import React from 'react';
import { Modal } from '@/components/shared/Modal';
import { Icon } from '@/constants';
import { FlaggedStudent } from '@/types';

interface StudentDetailModalProps {
  student: FlaggedStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onEmail: (student: FlaggedStudent) => void;
  onEdit: (student: FlaggedStudent) => void;
  onDelete: (student: FlaggedStudent) => void;
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
    <Modal isOpen={isOpen} onClose={onClose} variant="slide-over" maxWidth="max-w-xl">
      <div className="h-full flex flex-col bg-surface-dark">
        {/* Header Section */}
        <div className="px-10 py-12 border-b border-card-border/30 bg-white/[0.01] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-bl-full pointer-events-none"></div>
          
          <div className="flex flex-col gap-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="size-20 rounded-[2.5rem] flex items-center justify-center text-4xl font-black border-4 border-surface-dark bg-red-500/10 text-red-500 shadow-2xl ring-1 ring-red-500/20">
                {student.name[0]}
              </div>
              <button onClick={onClose} className="size-12 rounded-2xl bg-background-dark border border-card-border flex items-center justify-center text-gray-500 hover:text-white transition-all shadow-lg active:scale-95">
                <Icon name="close" className="text-2xl" />
              </button>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">{student.name}</h3>
                <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
              </div>
              <p className="text-text-secondary text-sm font-medium tracking-wide">{student.email}</p>
            </div>

            <div className="flex gap-2">
              <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                {student.risk} Priority Risk
              </span>
              <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-white/5 text-gray-500 border border-card-border">
                Cohort 12
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar - The Move functionality */}
        <div className="px-10 py-8 bg-background-dark/30 border-b border-card-border/20 flex items-center gap-3">
          <button 
            onClick={() => onEmail(student)}
            className="flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl border border-card-border bg-card-dark text-white text-sm font-black uppercase tracking-widest hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-[0.97]"
          >
            <Icon name="mail" className="text-xl" />
            <span>Email</span>
          </button>
          <button 
            onClick={() => onEdit(student)}
            className="flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl border border-card-border bg-card-dark text-white text-sm font-black uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all active:scale-[0.97]"
          >
            <Icon name="edit" className="text-xl" />
            <span>Edit</span>
          </button>
          <button 
            onClick={() => onDelete(student)}
            className="flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl border border-card-border bg-card-dark text-red-500 text-sm font-black uppercase tracking-widest hover:border-red-500/50 hover:bg-red-500/5 transition-all active:scale-[0.97]"
          >
            <Icon name="delete" className="text-xl" />
            <span>Delete</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent flex flex-col gap-12">
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            {[
              { label: 'Issue Flag', val: student.reason, icon: 'report' },
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
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-card-border/50"></div>
              {mockActivity.map((act, i) => (
                <div key={i} className="relative flex flex-col gap-1">
                  <div className={`absolute -left-[30px] top-1.5 size-5 rounded-full border-4 border-surface-dark z-10 ${
                    act.type === 'progress' ? 'bg-primary' : act.type === 'alert' ? 'bg-red-500' : 'bg-chart-blue'
                  }`}></div>
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
          <button 
            onClick={() => onEmail(student)}
            className="w-full h-16 rounded-[1.5rem] bg-primary text-background-dark font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/10 hover:bg-primary-hover transition-all active:scale-[0.98]"
          >
            <Icon name="bolt" className="text-2xl" />
            Quick Outreach Response
          </button>
        </div>
      </div>
    </Modal>
  );
};
