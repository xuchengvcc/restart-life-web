import type { User } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        console.log('执行登录，设置状态:', { user: user.username, token: token.substring(0, 20) + '...' })
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        console.log('执行登出，清理状态')
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      // 添加onRehydrateStorage来确保状态正确恢复
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 检查localStorage和状态中的token
          const storedToken = localStorage.getItem('token')

          console.log('状态恢复检查:', {
            hasZustandToken: !!state.token,
            hasStoredToken: !!storedToken,
            isAuthenticated: state.isAuthenticated
          })

          if (state.token || storedToken) {
            // 如果有token，确保isAuthenticated为true
            state.isAuthenticated = true
            // 如果zustand状态中没有token但localStorage有，则同步
            if (!state.token && storedToken) {
              state.token = storedToken
            }
            console.log('恢复认证状态为true')
          } else {
            // 如果没有token，确保清理状态
            state.isAuthenticated = false
            state.user = null
            state.token = null
            console.log('清理认证状态')
          }

          console.log('最终状态恢复结果:', {
            isAuthenticated: state.isAuthenticated,
            hasToken: !!state.token,
            hasStoredToken: !!storedToken
          })
        }
      },
    }
  )
)
