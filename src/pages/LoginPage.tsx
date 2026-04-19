import { authAPI } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import { LockOutlined, MailOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Tabs, Typography, message } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

type LoginForm = {
  username: string
  password: string
}

type RegisterForm = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [resetStep, setResetStep] = useState(1)
  const [resetEmail, setResetEmail] = useState('')
  const [resetToken, setResetToken] = useState('')

  const handleLogin = async (values: LoginForm) => {
    setLoading(true)
    try {
      const response = await authAPI.login(values.username, values.password)
      if (!response.data.success || !response.data.data) {
        message.error(response.data.message || 'Login failed')
        return
      }
      const payload = response.data.data
      login(
        {
          id: String(payload.user.user_id),
          username: payload.user.username,
          email: payload.user.email,
          createdAt: String(payload.user.created_at),
          updatedAt: String(payload.user.updated_at),
        },
        payload.access_token,
        payload.refresh_token
      )
      message.success('Login successful')
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
      message.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (values: RegisterForm) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const response = await authAPI.register(values.username, values.email, values.password)
      if (!response.data.success) {
        message.error(response.data.message || 'Register failed')
        return
      }
      message.success('Register successful, please login')
      setActiveTab('login')
    } catch (error) {
      console.error('Register failed:', error)
      message.error('Register failed')
    } finally {
      setLoading(false)
    }
  }

  const sendResetCode = async (values: { email: string }) => {
    setLoading(true)
    try {
      const response = await authAPI.sendVerificationCode(values.email)
      if (!response.data.success) {
        message.error(response.data.message || 'Failed to send code')
        return
      }
      setResetEmail(values.email)
      setResetStep(2)
      message.success('Verification code sent')
    } catch (error) {
      console.error('Send code failed:', error)
      message.error('Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async (values: { code: string }) => {
    setLoading(true)
    try {
      const response = await authAPI.verifyCode(resetEmail, values.code)
      if (!response.data.success || !response.data.data) {
        message.error(response.data.message || 'Verification failed')
        return
      }
      setResetToken(response.data.data.reset_token)
      setResetStep(3)
      message.success('Code verified')
    } catch (error) {
      console.error('Verify code failed:', error)
      message.error('Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (values: { newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const response = await authAPI.resetPassword(resetToken, values.newPassword)
      if (!response.data.success) {
        message.error(response.data.message || 'Reset password failed')
        return
      }
      message.success('Password reset successful')
      setActiveTab('login')
      setResetStep(1)
      setResetEmail('')
      setResetToken('')
    } catch (error) {
      console.error('Reset password failed:', error)
      message.error('Reset password failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={1}>Restart Life</Title>
          <Text type="secondary">Start your next life simulation journey.</Text>
        </div>

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab} centered items={[
            {
              key: 'login',
              label: 'Login',
              children: (
                <Form layout="vertical" onFinish={handleLogin}>
                  <Form.Item name="username" rules={[{ required: true, message: 'Username is required' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, message: 'Password is required' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                    Login
                  </Button>
                </Form>
              ),
            },
            {
              key: 'register',
              label: 'Register',
              children: (
                <Form layout="vertical" onFinish={handleRegister}>
                  <Form.Item name="username" rules={[{ required: true }]}>
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                  </Form.Item>
                  <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, min: 6 }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                  </Form.Item>
                  <Form.Item name="confirmPassword" rules={[{ required: true, min: 6 }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                    Register
                  </Button>
                </Form>
              ),
            },
            {
              key: 'reset',
              label: 'Reset Password',
              children: (
                <>
                  {resetStep === 1 && (
                    <Form layout="vertical" onFinish={sendResetCode}>
                      <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                        Send Code
                      </Button>
                    </Form>
                  )}
                  {resetStep === 2 && (
                    <Form layout="vertical" onFinish={verifyCode}>
                      <Form.Item name="code" rules={[{ required: true, len: 6 }]}>
                        <Input prefix={<SafetyOutlined />} placeholder="6-digit code" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                        Verify
                      </Button>
                    </Form>
                  )}
                  {resetStep === 3 && (
                    <Form layout="vertical" onFinish={resetPassword}>
                      <Form.Item name="newPassword" rules={[{ required: true, min: 6 }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="New password" />
                      </Form.Item>
                      <Form.Item name="confirmPassword" rules={[{ required: true, min: 6 }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                        Reset Password
                      </Button>
                    </Form>
                  )}
                </>
              ),
            },
          ]} />
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
