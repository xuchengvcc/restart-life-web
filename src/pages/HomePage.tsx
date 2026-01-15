import { PlayCircleOutlined, TrophyOutlined, UserOutlined, RocketOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Typography, Carousel } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const carouselItems = [
    {
      title: '开启全新人生旅程',
      subtitle: '在不同的时代背景下体验人生',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => navigate('/character')
    },
    {
      title: 'AI智能决策系统',
      subtitle: '让AI帮助你做出最佳人生选择',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      action: () => navigate('/character')
    },
    {
      title: '成就收集系统',
      subtitle: '解锁各种人生成就，记录精彩时刻',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      action: () => navigate('/profile')
    }
  ]

  const featureCards = [
    {
      icon: <UserOutlined className="text-4xl text-blue-500" />,
      title: '角色创建',
      description: '创建独特的角色，选择出生时代和背景',
      action: () => navigate('/character')
    },
    {
      icon: <PlayCircleOutlined className="text-4xl text-green-500" />,
      title: '开始游戏',
      description: '体验从婴儿到老年的完整人生历程',
      action: () => navigate('/character')
    },
    {
      icon: <TrophyOutlined className="text-4xl text-yellow-500" />,
      title: '成就系统',
      description: '解锁各种成就，记录你的人生里程碑',
      action: () => navigate('/profile')
    },
    {
      icon: <RocketOutlined className="text-4xl text-purple-500" />,
      title: 'AI 决策',
      description: '智能AI助手帮你分析和规划人生道路',
      action: () => navigate('/character')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Title
            level={1}
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            重启新生
          </Title>
          <Paragraph className="text-xl text-gray-600 mt-4">
            🎮 一个让你体验无限人生可能的文字模拟测试
          </Paragraph>
          <Paragraph className="text-lg text-gray-500">
            在不同的时代背景下，体验从1800年到2050年间任意年份的人生轨迹
          </Paragraph>
        </div>
      </div>

      <div className="px-4 pb-12">
        <div className="max-w-6xl mx-auto h-96 relative overflow-hidden">
          <Carousel autoplay className="h-full">
            {carouselItems.map((item, index) => (
              <div key={index}>
                <div
                  className="h-96 flex items-center justify-center relative"
                  style={{ background: item.background }}
                >
                  <div className="text-center text-white z-10">
                    <Title level={1} className="text-white mb-4 text-5xl font-bold">
                      {item.title}
                    </Title>
                    <Paragraph className="text-xl text-gray-100 mb-8">
                      {item.subtitle}
                    </Paragraph>
                    <Button
                      type="primary"
                      size="large"
                      className="px-8 py-2 h-auto text-lg"
                      onClick={item.action}
                    >
                      立即体验
                    </Button>
                  </div>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-white rounded-lg rotate-45"></div>
                    <div className="absolute top-1/2 right-10 w-12 h-12 border-2 border-white rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2} className="text-4xl font-bold mb-4">
              探索无限人生可能
            </Title>
            <Paragraph className="text-lg text-gray-600">
              从1800年到2050年，体验不同时代的人生轨迹
            </Paragraph>
          </div>
          <Row gutter={[32, 32]}>
            {featureCards.map((card, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  className="h-full text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  bordered={false}
                >
                  <div className="mb-4">
                    {card.icon}
                  </div>
                  <Title level={4} className="mb-3">
                    {card.title}
                  </Title>
                  <Paragraph className="text-gray-600 mb-4">
                    {card.description}
                  </Paragraph>
                  <Button type="primary" ghost onClick={card.action}>
                    了解更多
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="bg-gray-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Row gutter={[32, 32]} className="text-center">
            <Col xs={12} sm={6}>
              <div>
                <Title level={2} className="text-white text-4xl mb-2">1000+</Title>
                <Paragraph className="text-gray-300">创建角色</Paragraph>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div>
                <Title level={2} className="text-white text-4xl mb-2">250</Title>
                <Paragraph className="text-gray-300">年历史跨度</Paragraph>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div>
                <Title level={2} className="text-white text-4xl mb-2">50+</Title>
                <Paragraph className="text-gray-300">成就类型</Paragraph>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div>
                <Title level={2} className="text-white text-4xl mb-2">AI</Title>
                <Paragraph className="text-gray-300">智能助手</Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default HomePage
