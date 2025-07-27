import { useAuthStore } from '@/stores/authStore'
import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, token, login } = useAuthStore()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuthState = async () => {
            // 延迟一点时间让Zustand状态恢复
            await new Promise(resolve => setTimeout(resolve, 300))

            const storedToken = localStorage.getItem('token')

            console.log('ProtectedRoute 认证状态检查:', {
                currentPath: location.pathname,
                isAuthenticated,
                hasZustandToken: !!token,
                hasStoredToken: !!storedToken,
                timestamp: new Date().toISOString()
            })

            // 如果localStorage有token但Zustand状态还没恢复，主动恢复
            if (storedToken && (!isAuthenticated || !token)) {
                console.log('发现localStorage有token但状态未恢复，执行状态恢复')
                // 使用存储的token恢复状态
                login({
                    id: 'restored-user',
                    username: 'restored',
                    email: '',
                    createdAt: '',
                    updatedAt: ''
                }, storedToken)

                // 再等一点时间让状态更新
                await new Promise(resolve => setTimeout(resolve, 100))
            }

            setIsLoading(false)
        }

        checkAuthState()
    }, [location.pathname]) // 只监听路径变化，避免循环依赖

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" tip="验证登录状态..." />
            </div>
        )
    }

    // 检查认证状态
    const storedToken = localStorage.getItem('token')
    const hasValidAuth = isAuthenticated && token && storedToken

    if (!hasValidAuth) {
        console.log('认证验证失败，重定向到登录页:', {
            isAuthenticated,
            hasToken: !!token,
            hasStoredToken: !!storedToken,
            path: location.pathname
        })
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    console.log('认证验证成功，渲染受保护内容:', {
        isAuthenticated,
        hasToken: !!token,
        hasStoredToken: !!storedToken,
        path: location.pathname
    })

    return <>{children}</>
}

export default ProtectedRoute
