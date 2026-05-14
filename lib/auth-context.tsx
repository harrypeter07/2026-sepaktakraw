'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as AuthUser, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { User } from './types';

interface AuthContextType {
  authUser: AuthUser | null;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isTournamentManager: () => boolean;
  isTeamManager: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session on mount
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setSession(session);
          setAuthUser(session.user);
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setAuthUser(session?.user || null);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // User profile doesn't exist yet, create it
        if (error.code === 'PGRST116') {
          const { data: authData } = await supabase.auth.getUser();
          if (authData.user) {
            const newUser: User = {
              id: userId,
              email: authData.user.email || '',
              full_name: authData.user.user_metadata?.full_name || '',
              phone: null,
              role: 'viewer',
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_active: true,
            };

            const { error: insertError } = await supabase
              .from('users')
              .insert([newUser]);

            if (!insertError) {
              setUser(newUser);
            }
          }
        } else {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAuthUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isTournamentManager = () => user?.role === 'tournament_manager';
  const isTeamManager = () => user?.role === 'team_manager';

  return (
    <AuthContext.Provider
      value={{
        authUser,
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
        isAdmin,
        isTournamentManager,
        isTeamManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
