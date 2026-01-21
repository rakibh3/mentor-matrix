import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { IconAvatar } from '@/components/ui/icon-avatar';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: string;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  icon,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const buttonStyles = {
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-500/20',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{typeof description === 'string' ? description : 'Confirmation required'}</DialogDescription>
        </VisuallyHidden>
        <div className="p-10 flex flex-col items-center text-center">
          <IconAvatar variant={variant} size="xl" className="mb-8 rounded-3xl">
            <Icon name={icon} className="text-5xl" />
          </IconAvatar>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
            {title}
          </h3>
          <div className="text-text-secondary text-base font-medium mb-10 leading-relaxed">
            {description}
          </div>
          <div className="flex flex-col w-full gap-4">
            <Button 
              onClick={onConfirm} 
              size="lg"
              className={`w-full ${buttonStyles[variant]}`}
            >
              {confirmText}
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline"
              size="lg"
              className="w-full"
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
