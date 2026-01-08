import type { User } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
  setInitialized: (initialized: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
      login: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true, isInitialized: true })
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false, isInitialized: true })
      },
      setUser: (user) => set({ user }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 简单检查：如果localStorage有token，就认为已登录
          const storedToken = localStorage.getItem('token')
          if (storedToken) {
            state.isAuthenticated = true
            state.token = storedToken
          }
          state.setInitialized(true)
        }
      },
    }
  )
)
