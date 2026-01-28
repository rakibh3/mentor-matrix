import { Button, Dialog, DialogContent, DialogDescription, DialogTitle, TimelineDot, VisuallyHidden } from '@/components/ui';

import { Icon } from '@/constants';


import type { CallRecord } from '@/types';

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

export const CallHistoryModal = <T extends CallHistoryStudent>({ student, isOpen, onClose }: CallHistoryModalProps<T>) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl">
        <VisuallyHidden>
          <DialogTitle>Outreach Log: {student.name}</DialogTitle>
          <DialogDescription>View call history and outreach attempts</DialogDescription>
        </VisuallyHidden>
        <div className="p-10 flex flex-col h-[600px]">
          <div className="flex items-center gap-4 mb-10">
            <div className="size-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/5">
              <Icon name="history" className="text-3xl text-amber-500" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-1">Outreach Log</h3>
              <p className="text-text-secondary text-xs font-bold uppercase tracking-widest">{student.name}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
            {student.callHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                <Icon name="call_end" className="text-6xl" />
                <p className="text-sm font-black uppercase tracking-widest">No history recorded</p>
              </div>
            ) : (
              <div className="relative flex flex-col gap-10 pl-10 border-l border-card-border/50 ml-4">
                {student.callHistory.map((call, idx) => (
                  <div key={idx} className="relative group">
                    <TimelineDot 
                      variant={call.outcome === 'Received' ? 'primary' : 'danger'} 
                      className="absolute -left-[3.15rem] top-1 z-10 size-4 ring-4 ring-background-dark shadow-lg shadow-black/50" 
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{call.date}</span>
                        <div className={`h-px flex-1 bg-white/5`}></div>
                      </div>
                      <p className={`text-xl font-black tracking-tight ${call.outcome === 'Received' ? 'text-primary' : 'text-red-400'}`}>
                        {call.outcome}
                      </p>
                      {call.note && (
                        <div className="mt-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group-hover:bg-white/[0.05] transition-colors">
                          <Icon name="format_quote" className="absolute -top-1 -right-1 text-5xl text-white/[0.02] -rotate-12" />
                          <p className="text-sm text-text-secondary leading-relaxed font-medium relative z-10 italic">
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
            className="mt-8 w-full h-14 rounded-2xl border-border-dark text-white hover:bg-white/5 font-black uppercase tracking-widest"
          >
            Close History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
