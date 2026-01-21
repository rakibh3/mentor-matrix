import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
  variant?: 'primary' | 'dark';
  inline?: boolean;
}

const sizeClasses = {
  xs: 'size-4 border-2',
  sm: 'size-6 border-2',
  md: 'size-10 border-4',
  lg: 'size-14 border-4',
};

const variantClasses = {
  primary: 'border-primary border-t-transparent',
  dark: 'border-background-dark border-t-transparent',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  fullHeight = true,
  variant = 'primary',
  inline = false,
}) => {
  const spinner = (
    <div 
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full animate-spin`}
    />
  );

  if (inline) {
    return spinner;
  }

  return (
    <div className={`w-full flex items-center justify-center ${fullHeight ? 'h-64' : ''}`}>
      {spinner}
    </div>
  );
};
