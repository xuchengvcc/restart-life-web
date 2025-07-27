import { authAPI } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import {
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  UserAddOutlined,
  UserOutlined
} from '@ant-design/icons'
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Tabs,
  Typography
} from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography
const { TabPane } = Tabs

interface LoginForm {
  username: string
  password: string
}

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')

  const handleLogin = async (values: LoginForm) => {
    setLoginLoading(true)
    try {
      const response = await authAPI.login(values.username, values.password)
      if (response.data.success) {
        const { token } = response.data.data!
        login({
          id: '1', // 这里应该从后端返回
          username: values.username,
          email: '',
          createdAt: '',
          updatedAt: ''
        }, token)
        message.success('登录成功！')
        navigate('/')
      } else {
        message.error(response.data.message)
      }
    } catch (error) {
      console.error('登录失败:', error)
      message.error('登录失败，请检查用户名和密码')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (values: RegisterForm) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    setRegisterLoading(true)
    try {
      const response = await authAPI.register(values.username, values.email, values.password)
      if (response.data.success) {
        message.success('注册成功！请登录')
        setActiveTab('login')
      } else {
        message.error(response.data.message)
      }
    } catch (error) {
      console.error('注册失败:', error)
      message.error('注册失败，请稍后重试')
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            重启人生
          </Title>
          <Text className="text-lg text-gray-600">
            开始你的无限人生可能
          </Text>
        </div>

        <Card className="shadow-lg">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            size="large"
          >
            <TabPane
              tab={
                <span>
                  <LoginOutlined />
                  登录
                </span>
              }
              key="login"
            >
              <Form
                name="login"
                onFinish={handleLogin}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="用户名"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="密码"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loginLoading}
                    className="w-full"
                    size="large"
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-center">
                <Text type="secondary">
                  还没有账号？
                  <Button
                    type="link"
                    onClick={() => setActiveTab('register')}
                    className="p-0"
                  >
                    立即注册
                  </Button>
                </Text>
              </div>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <UserAddOutlined />
                  注册
                </span>
              }
              key="register"
            >
              <Form
                name="register"
                onFinish={handleRegister}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' },
                    { max: 20, message: '用户名最多20个字符' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="用户名"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="邮箱"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="密码"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  rules={[
                    { required: true, message: '请确认密码' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="确认密码"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={registerLoading}
                    className="w-full"
                    size="large"
                  >
                    注册
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-center">
                <Text type="secondary">
                  已有账号？
                  <Button
                    type="link"
                    onClick={() => setActiveTab('login')}
                    className="p-0"
                  >
                    立即登录
                  </Button>
                </Text>
              </div>
            </TabPane>
          </Tabs>
        </Card>

        <div className="text-center mt-6">
          <Text type="secondary" className="text-sm">
            © 2025 重启人生团队. 体验无限人生可能
          </Text>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
