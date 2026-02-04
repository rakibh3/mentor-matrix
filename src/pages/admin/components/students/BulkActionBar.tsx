import React from 'react';
import { Icon } from '@/constants';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAssignSRM: () => void;
  onSendEmail: () => void;
  onExport: () => void;
  isVisible: boolean;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onAssignSRM,
  onSendEmail,
  onExport,
  isVisible,
}) => {
  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-top-4 flex items-center gap-6 rounded-2xl border border-primary/20 bg-background-dark/80 px-6 py-4 shadow-2xl backdrop-blur-xl transition-all duration-300',
        isVisible ? 'flex' : 'hidden'
      )}
    >
      <div className="flex items-center gap-3 border-r border-white/10 pr-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <span className="text-sm font-black">{selectedCount}</span>
        </div>
        <p className="text-sm font-bold tracking-tight text-white uppercase">
          Students Selected
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onAssignSRM}
          className="hover:bg-primary/10 hover:text-primary border-white/10 bg-white/5 font-bold tracking-widest text-white uppercase"
        >
          <Icon name="person_add" className="mr-2 text-base" />
          Assign SRM
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSendEmail}
          className="hover:bg-primary/10 hover:text-primary border-white/10 bg-white/5 font-bold tracking-widest text-white uppercase"
        >
          <Icon name="mail" className="mr-2 text-base" />
          Send Email
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="hover:bg-primary/10 hover:text-primary border-white/10 bg-white/5 font-bold tracking-widest text-white uppercase"
        >
          <Icon name="download" className="mr-2 text-base" />
          Export
        </Button>
      </div>

      <div className="ml-2 border-l border-white/10 pl-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          className="text-text-secondary hover:text-white hover:bg-white/5 size-9 rounded-xl transition-all active:scale-90"
        >
          <Icon name="close" className="text-xl" />
        </Button>
      </div>
    </div>
  );
};
