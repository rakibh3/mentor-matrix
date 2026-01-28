import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle, VisuallyHidden } from '@/components/ui';

import { Icon } from '@/constants';

import { FormTextarea } from '@/components/shared/Form';
import { PrimaryButton } from '@/components/shared/Button';
import type { CallOutcome } from '@/types';

// Base type for students that can have calls logged
interface LogCallStudent {
  name: string;
}

interface LogCallModalProps<T extends LogCallStudent> {
  student: T | null;
  isOpen: boolean;
  onClose: () => void;
  onLog: (outcome: CallOutcome, note?: string) => void;
}

export const LogCallModal = <T extends LogCallStudent>({ student, isOpen, onClose, onLog }: LogCallModalProps<T>) => {
  const [selectedOutcome, setSelectedOutcome] = useState<CallOutcome | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleClose = () => {
    setSelectedOutcome(null);
    setFeedback('');
    onClose();
  };

  if (!student) return null;

  const outcomes: CallOutcome[] = ['Received', 'Not Received', 'Busy', 'Left Voicemail', 'Wrong Number'];

  const handleOutcomeClick = (outcome: CallOutcome) => {
    if (outcome === 'Received') {
      setSelectedOutcome(outcome);
    } else {
      onLog(outcome);
    }
  };

  const handleSubmitFeedback = () => {
    if (selectedOutcome) {
      onLog(selectedOutcome, feedback);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent size="md">
        <VisuallyHidden>
          <DialogTitle>Log Outreach: {student.name}</DialogTitle>
          <DialogDescription>Record the outcome of an outreach attempt</DialogDescription>
        </VisuallyHidden>
        <div className="p-10 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
              <Icon name="phone_callback" className="text-2xl text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">Log Outreach</h3>
              <p className="text-text-secondary text-xs font-bold uppercase tracking-widest">{student.name}</p>
            </div>
          </div>
          
          {!selectedOutcome ? (
            <div className="grid grid-cols-1 gap-3">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Select Outcome</p>
              {outcomes.map(outcome => (
                <Button 
                  key={outcome} 
                  onClick={() => handleOutcomeClick(outcome)} 
                  variant="outline"
                  className={`w-full h-16 rounded-2xl bg-background-dark/50 text-white flex items-center justify-between px-6 group transition-all duration-300 ${
                    outcome === 'Received' 
                      ? 'border-primary/30 hover:bg-primary/10 hover:border-primary' 
                      : 'border-border-dark hover:border-white/40 hover:bg-white/5'
                  }`}
                >
                  <span className="font-bold tracking-tight">{outcome}</span>
                  <div className={`size-8 rounded-xl flex items-center justify-center transition-all ${
                    outcome === 'Received' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500 group-hover:text-white'
                  }`}>
                    <Icon name={outcome === 'Received' ? "check_circle" : "arrow_forward"} className="text-lg" />
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary text-background-dark flex items-center justify-center">
                    <Icon name="check" className="font-black" />
                  </div>
                  <span className="text-primary font-black uppercase tracking-widest text-xs">Call Received</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedOutcome(null)}
                  className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest p-0 h-auto"
                >
                  Change
                </Button>
              </div>
              
                <FormTextarea
                  label="Conversation Details"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What did you discuss? Any follow-up needed?"
                  helpText="Optional but recommended"
                  className="min-h-[160px] bg-background-dark/80 border-border-dark text-white rounded-2xl focus:ring-primary/20 p-5 text-sm leading-relaxed"
                />

              <div className="flex gap-3 mt-4">
                <PrimaryButton 
                  onClick={handleSubmitFeedback}
                  loading={false}
                  className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/10"
                >
                  Complete Log Entry
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
