import { useAuthStore } from '@/stores/authStore'
import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Input, Space } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navigation: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <div className="flex justify-between items-center h-16 px-6 bg-gray-900">
      {/* Logo */}
      <div
        className="text-white text-xl font-bold cursor-pointer hover:text-blue-400 transition-colors"
        onClick={() => navigate('/')}
      >
        重启人生
      </div>

      {/* 搜索框 */}
      <div className="flex-1 max-w-md mx-8">
        <Input
          placeholder="搜索角色、存档..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="bg-gray-800 border-gray-700 text-white"
          style={{
            backgroundColor: 'rgb(31, 41, 55)',
            borderColor: 'rgb(75, 85, 99)',
            color: 'white'
          }}
        />
      </div>

      {/* 右侧用户区域 */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Button
              type="text"
              icon={<BellOutlined />}
              className="text-gray-300 hover:text-white"
            />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer text-white hover:text-blue-400 transition-colors">
                <Avatar size="small" icon={<UserOutlined />} />
                <span>{user?.username || '用户'}</span>
              </Space>
            </Dropdown>
          </>
        ) : (
          <div className="space-x-2">
            <Button type="primary" ghost onClick={() => navigate('/login')}>
              登录
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              注册
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navigation
