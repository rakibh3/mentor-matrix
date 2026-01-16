import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: string;
}

export const CustomSelect = ({ 
  value, 
  options, 
  onChange, 
  placeholder = "Select option",
  icon
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border h-14 px-5 transition-all outline-none bg-surface-dark/40 ${
          isOpen ? 'border-primary ring-1 ring-primary/30' : 'border-card-border/60 hover:border-primary/50'
        }`}
      >
        <div className="flex items-center gap-3">
          {icon && <Icon name={icon} className={`text-xl ${isOpen ? 'text-primary' : 'text-gray-500'}`} />}
          <span className={`text-sm font-bold uppercase tracking-widest whitespace-nowrap ${value ? 'text-white' : 'text-gray-600'}`}>
            {value || placeholder}
          </span>
        </div>
        <Icon 
          name="expand_more" 
          className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full z-[100] bg-surface-dark border border-card-border rounded-xl shadow-2xl overflow-hidden animate-fade-in-up origin-top py-2 backdrop-blur-xl">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3.5 text-sm font-bold uppercase tracking-widest transition-all ${
                value === option 
                  ? 'bg-primary text-background-dark' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
