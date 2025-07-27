import { useAuthStore } from '@/stores/authStore'
import { ControlOutlined, HomeOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Menu } from 'antd'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Navigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, logout } = useAuthStore()

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/game',
      icon: <ControlOutlined />,
      label: '游戏',
    },
    {
      key: '/character',
      icon: <UserOutlined />,
      label: '角色',
    },
    {
      key: '/profile',
      icon: <SettingOutlined />,
      label: '个人中心',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center">
        <div className="text-white text-xl font-bold mr-8">重启人生</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="flex-1"
        />
      </div>
      <div>
        {isAuthenticated ? (
          <Button type="primary" ghost onClick={handleLogout}>
            退出登录
          </Button>
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
