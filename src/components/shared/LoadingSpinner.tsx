import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

const sizeClasses = {
  sm: 'size-6 border-2',
  md: 'size-10 border-4',
  lg: 'size-14 border-4',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  fullHeight = true 
}) => {
  return (
    <div className={`w-full flex items-center justify-center ${fullHeight ? 'h-64' : ''}`}>
      <div 
        className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};
