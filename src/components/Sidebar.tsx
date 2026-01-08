import {
    BookOutlined,
    ControlOutlined,
    HomeOutlined,
    SettingOutlined,
    StarOutlined,
    TrophyOutlined,
    UserOutlined
} from '@ant-design/icons'
import { Menu, MenuProps } from 'antd'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const menuItems: MenuItem[] = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: '首页',
        },
        {
            key: '/character',
            icon: <UserOutlined />,
            label: '我的角色',
        },
        {
            key: '/game',
            icon: <ControlOutlined />,
            label: '游戏中心',
        },
        {
            key: '/profile',
            icon: <SettingOutlined />,
            label: '个人中心',
        },
        {
            type: 'divider',
        },
        {
            key: 'features',
            label: '功能',
            type: 'group',
            children: [
                {
                    key: '/achievements',
                    icon: <TrophyOutlined />,
                    label: '成就系统',
                },
                {
                    key: '/guide',
                    icon: <BookOutlined />,
                    label: '游戏指南',
                },
                {
                    key: '/favorites',
                    icon: <StarOutlined />,
                    label: '我的收藏',
                },
            ],
        },
    ]

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key)
    }

    return (
        <div className="h-full">
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                className="h-full border-0"
                style={{
                    backgroundColor: 'rgb(17, 24, 39)',
                    padding: '8px 0'
                }}
            />
        </div>
    )
}

export default Sidebar
