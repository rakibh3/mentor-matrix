import { format, startOfDay } from 'date-fns';

/**
 * Get the current date and time in Asia/Dhaka timezone
 */
export const getDhakaNow = (): Date => {
  const now = new Date();
  const dhakaStr = now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
  return new Date(dhakaStr);
};

/**
 * Get the start of the current day in Asia/Dhaka timezone
 */
export const getDhakaToday = (): Date => {
  return startOfDay(getDhakaNow());
};

/**
 * Format a date object or string into Dhaka-aware ISO format (YYYY-MM-DD)
 */
export const formatDhakaDate = (date: Date | string | number = getDhakaNow()): string => {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  // If we already have a Date object that was created with Dhaka time, 
  // we just want the YYYY-MM-DD part from its local perspective
  return format(d, 'yyyy-MM-dd');
};

/**
 * Get current time string in Dhaka for display
 */
export const getDhakaDisplayTime = (): string => {
  return getDhakaNow().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get current date string in Dhaka for display (e.g., Oct 24)
 */
export const getDhakaDisplayDate = (): string => {
  return getDhakaNow().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
