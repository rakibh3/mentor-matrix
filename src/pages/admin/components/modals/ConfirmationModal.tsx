import React from 'react';
import { Icon } from '@/constants';

import { SecondaryButton } from '@/components/shared/Button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  IconAvatar,
  VisuallyHidden,
} from '@/components/ui';

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
          <DialogDescription>
            {typeof description === 'string' ? description : 'Confirmation required'}
          </DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col items-center p-10 text-center">
          <IconAvatar variant={variant} size="xl" className="mb-8 rounded-3xl">
            <Icon name={icon} className="text-5xl" />
          </IconAvatar>
          <h3 className="mb-4 text-2xl font-black tracking-tight text-white uppercase">{title}</h3>
          <div className="text-text-secondary mb-10 text-base leading-relaxed font-medium">
            {description}
          </div>
          <div className="flex w-full flex-col gap-4">
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
              ) : (
                confirmText
              )}
            </Button>
            <SecondaryButton
              onClick={onClose}
              size="lg"
              className="w-full border-white/10 text-white hover:border-white/20 hover:bg-white/5"
            >
              {cancelText}
            </SecondaryButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
