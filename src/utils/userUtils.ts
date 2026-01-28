import type { User } from '@/types/auth';

/**
 * Extract user initials from name or email
 */
export const getUserInitials = (user: User): string => {
  const displayText = user.name || user.email;
  return displayText.substring(0, 2).toUpperCase();
};

/**
 * Get user display name with fallback to 'Student'
 */
export const getUserDisplayName = (user: User): string => {
  return user.name || 'Student';
};
