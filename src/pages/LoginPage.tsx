import { authAPI } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import {
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  SafetyOutlined,
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
  const [resetLoading, setResetLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [resetStep, setResetStep] = useState(1) // 1: 输入邮箱, 2: 输入验证码, 3: 设置新密码
  const [resetEmail, setResetEmail] = useState('')
  const [resetToken, setResetToken] = useState('')


  const handleLogin = async (values: LoginForm) => {
    setLoginLoading(true)
    try {
      const response = await authAPI.login(values.username, values.password)
      if (response.data.success) {
        const { user, access_token } = response.data.data!
        login({
          id: user.user_id.toString(),
          username: user.username,
          email: user.email,
          createdAt: user.created_at.toString(),
          updatedAt: user.updated_at.toString()
        }, access_token)
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

  // 发送重置验证码
  const handleSendResetCode = async (values: { email: string }) => {
    setResetLoading(true)
    try {
      const response = await authAPI.sendVerificationCode(values.email)
      if (response.data.success) {
        message.success('验证码已发送到您的邮箱')
        setResetEmail(values.email)
        setResetStep(2)
      } else {
        message.error(response.data.message)
      }
    } catch (error) {
      console.error('发送验证码失败:', error)
      message.error('发送验证码失败，请稍后重试')
    } finally {
      setResetLoading(false)
    }
  }

  // 验证验证码
  const handleVerifyCode = async (values: { code: string }) => {
    setResetLoading(true)
    try {
      const response = await authAPI.verifyCode(resetEmail, values.code)
      if (response.data.success) {
        message.success('验证码验证成功')
        setResetToken(response.data.data!.reset_token)
        setResetStep(3)
      } else {
        message.error(response.data.message)
      }
    } catch (error) {
      console.error('验证验证码失败:', error)
      message.error('验证码错误或已过期')
    } finally {
      setResetLoading(false)
    }
  }

  // 重置密码
  const handleResetPassword = async (values: { newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    setResetLoading(true)
    try {
      const response = await authAPI.resetPassword(resetToken, values.newPassword)
      if (response.data.success) {
        message.success('密码重置成功！请使用新密码登录')
        setActiveTab('login')
        setResetStep(1)
        setResetEmail('')
        setResetToken('')
      } else {
        message.error(response.data.message)
      }
    } catch (error) {
      console.error('重置密码失败:', error)
      message.error('重置密码失败，请稍后重试')
    } finally {
      setResetLoading(false)
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

              <div className="text-center space-y-2">
                <div>
                  <Button
                    type="link"
                    onClick={() => setActiveTab('reset')}
                    className="p-0 text-sm"
                  >
                    忘记密码？
                  </Button>
                </div>
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

            <TabPane
              tab={
                <span>
                  <SafetyOutlined />
                  重置密码
                </span>
              }
              key="reset"
            >
              {resetStep === 1 && (
                <Form
                  name="sendResetCode"
                  onFinish={handleSendResetCode}
                  layout="vertical"
                  size="large"
                >
                  <div className="text-center mb-4">
                    <Text type="secondary">
                      请输入您的邮箱地址，我们将发送验证码到您的邮箱
                    </Text>
                  </div>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="邮箱地址"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={resetLoading}
                      className="w-full"
                      size="large"
                    >
                      发送验证码
                    </Button>
                  </Form.Item>
                </Form>
              )}

              {resetStep === 2 && (
                <Form
                  name="verifyCode"
                  onFinish={handleVerifyCode}
                  layout="vertical"
                  size="large"
                >
                  <div className="text-center mb-4">
                    <Text type="secondary">
                      验证码已发送到 {resetEmail}，请查收邮件
                    </Text>
                  </div>

                  <Form.Item
                    name="code"
                    rules={[
                      { required: true, message: '请输入验证码' },
                      { len: 6, message: '验证码为6位数字' }
                    ]}
                  >
                    <Input
                      prefix={<SafetyOutlined />}
                      placeholder="6位验证码"
                      maxLength={6}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={resetLoading}
                      className="w-full"
                      size="large"
                    >
                      验证
                    </Button>
                  </Form.Item>

                  <div className="text-center">
                    <Button
                      type="link"
                      onClick={() => setResetStep(1)}
                      className="p-0"
                    >
                      重新发送验证码
                    </Button>
                  </div>
                </Form>
              )}

              {resetStep === 3 && (
                <Form
                  name="resetPassword"
                  onFinish={handleResetPassword}
                  layout="vertical"
                  size="large"
                >
                  <div className="text-center mb-4">
                    <Text type="secondary">
                      请设置您的新密码
                    </Text>
                  </div>

                  <Form.Item
                    name="newPassword"
                    rules={[
                      { required: true, message: '请输入新密码' },
                      { min: 6, message: '密码至少6个字符' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="新密码"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    rules={[
                      { required: true, message: '请确认新密码' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="确认新密码"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={resetLoading}
                      className="w-full"
                      size="large"
                    >
                      重置密码
                    </Button>
                  </Form.Item>
                </Form>
              )}

              <div className="text-center">
                <Text type="secondary">
                  记起密码了？
                  <Button
                    type="link"
                    onClick={() => {
                      setActiveTab('login')
                      setResetStep(1)
                      setResetEmail('')
                      setResetToken('')
                    }}
                    className="p-0"
                  >
                    返回登录
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
