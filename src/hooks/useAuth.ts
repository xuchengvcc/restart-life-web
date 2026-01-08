import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'

export function useAuth() {
    const { isAuthenticated, login, setInitialized } = useAuthStore()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const initAuth = () => {
            const storedToken = localStorage.getItem('token')

            // 如果localStorage有token但Zustand状态未认证，恢复状态
            if (storedToken && !isAuthenticated) {
                console.log('发现token但状态未认证，恢复认证状态')
                login({
                    id: 'restored-user',
                    username: 'restored',
                    email: '',
                    createdAt: '',
                    updatedAt: ''
                }, storedToken)
            }

            setInitialized(true)
            setIsReady(true)
        }

        // 立即执行，不延迟
        initAuth()
    }, [isAuthenticated, login, setInitialized]) // 依赖认证状态

    const hasValidToken = !!localStorage.getItem('token')
    const isLoggedIn = isAuthenticated || hasValidToken

    return {
        isLoggedIn,
        isReady,
        isAuthenticated,
        hasValidToken
    }
}
