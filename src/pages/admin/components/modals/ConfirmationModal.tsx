import React from 'react';
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle, IconAvatar, VisuallyHidden } from '@/components/ui';
import { Icon } from '@/constants';
import { SecondaryButton } from '@/components/shared/Button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

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
  isLoading?: boolean;
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
  isLoading = false,
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
              disabled={isLoading}
              className={`w-full ${buttonStyles[variant]}`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" variant="dark" inline />
                  Processing...
                </>
              ) : confirmText}
            </Button>
            <SecondaryButton 
              onClick={onClose} 
              size="lg"
              className="w-full border-white/10 hover:bg-white/5 hover:border-white/20 text-white"
            >
              {cancelText}
            </SecondaryButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
