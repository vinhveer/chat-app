export interface User {
  id: string;
  email?: string;
  phone?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  created_at: string;
  updated_at?: string;
  raw_user_meta_data?: any;
  raw_app_meta_data?: any;
  user_metadata?: {
    displayName?: string;
    [key: string]: any;
  };
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName: string;
  created_at: string;
}

// Convert Supabase auth user to our UserProfile format
export const mapAuthUserToProfile = (authUser: User): UserProfile => ({
  id: authUser.id,
  email: authUser.email,
  displayName: authUser.user_metadata?.displayName || authUser.email?.split('@')[0] || 'User',
  created_at: authUser.created_at
});
