import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { logout as logoutApi, fetchMe } from '../services/auth';

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      clearUser: () => set({ user: null, isAuthenticated: false }),

      logout: async () => {
        await logoutApi();
        set({ user: null, isAuthenticated: false });
      },

      restoreSession: async () => {
        const user = await fetchMe();
        if (user) {
          set({ user, isAuthenticated: true });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
