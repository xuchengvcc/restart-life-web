import { useAuthStore } from '@/stores/authStore'
import { Button, Card, Typography } from 'antd'
import React from 'react'

const { Title, Paragraph, Text } = Typography

const AuthDebugPage: React.FC = () => {
    const { user, token, isAuthenticated, login, logout } = useAuthStore()

    const handleTestLogin = () => {
        // 创建一个测试用户
        const testUser = {
            id: 'test-user-1',
            username: 'testuser',
            email: 'test@example.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        // 生成一个测试token
        const testToken = 'test-token-' + Date.now()

        login(testUser, testToken)
    }

    const handleLogout = () => {
        logout()
    }

    const storedToken = localStorage.getItem('token')

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card>
                <Title level={2}>认证状态调试</Title>

                <div className="mb-4">
                    <Title level={4}>当前状态：</Title>
                    <Paragraph>
                        <Text strong>isAuthenticated:</Text> {isAuthenticated ? '✅ true' : '❌ false'}
                    </Paragraph>
                    <Paragraph>
                        <Text strong>token (zustand):</Text> {token ? `✅ ${token.substring(0, 20)}...` : '❌ null'}
                    </Paragraph>
                    <Paragraph>
                        <Text strong>token (localStorage):</Text> {storedToken ? `✅ ${storedToken.substring(0, 20)}...` : '❌ null'}
                    </Paragraph>
                    <Paragraph>
                        <Text strong>user:</Text> {user ? `✅ ${user.username} (${user.email})` : '❌ null'}
                    </Paragraph>
                </div>

                <div className="space-x-4">
                    <Button type="primary" onClick={handleTestLogin}>
                        测试登录
                    </Button>
                    <Button danger onClick={handleLogout}>
                        登出
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                        刷新页面
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default AuthDebugPage
