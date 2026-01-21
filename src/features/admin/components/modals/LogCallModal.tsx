import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import type { AdminStudent, CallOutcome } from '@/types';

interface LogCallModalProps {
  student: AdminStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onLog: (outcome: CallOutcome) => void;
}

export const LogCallModal: React.FC<LogCallModalProps> = ({ student, isOpen, onClose, onLog }) => {
  if (!student) return null;

  const outcomes: CallOutcome[] = ['Received', 'Not Received', 'Busy', 'Left Voicemail', 'Wrong Number'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <VisuallyHidden>
          <DialogTitle>Log Outreach: {student.name}</DialogTitle>
          <DialogDescription>Record the outcome of an outreach attempt</DialogDescription>
        </VisuallyHidden>
        <div className="p-10 flex flex-col">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Log Outreach: {student.name}</h3>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {outcomes.map(outcome => (
              <Button 
                key={outcome} 
                onClick={() => onLog(outcome)} 
                variant="outline"
                className="w-full h-14 rounded-xl bg-background-dark/50 text-white hover:bg-primary/10 flex items-center justify-between px-6 group"
              >
                {outcome}
                <Icon name="arrow_forward" className="opacity-0 group-hover:opacity-100 transition-all" />
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
