import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AppState {
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  setUser: (user: User | null, isAdmin?: boolean) => void;
  setAuthLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAdmin: false,
  isAuthLoading: true,
  setUser: (user, isAdmin = false) => set({ user, isAdmin }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
}));
