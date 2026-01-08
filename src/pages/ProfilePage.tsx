import { characterAPI } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import type { Character } from '@/types'
import {
  ClockCircleOutlined,
  ControlOutlined,
  EditOutlined,
  LogoutOutlined,
  MailOutlined,
  SettingOutlined,
  TrophyOutlined,
  UserOutlined
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, isInitialized } = useAuthStore()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    // 等待状态初始化完成
    if (!isInitialized) return

    // 检查认证状态
    if (!isAuthenticated) {
      console.log('ProfilePage: 未认证，跳转到登录页')
      navigate('/login')
      return
    }

    console.log('ProfilePage: 已认证，加载用户数据')
    loadUserData()
  }, [isAuthenticated, isInitialized, navigate])

  const loadUserData = async () => {
    setLoading(true)
    try {
      const response = await characterAPI.getByUser()
      if (response.data.success) {
        // 处理后端返回的数据结构：{ characters: [...], total: number }
        const responseData = response.data.data
        if (responseData && responseData.characters) {
          setCharacters(responseData.characters)
        } else {
          setCharacters([])
        }
      }
    } catch (error) {
      console.error('加载用户数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出登录',
      content: '你确定要退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        logout()
        message.success('已退出登录')
        navigate('/')
      }
    })
  }

  const handleEditProfile = () => {
    form.setFieldsValue({
      username: user?.username,
      email: user?.email
    })
    setEditModalVisible(true)
  }

  const handleUpdateProfile = async () => {
    try {
      // 这里应该调用更新用户信息的API
      message.success('个人信息更新成功')
      setEditModalVisible(false)
    } catch (error) {
      message.error('更新失败，请稍后重试')
    }
  }

  // 统计数据
  const totalCharacters = characters.length
  const completedCharacters = characters.filter(c => c.game_completed).length
  const totalPlaytime = characters.reduce((sum, c) => sum + c.total_playtime, 0)
  const averageAge = characters.length > 0
    ? Math.round(characters.reduce((sum, c) => sum + c.current_age, 0) / characters.length)
    : 0

  // 成就系统（示例）
  const achievements = [
    {
      id: 1,
      name: '初次体验',
      description: '创建你的第一个角色',
      unlocked: totalCharacters > 0,
      icon: '🎭'
    },
    {
      id: 2,
      name: '人生导师',
      description: '完成一次完整的人生',
      unlocked: completedCharacters > 0,
      icon: '🎓'
    },
    {
      id: 3,
      name: '时间旅行者',
      description: '累计游戏时间超过100年',
      unlocked: totalPlaytime >= 100,
      icon: '⏰'
    },
    {
      id: 4,
      name: '角色收集家',
      description: '创建5个不同的角色',
      unlocked: totalCharacters >= 5,
      icon: '👥'
    },
    {
      id: 5,
      name: '长寿专家',
      description: '平均年龄超过80岁',
      unlocked: averageAge >= 80,
      icon: '🏆'
    }
  ]

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const achievementProgress = Math.round((unlockedAchievements.length / achievements.length) * 100)

  const characterColumns = [
    {
      title: '角色名',
      dataIndex: 'character_name',
      key: 'character_name',
    },
    {
      title: '年龄',
      dataIndex: 'current_age',
      key: 'current_age',
      render: (age: number) => `${age}岁`
    },
    {
      title: '出生地',
      key: 'birth_info',
      render: (record: Character) => `${record.birth_country} (${record.birth_year}年)`
    },
    {
      title: '游戏时长',
      dataIndex: 'total_playtime',
      key: 'total_playtime',
      render: (playtime: number) => `${playtime}年`
    },
    {
      title: '状态',
      dataIndex: 'game_completed',
      key: 'game_completed',
      render: (completed: boolean) => (
        <Tag color={completed ? 'red' : 'green'}>
          {completed ? '已完成' : '进行中'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Character) => (
        <Button
          type="link"
          onClick={() => navigate(`/game/${record.character_id}`)}
        >
          查看详情
        </Button>
      )
    }
  ]

  // 等待状态初始化完成
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="正在加载..." />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <Title level={3}>请先登录</Title>
            <Button type="primary" onClick={() => navigate('/login')}>
              去登录
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="pl-4 pr-6 py-6">
      <Title level={2}>个人中心</Title>

      {/* 用户信息 */}
      <Card title="个人信息" className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar size={80} icon={<UserOutlined />} />
            <div>
              <Title level={4} className="mb-1">{user.username}</Title>
              <Text type="secondary">{user.email}</Text>
            </div>
          </div>
          <Space>
            <Button icon={<EditOutlined />} onClick={handleEditProfile}>
              编辑资料
            </Button>
            <Button icon={<SettingOutlined />}>
              设置
            </Button>
            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
              退出登录
            </Button>
          </Space>
        </div>
      </Card>

      {/* 游戏统计 */}
      <Card title="游戏统计" className="mb-6">
        <Row gutter={[24, 16]}>
          <Col xs={12} sm={6}>
            <Statistic
              title="角色数量"
              value={totalCharacters}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="完成数量"
              value={completedCharacters}
              prefix={<TrophyOutlined />}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="总游戏时间"
              value={totalPlaytime}
              suffix="年"
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="平均年龄"
              value={averageAge}
              suffix="岁"
              prefix={<ControlOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* 成就系统 */}
      <Card title="成就系统" className="mb-6">
        <div className="mb-4">
          <Text>成就进度: {unlockedAchievements.length}/{achievements.length}</Text>
          <Progress
            percent={achievementProgress}
            className="mt-2"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>

        <Row gutter={[16, 16]}>
          {achievements.map(achievement => (
            <Col xs={24} sm={12} md={8} lg={6} key={achievement.id}>
              <Card
                size="small"
                className={achievement.unlocked ? 'bg-green-50' : 'bg-gray-50'}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <Text strong className={achievement.unlocked ? 'text-green-600' : 'text-gray-400'}>
                    {achievement.name}
                  </Text>
                  <div className="text-sm text-gray-500 mt-1">
                    {achievement.description}
                  </div>
                  {achievement.unlocked && (
                    <Tag color="green" className="mt-2">已解锁</Tag>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 我的角色 */}
      <Card title="我的角色">
        <Table
          dataSource={characters}
          columns={characterColumns}
          rowKey="character_id"
          pagination={{ pageSize: 10 }}
          loading={loading}
          locale={{ emptyText: '还没有创建角色，快去创建你的第一个角色吧！' }}
        />
      </Card>

      {/* 编辑个人信息弹窗 */}
      <Modal
        title="编辑个人信息"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setEditModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProfilePage
