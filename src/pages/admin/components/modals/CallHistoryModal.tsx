import { Icon } from '@/constants';
import type { CallRecord } from '@/types';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  TimelineDot,
  VisuallyHidden,
} from '@/components/ui';

// Base type for students with call history
interface CallHistoryStudent {
  name: string;
  callHistory: CallRecord[];
}

interface CallHistoryModalProps<T extends CallHistoryStudent> {
  student: T | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CallHistoryModal = <T extends CallHistoryStudent>({
  student,
  isOpen,
  onClose,
}: CallHistoryModalProps<T>) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl">
        <VisuallyHidden>
          <DialogTitle>Outreach Log: {student.name}</DialogTitle>
          <DialogDescription>View call history and outreach attempts</DialogDescription>
        </VisuallyHidden>
        <div className="flex h-[600px] flex-col p-10">
          <div className="mb-10 flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 shadow-lg shadow-amber-500/5">
              <Icon name="history" className="text-3xl text-amber-500" />
            </div>
            <div>
              <h3 className="mb-1 text-3xl leading-none font-black tracking-tight text-white uppercase">
                Outreach Log
              </h3>
              <p className="text-text-secondary text-xs font-bold tracking-widest uppercase">
                {student.name}
              </p>
            </div>
          </div>

          <div className="scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent flex-1 overflow-y-auto pr-4">
            {(student.callHistory || []).length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 opacity-30">
                <Icon name="call_end" className="text-6xl" />
                <p className="text-sm font-black tracking-widest uppercase">No history recorded</p>
              </div>
            ) : (
              <div className="border-card-border/50 relative ml-4 flex flex-col gap-10 border-l pl-10">
                {(student.callHistory || []).map((call, idx) => (
                  <div key={idx} className="group relative">
                    <TimelineDot
                      variant={call.outcome === 'Received' ? 'primary' : 'danger'}
                      className="ring-background-dark absolute top-1 -left-[3.15rem] z-10 size-4 shadow-lg ring-4 shadow-black/50"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
                          {call.date}
                        </span>
                        <div className={`h-px flex-1 bg-white/5`}></div>
                      </div>
                      <p
                        className={`text-xl font-black tracking-tight ${call.outcome === 'Received' ? 'text-primary' : 'text-red-400'}`}
                      >
                        {call.outcome}
                      </p>
                      {call.note && (
                        <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-colors group-hover:bg-white/[0.05]">
                          <Icon
                            name="format_quote"
                            className="absolute -top-1 -right-1 -rotate-12 text-5xl text-white/[0.02]"
                          />
                          <p className="text-text-secondary relative z-10 text-sm leading-relaxed font-medium italic">
                            "{call.note}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border-dark mt-8 h-14 w-full rounded-2xl font-black tracking-widest text-white uppercase hover:bg-white/5"
          >
            Close History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
