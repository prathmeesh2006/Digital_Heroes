'use client';

import { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Profile, Subscription } from '@/types';
import { ROUTES } from '@/config/constants';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSubscribed: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  subscription: null,
  isLoading: true,
  isAdmin: false,
  isSubscribed: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  async function loadUserData(currentUser: User | null) {
    if (!currentUser) {
      setUser(null);
      setProfile(null);
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    setUser(currentUser);

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch active subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', currentUser.id)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

      if (subData) {
        setSubscription(subData as Subscription);
      }
    } catch (err) {
      console.error('Error loading user profile or subscription:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      loadUserData(user);
    });

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserData(session?.user ?? null);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  async function refreshProfile() {
    if (user) {
      await loadUserData(user);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSubscription(null);
    startTransition(() => {
      router.push(ROUTES.login);
      router.refresh();
    });
  }

  const isAdmin = profile?.role === 'admin';
  const isSubscribed = !!subscription && subscription.status === 'active';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        subscription,
        isLoading,
        isAdmin,
        isSubscribed,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
