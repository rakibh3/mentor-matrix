import React, { useState, useRef, useEffect } from 'react';
import { formatDateForInput } from '@/utils/dateUtils';
import { Icon } from './Icon';

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

export const CustomDatePicker = ({ 
  value, 
  onChange 
}: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewDate, setViewDate] = useState(new Date());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const formatDate = (date: Date) => formatDateForInput(date);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleMonthChange = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const days = [];
  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Padding for the start of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`pad-${i}`} className="h-10"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    const isPast = currentDate < today;
    const isSelected = value === formatDate(currentDate);
    const isToday = today.getTime() === currentDate.getTime();

    days.push(
      <button
        key={d}
        type="button"
        disabled={isPast}
        onClick={() => {
          onChange(formatDate(currentDate));
          setIsOpen(false);
        }}
        className={`h-10 w-10 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
          isSelected 
            ? 'bg-primary text-background-dark shadow-lg shadow-primary/20 scale-110' 
            : isPast 
              ? 'text-gray-800 cursor-not-allowed opacity-30' 
              : 'text-text-secondary hover:bg-primary/20 hover:text-primary'
        } ${isToday && !isSelected ? 'border border-primary/40' : ''}`}
      >
        {d}
      </button>
    );
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border h-14 px-5 text-sm font-bold transition-all outline-none bg-background-dark/50 ${
          isOpen ? 'border-primary ring-1 ring-primary/30' : 'border-card-border hover:border-primary/50'
        }`}
      >
        <div className="flex items-center gap-3 text-white">
          <Icon name="calendar_month" className={`text-xl ${isOpen ? 'text-primary' : 'text-gray-500'}`} />
          <span className={value ? 'text-white' : 'text-gray-600'}>
            {value || "Select Due Date"}
          </span>
        </div>
        <Icon name="arrow_drop_down" className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 w-full md:w-80 z-[150] bg-surface-dark border border-card-border rounded-3xl shadow-2xl p-6 animate-fade-in-up origin-bottom backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <button type="button" onClick={() => handleMonthChange(-1)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-primary transition-all">
              <Icon name="chevron_left" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-xs font-black uppercase tracking-widest text-primary">{viewDate.getFullYear()}</span>
              <span className="text-sm font-black text-white uppercase tracking-tight">{months[viewDate.getMonth()]}</span>
            </div>
            <button type="button" onClick={() => handleMonthChange(1)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-primary transition-all">
              <Icon name="chevron_right" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-xs font-black text-gray-600 uppercase tracking-widest h-8 flex items-center justify-center">
                {d}
              </div>
            ))}
            {days}
          </div>
          
          <div className="mt-4 pt-4 border-t border-card-border/50 flex justify-between items-center">
            <button 
              type="button" 
              onClick={() => {
                const now = new Date();
                onChange(formatDate(now));
                setIsOpen(false);
              }}
              className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
            >
              Today
            </button>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Select Future Only</span>
          </div>
        </div>
      )}
    </div>
  );
};
