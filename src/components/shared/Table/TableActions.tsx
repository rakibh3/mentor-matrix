import React from 'react';

import { IconButton } from '@/components/shared/Button';

import type { TableActionsProps } from './types';

/**
 * TableActions - Common action buttons for table rows
 *
 * @example
 * <TableActions
 *   onView={() => handleView(row)}
 *   onEdit={() => handleEdit(row)}
 *   onDelete={() => handleDelete(row)}
 * />
 */
export const TableActions: React.FC<TableActionsProps> = ({
  onView,
  onEdit,
  onDelete,
  viewTooltip = 'View details',
  editTooltip = 'Edit',
  deleteTooltip = 'Delete',
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {onView && (
        <IconButton icon="visibility" tooltip={viewTooltip} onClick={onView} size="icon" />
      )}
      {onEdit && <IconButton icon="edit" tooltip={editTooltip} onClick={onEdit} size="icon" />}
      {onDelete && (
        <IconButton icon="delete" tooltip={deleteTooltip} onClick={onDelete} size="icon" />
      )}
    </div>
  );
};

TableActions.displayName = 'TableActions';
