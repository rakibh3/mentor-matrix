
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  variant?: 'centered' | 'slide-over';
  zIndex?: string;
}

/**
 * Reusable Modal component for both centered dialogs and slide-over panels.
 * Adheres to SOLID (Single Responsibility), KISS (Simple API), and DRY (Centralized Logic).
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-md',
  variant = 'centered',
  zIndex = 'z-[150]'
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSlideOver = variant === 'slide-over';

  return (
    <div 
      className={`fixed inset-0 ${zIndex} flex ${isSlideOver ? 'justify-end' : 'items-center justify-center p-6'} bg-background-dark/95 backdrop-blur-md animate-in fade-in duration-300`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-transparent cursor-default" 
        onClick={onClose}
      ></div>

      {/* Modal Content Container */}
      <div 
        className={`relative w-full ${maxWidth} overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] 
          ${isSlideOver 
            ? 'h-full bg-surface-dark border-l border-border-dark animate-fade-in-right' 
            : 'bg-[#0c1611] border border-card-border rounded-[2.5rem] animate-fade-in-up'
          }`}
      >
        {children}
      </div>
    </div>
  );
};
