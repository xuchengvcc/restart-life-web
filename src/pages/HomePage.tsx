import { PlayCircleOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Typography } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部banner */}
        <div className="text-center mb-12">
          <Title level={1} className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            重启新生
          </Title>
          <Paragraph className="text-xl text-gray-600 mt-4">
            🎮 一个让你体验无限人生可能的文字模拟测试
          </Paragraph>
          <Paragraph className="text-lg text-gray-500">
            在不同的时代背景下，体验从1800年到2050年间任意年份的人生轨迹
          </Paragraph>
        </div>

        {/* 核心特色 */}
        <Row gutter={[24, 24]} className="mb-12">
          <Col xs={24} md={8}>
            <Card className="h-full text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌍</div>
              <Title level={4}>全球视野</Title>
              <Paragraph>支持全球200+国家和地区选择，体验不同文化背景下的人生</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-full text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⏰</div>
              <Title level={4}>时代穿越</Title>
              <Paragraph>体验1800-2050年间任意年份的时代背景和历史事件</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-full text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎲</div>
              <Title level={4}>智能生成</Title>
              <Paragraph>AI驱动，生成合理且富有挑战性的人生事件</Paragraph>
            </Card>
          </Col>
        </Row>

        {/* 行动按钮 */}
        <div className="text-center">
          <Row gutter={[16, 16]} justify="center">
            <Col>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={() => navigate('/character')}
                className="h-14 px-8 text-lg"
              >
                开始新人生
              </Button>
            </Col>
            <Col>
              <Button
                size="large"
                icon={<UserOutlined />}
                onClick={() => navigate('/game')}
                className="h-14 px-8 text-lg"
              >
                继续游戏
              </Button>
            </Col>
            <Col>
              <Button
                size="large"
                icon={<TrophyOutlined />}
                onClick={() => navigate('/profile')}
                className="h-14 px-8 text-lg"
              >
                查看成就
              </Button>
            </Col>
          </Row>
        </div>

        {/* 游戏介绍 */}
        <div className="mt-16 text-center">
          <Card className="bg-white/70 backdrop-blur-sm">
            <Title level={3}>如何开始你的重启人生？</Title>
            <Row gutter={[32, 32]} className="mt-8">
              <Col xs={24} md={8}>
                <div className="text-3xl mb-4">1️⃣</div>
                <Title level={4}>创建角色</Title>
                <Paragraph>选择出生国家、年代，设定初始属性</Paragraph>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-3xl mb-4">2️⃣</div>
                <Title level={4}>体验人生</Title>
                <Paragraph>经历各种事件，做出重要决策</Paragraph>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-3xl mb-4">3️⃣</div>
                <Title level={4}>回顾总结</Title>
                <Paragraph>完成人生后查看总结和成就</Paragraph>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomePage
