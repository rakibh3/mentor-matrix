import React, { useState } from 'react';
import { Icon } from '@/constants';

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import type { AdminStudent } from '@/pages/admin/types/student';

interface DiscordActionModalProps {
  student: AdminStudent | null;
  isOpen: boolean;
  onClose: () => void;
  type: 'kick' | 'ban' | null;
  onConfirm: (reason: string, details: string, preventRejoin?: boolean) => void;
}

const REASONS = {
  kick: [
    'Inactivity',
    'Minor Rule Violation',
    'Off-topic behavior',
    'Request by student',
    'Directives from Management',
  ],
  ban: [
    'Major Rule Violation',
    'Harassment/Bullying',
    'Spam/Scamming',
    'Terms of Service Violation',
    'Malicious behavior',
    'Permanent Dismissal',
  ],
};

export const DiscordActionModal: React.FC<DiscordActionModalProps> = ({
  student,
  isOpen,
  onClose,
  type,
  onConfirm,
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [preventRejoin, setPreventRejoin] = useState(true);

  if (!student || !type) return null;

  const handleConfirm = () => {
    onConfirm(
      selectedReason || 'No reason specified',
      details,
      type === 'ban' ? preventRejoin : false
    );
    onClose();
    // Reset state
    setSelectedReason('');
    setDetails('');
  };

  const isBan = type === 'ban';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface-dark/95 overflow-hidden rounded-[2rem] border-white/5 p-0 shadow-2xl backdrop-blur-2xl sm:max-w-[500px]">
        <div className={cn('h-2 w-full', isBan ? 'bg-red-500' : 'bg-amber-500')} />

        <div className="p-8">
          <DialogHeader className="mb-6">
            <div className="mb-2 flex items-center gap-4">
              <div
                className={cn(
                  'flex size-12 items-center justify-center rounded-2xl shadow-lg',
                  isBan ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-500'
                )}
              >
                <Icon name={isBan ? 'gavel' : 'person_remove'} className="text-2xl" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight text-white uppercase">
                  {isBan ? 'Terminal Ban' : 'Server Kick'}
                </DialogTitle>
                <p className="text-text-secondary text-sm">Target: {student.name}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Reason Selection */}
            <div>
              <label className="text-text-secondary/60 mb-3 block text-[10px] font-black tracking-[0.2em] uppercase">
                Primary Reason
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REASONS[type].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={cn(
                      'rounded-xl border px-4 py-2.5 text-left text-xs font-bold transition-all',
                      selectedReason === reason
                        ? isBan
                          ? 'border-red-500/40 bg-red-500/20 text-red-100'
                          : 'border-amber-500/40 bg-amber-500/20 text-amber-100'
                        : 'text-text-secondary border-white/5 bg-white/5 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="text-text-secondary/60 mb-3 block text-[10px] font-black tracking-[0.2em] uppercase">
                Additional Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Log internal details for the audit trail..."
                className="placeholder:text-text-secondary/30 min-h-[100px] w-full resize-none rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white transition-all focus:border-white/10 focus:outline-none"
              />
            </div>

            {/* Ban Specific Checkbox */}
            {isBan && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-500/10 bg-red-500/5 p-4">
                <input
                  type="checkbox"
                  id="prevent-rejoin"
                  checked={preventRejoin}
                  onChange={(e) => setPreventRejoin(e.target.checked)}
                  className="size-4 rounded border-red-500/20 bg-red-500/10 text-red-500 focus:ring-red-500/20"
                />
                <label
                  htmlFor="prevent-rejoin"
                  className="cursor-pointer text-xs font-bold text-red-400"
                >
                  Prevent re-joining with individual invites
                </label>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3 border-t border-white/5 bg-white/[0.02] p-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-text-secondary flex-1 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className={cn(
              'flex-[2] rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg transition-all active:scale-95',
              isBan
                ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600'
                : 'text-background-dark bg-amber-500 shadow-amber-500/20 hover:bg-amber-600'
            )}
          >
            Confirm {type.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
