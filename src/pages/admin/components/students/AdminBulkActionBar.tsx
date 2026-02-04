import React from 'react';
import { Icon } from '@/constants';

import { PrimaryButton } from '@/components/shared/Button';
import { Badge, Button } from '@/components/ui';

interface AdminBulkActionBarProps {
  selectedCount: number;
  filteredCount: number;
  onAssignSRM: () => void;
  onBulkEmail: () => void;
  onExport: () => void;
  onClear: () => void;
}

export const AdminBulkActionBar: React.FC<AdminBulkActionBarProps> = ({
  selectedCount,
  filteredCount,
  onAssignSRM,
  onBulkEmail,
  onExport,
  onClear,
}) => {
  const isSelectionMode = selectedCount > 0;
  const count = isSelectionMode ? selectedCount : filteredCount;
  const label = isSelectionMode ? 'Selected' : 'All Filtered';

  // If nothing is selected and no filters are active (filteredCount would be 0 or all), we shouldn't show the bar
  // But parent handles visibility checks usually.
  if (count === 0) return null;

  return (
    <div className="bg-surface-dark/40 animate-fade-in-up flex flex-col justify-between gap-6 rounded-3xl border border-white/5 p-5 shadow-2xl backdrop-blur-md md:flex-row md:items-center">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4 border-r-0 border-white/10 pr-0 md:border-r md:pr-8">
          <Badge
            variant="primary"
            size="lg"
            className="shadow-primary/20 flex h-10 items-center gap-3 px-6 font-black shadow-lg"
          >
            <span className="text-sm">{count}</span>
            <span className="text-[10px] tracking-widest uppercase">{label}</span>
          </Badge>

          {isSelectionMode && (
            <button
              onClick={onClear}
              className="text-text-secondary px-2 text-[11px] font-black tracking-[0.2em] uppercase transition-all hover:text-red-400"
            >
              Clear Selection
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <PrimaryButton onClick={onAssignSRM} className="h-11 px-8">
            <Icon name="person_add" className="text-xl" />
            Assign SRM
          </PrimaryButton>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-white/5 pt-4 md:border-t-0 md:pt-0">
        <Button
          variant="ghost"
          onClick={onBulkEmail}
          className="group flex h-10 items-center gap-3 rounded-xl border border-transparent px-6 text-[10px] font-black tracking-widest text-blue-400 uppercase transition-all hover:border-blue-400/20 hover:bg-blue-400/10"
        >
          <Icon name="mail" className="text-lg transition-transform group-hover:-rotate-12" />
          Bulk Email
        </Button>
        <Button
          variant="ghost"
          onClick={onExport}
          className="group flex h-10 items-center gap-3 rounded-xl border border-transparent px-6 text-[10px] font-black tracking-widest text-emerald-400 uppercase transition-all hover:border-emerald-400/20 hover:bg-emerald-400/10"
        >
          <Icon
            name="download"
            className="text-lg transition-transform group-hover:translate-y-0.5"
          />
          Export Data
        </Button>
      </div>
    </div>
  );
};
