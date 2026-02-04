import { useState } from 'react';
import { Icon } from '@/constants';
import type { CallOutcome } from '@/types';

import { PrimaryButton } from '@/components/shared/Button';
import { FormTextarea } from '@/components/shared/Form';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  VisuallyHidden,
} from '@/components/ui';

// Base type for students that can have calls logged
interface LogCallStudent {
  name: string;
}

interface LogCallModalProps<T extends LogCallStudent> {
  student: T | null;
  isOpen: boolean;
  onClose: () => void;
  onLog: (outcome: CallOutcome, note?: string) => void;
  isPending?: boolean;
}

export const LogCallModal = <T extends LogCallStudent>({
  student,
  isOpen,
  onClose,
  onLog,
  isPending,
}: LogCallModalProps<T>) => {
  const [selectedOutcome, setSelectedOutcome] = useState<CallOutcome | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleClose = () => {
    setSelectedOutcome(null);
    setFeedback('');
    onClose();
  };

  if (!student) return null;

  const outcomes: CallOutcome[] = [
    'Received',
    'Not Received',
    'Busy',
    'Left Voicemail',
    'Wrong Number',
  ];

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
        <div className="flex flex-col p-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="bg-primary/10 border-primary/20 shadow-primary/5 flex size-12 items-center justify-center rounded-2xl border shadow-lg">
              <Icon name="phone_callback" className="text-primary text-2xl" />
            </div>
            <div>
              <h3 className="mb-1 text-2xl leading-none font-black tracking-tight text-white uppercase">
                Log Outreach
              </h3>
              <p className="text-text-secondary text-xs font-bold tracking-widest uppercase">
                {student.name}
              </p>
            </div>
          </div>

          {!selectedOutcome ? (
            <div className="grid grid-cols-1 gap-3">
              <p className="mb-2 ml-1 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
                Select Outcome
              </p>
              {outcomes.map((outcome) => (
                <Button
                  key={outcome}
                  onClick={() => handleOutcomeClick(outcome)}
                  variant="outline"
                  className={`bg-background-dark/50 group flex h-16 w-full items-center justify-between rounded-2xl px-6 text-white transition-all duration-300 ${
                    outcome === 'Received'
                      ? 'border-primary/30 hover:bg-primary/10 hover:border-primary'
                      : 'border-border-dark hover:border-white/40 hover:bg-white/5'
                  }`}
                >
                  <span className="font-bold tracking-tight">{outcome}</span>
                  <div
                    className={`flex size-8 items-center justify-center rounded-xl transition-all ${
                      outcome === 'Received'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-white/5 text-gray-500 group-hover:text-white'
                    }`}
                  >
                    <Icon
                      name={outcome === 'Received' ? 'check_circle' : 'arrow_forward'}
                      className="text-lg"
                    />
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-2xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-background-dark flex size-8 items-center justify-center rounded-lg">
                    <Icon name="check" className="font-black" />
                  </div>
                  <span className="text-primary text-xs font-black tracking-widest uppercase">
                    Call Received
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOutcome(null)}
                  className="h-auto p-0 text-[10px] font-black tracking-widest text-gray-500 uppercase hover:text-white"
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
                className="bg-background-dark/80 border-border-dark focus:ring-primary/20 min-h-[160px] rounded-2xl p-5 text-sm leading-relaxed text-white"
              />

              <div className="mt-4 flex gap-3">
                <PrimaryButton
                  onClick={handleSubmitFeedback}
                  loading={isPending}
                  className="shadow-primary/10 h-16 w-full rounded-2xl font-black tracking-widest uppercase shadow-xl"
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
