import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, profileService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Oturumu başlat
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data } = await authService.getSession();
        const currentSession = data?.session || null;
        
        if (mounted) {
          setSession(currentSession);
          if (currentSession?.user) {
            setUser(currentSession.user);
            const profRes = await profileService.getProfile(currentSession.user.id);
            if (profRes.data) setProfile(profRes.data);
          } else {
            // Unconfigured or no session: Load default profile
            const profRes = await profileService.getProfile('mock-user-1');
            if (profRes.data) setProfile(profRes.data);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Supabase Auth State Change Listener
    const { data: authListener } = authService.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setUser(newSession.user);
        const profRes = await profileService.getProfile(newSession.user.id);
        if (profRes.data) setProfile(profRes.data);
      } else {
        setUser(null);
        const profRes = await profileService.getProfile('mock-user-1');
        if (profRes.data) setProfile(profRes.data);
      }
    });

    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email, password) => {
    const res = await authService.signIn(email, password);
    if (!res.error && res.data?.user) {
      setUser(res.data.user);
      const profRes = await profileService.getProfile(res.data.user.id);
      if (profRes.data) setProfile(profRes.data);
    }
    return res;
  };

  const signUp = async (email, password, fullName, company) => {
    return await authService.signUp(email, password, fullName, company);
  };

  const signOut = async () => {
    const res = await authService.signOut();
    setUser(null);
    return res;
  };

  const refreshProfile = async () => {
    const targetId = user?.id || 'mock-user-1';
    const profRes = await profileService.getProfile(targetId);
    if (profRes.data) setProfile(profRes.data);
    return profRes.data;
  };

  const value = {
    user,
    profile,
    session,
    loading,
    isConfigured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    setProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
