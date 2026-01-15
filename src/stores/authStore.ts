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
        console.log('执行登录，设置状态:', { user: user.username, token: token.substring(0, 20) + '...' })
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true, isInitialized: true })
      },
      logout: () => {
        console.log('执行登出，清理状态')
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false, isInitialized: true })
      },
      setUser: (user) => set({ user }),
      setInitialized: (initialized) => set({ isInitialized: initialized })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const storedToken = localStorage.getItem('token')

          if (state.token || storedToken) {
            state.isAuthenticated = true
            if (!state.token && storedToken) {
              state.token = storedToken
            }
          } else {
            state.isAuthenticated = false
            state.user = null
            state.token = null
          }

          state.setInitialized?.(true)
        }
      }
    }
  )
)
