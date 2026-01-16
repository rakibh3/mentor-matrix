import React from 'react';
import { Modal } from '@/components/shared/Modal';
import { Icon } from '@/constants';

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
  const variantStyles = {
    danger: {
      iconBg: 'bg-red-500/10',
      iconBorder: 'border-red-500/20',
      iconColor: 'text-red-500',
      buttonBg: 'bg-red-500 hover:bg-red-600',
      shadow: 'shadow-xl shadow-red-500/20',
    },
    warning: {
      iconBg: 'bg-amber-500/10',
      iconBorder: 'border-amber-500/20',
      iconColor: 'text-amber-500',
      buttonBg: 'bg-amber-500 hover:bg-amber-600',
      shadow: 'shadow-xl shadow-amber-500/20',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" zIndex="z-[150]">
      <div className="p-10 flex flex-col items-center text-center">
        <div 
          className={`size-20 rounded-3xl ${styles.iconBg} flex items-center justify-center ${styles.iconColor} mb-8 border ${styles.iconBorder}`}
        >
          <Icon name={icon} className="text-5xl" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          {title}
        </h3>
        <div className="text-text-secondary text-base font-medium mb-10 leading-relaxed">
          {description}
        </div>
        <div className="flex flex-col w-full gap-4">
          <button 
            onClick={onConfirm} 
            className={`w-full h-16 rounded-2xl ${styles.buttonBg} text-white text-sm font-black uppercase tracking-widest transition-all active:scale-95 ${styles.shadow}`}
          >
            {confirmText}
          </button>
          <button 
            onClick={onClose} 
            className="w-full h-16 rounded-2xl bg-transparent border border-card-border text-gray-400 text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
