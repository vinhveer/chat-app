import type { User } from '@supabase/supabase-js';

/**
 * Get user display name with fallback hierarchy
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'User';
  
  return user.user_metadata?.displayName || 
         user.email?.split('@')[0] || 
         'User';
}

/**
 * Get user initials for avatars
 */
export function getUserInitials(user: User | null): string {
  const displayName = getUserDisplayName(user);
  return displayName.charAt(0).toUpperCase();
}
