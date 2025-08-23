import { supabase } from '@/lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface SignUpData {
  email: string;
  password: string;
  options?: {
    data?: Record<string, any>;
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  static async signUp({ email, password, options }: SignUpData): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    return {
      user: data.user,
      session: data.session,
      error,
    };
  }

  static async signIn({ email, password }: SignInData): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data.user,
      session: data.session,
      error,
    };
  }

  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      // Handle AuthSessionMissingError gracefully
      console.warn('Auth session missing during signOut, continuing...');
      return { error: null };
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  }

  static async updatePassword(password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    return {
      user: data.user,
      session: null,
      error,
    };
  }

  static async updateProfile(updates: Record<string, any>): Promise<AuthResult> {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    return {
      user: data.user,
      session: null,
      error,
    };
  }

  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
