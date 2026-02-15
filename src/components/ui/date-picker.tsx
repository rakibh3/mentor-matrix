import * as React from 'react';
import { format, isValid, parse } from 'date-fns';
import { getDhakaToday } from '@/lib/dhakaTime';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Icon } from '@/constants';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  disablePast?: boolean;
  className?: string;
}

function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  disablePast = true,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const today = getDhakaToday();

  // Parse the value string to Date object
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = parse(value, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      setOpen(false);
    }
  };

  const handleTodayClick = () => {
    onChange(format(today, 'yyyy-MM-dd'));
    setOpen(false);
  };

  const disabledDays = disablePast ? { before: today } : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            'bg-background-dark/50 hover:bg-background-dark/50 flex h-14 w-full items-center justify-between rounded-xl border px-5 text-sm font-bold transition-all outline-none',
            open
              ? 'border-primary ring-primary/30 ring-1'
              : 'border-card-border hover:border-primary/50',
            className
          )}
        >
          <div className="flex items-center gap-3 text-white">
            <Icon
              name="calendar_month"
              className={cn('text-xl', open ? 'text-primary' : 'text-gray-500')}
            />
            <span className={value ? 'text-white' : 'text-gray-600'}>
              {selectedDate ? format(selectedDate, 'MMM d, yyyy') : placeholder}
            </span>
          </div>
          <Icon
            name="expand_more"
            className={cn(
              'text-xl text-gray-500 transition-transform duration-300',
              open && 'text-primary rotate-180'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-surface-dark border-card-border w-auto overflow-hidden rounded-2xl p-0 shadow-2xl"
        align="start"
        sideOffset={8}
      >
        <div className="p-5">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={disabledDays}
            defaultMonth={selectedDate || today}
          />
          <div className="border-card-border/50 mt-4 flex items-center justify-between border-t pt-4">
            <Button
              type="button"
              variant="link"
              onClick={handleTodayClick}
              className="text-primary h-auto p-0 text-xs font-black tracking-widest uppercase hover:underline"
            >
              Today
            </Button>
            {disablePast && (
              <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">
                Future dates only
              </span>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
