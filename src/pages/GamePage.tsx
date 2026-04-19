import { gameAPI } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import { useGameStore } from '@/stores/gameStore'
import type { DecisionOptionType, Event, GameState } from '@/types'
import {
  BulbOutlined,
  HeartOutlined,
  HomeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  SmileOutlined,
  StepForwardOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  List,
  message,
  Modal,
  Progress,
  Radio,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Timeline,
  Typography,
} from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const { Title, Text, Paragraph } = Typography

interface DecisionChoiceItem {
  key: DecisionOptionType
  title: string
  consequence: string
}

const getErrorText = (error: unknown, fallback: string) => {
  const maybeAxios = error as { response?: { data?: { error?: { message?: string }; message?: string } } }
  return maybeAxios?.response?.data?.error?.message || maybeAxios?.response?.data?.message || fallback
}

const GamePage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { setGameState: setStoreGameState } = useGameStore()

  const [loading, setLoading] = useState(false)
  const [localGameState, setLocalGameState] = useState<GameState | null>(null)
  const [gameHistory, setGameHistory] = useState<Event[]>([])
  const [decisionModalVisible, setDecisionModalVisible] = useState(false)
  const [selectedOptionType, setSelectedOptionType] = useState<DecisionOptionType | ''>('')
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (characterId) {
      void loadGameState()
    }
  }, [isAuthenticated, characterId, navigate])

  const loadGameState = async () => {
    if (!characterId) return
    setLoading(true)
    try {
      const [stateRes, historyRes] = await Promise.all([
        gameAPI.getState(characterId),
        gameAPI.getHistory(characterId),
      ])

      if (stateRes.data.success && stateRes.data.data) {
        setLocalGameState(stateRes.data.data)
        setStoreGameState(stateRes.data.data)
        const hasDecision = !!stateRes.data.data.pending_decision
        setDecisionModalVisible(hasDecision)
        if (!hasDecision) setSelectedOptionType('')
      }

      if (historyRes.data.success) {
        setGameHistory(historyRes.data.data || [])
      }
    } catch (error) {
      message.error(getErrorText(error, 'Failed to load game state'))
    } finally {
      setLoading(false)
    }
  }

  const handleNextTurn = async () => {
    if (!characterId || !localGameState) return
    setLoading(true)
    try {
      const response = await gameAPI.nextTurn(characterId)
      if (response.data.success && response.data.data) {
        const nextState = response.data.data
        setLocalGameState(nextState)
        setStoreGameState(nextState)
        setDecisionModalVisible(!!nextState.pending_decision)
        if (!nextState.pending_decision) {
          setSelectedOptionType('')
          message.success('Year advanced')
        } else {
          message.info('Decision required before next year')
        }
        await refreshHistory()
      } else {
        message.error(response.data.error?.message || response.data.message || 'Advance failed')
      }
    } catch (error) {
      message.error(getErrorText(error, 'Advance failed'))
    } finally {
      setLoading(false)
    }
  }

  const refreshHistory = async () => {
    if (!characterId) return
    const historyRes = await gameAPI.getHistory(characterId)
    if (historyRes.data.success) {
      setGameHistory(historyRes.data.data || [])
    }
  }

  const handleMakeDecision = async () => {
    if (!characterId || !selectedOptionType) return
    setLoading(true)
    try {
      const response = await gameAPI.makeDecision(characterId, selectedOptionType)
      if (response.data.success && response.data.data) {
        const nextState = response.data.data
        setLocalGameState(nextState)
        setStoreGameState(nextState)
        setDecisionModalVisible(!!nextState.pending_decision)
        setSelectedOptionType('')
        await refreshHistory()
        message.success('Decision applied')
      } else {
        message.error(response.data.error?.message || response.data.message || 'Decision failed')
      }
    } catch (error) {
      message.error(getErrorText(error, 'Decision failed'))
    } finally {
      setLoading(false)
    }
  }

  const decisionChoices = useMemo<DecisionChoiceItem[]>(() => {
    const options = localGameState?.pending_decision?.options
    if (!options) return []
    return [
      {
        key: 'conservative',
        title: options.conservative.option_text,
        consequence: options.conservative.consequence,
      },
      {
        key: 'moderate',
        title: options.moderate.option_text,
        consequence: options.moderate.consequence,
      },
      {
        key: 'aggressive',
        title: options.aggressive.option_text,
        consequence: options.aggressive.consequence,
      },
    ]
  }, [localGameState?.pending_decision?.options])

  const latestEvent = useMemo(() => {
    if (!localGameState?.key_events?.length) return null
    return localGameState.key_events[localGameState.key_events.length - 1]
  }, [localGameState?.key_events])

  if (loading && !localGameState) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!localGameState) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <Title level={3}>Character Not Found</Title>
            <Button type="primary" onClick={() => navigate('/character')}>
              Back to Characters
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const character = localGameState
  const attrs = character.attributes
  const intelligence = attrs.intelligence ?? 0
  const emotional = attrs.emotional_intelligence ?? 0
  const fitness = attrs.physical_fitness ?? 0
  const imagination = attrs.imagination ?? 0

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title="Character" className="mb-6">
            <div className="mb-4 text-center">
              <Avatar size={64} className="mb-2">
                {character.character_name[0]}
              </Avatar>
              <Title level={4}>{character.character_name}</Title>
              <Text type="secondary">
                Age {character.current_age} · {character.birth_country}
              </Text>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="Age" value={character.current_age} />
              </Col>
              <Col span={12}>
                <Statistic title="Playtime" value={character.total_playtime} />
              </Col>
              <Col span={12}>
                <Statistic title="Money" value={character.money} />
              </Col>
              <Col span={12}>
                <Statistic title="Life Stage" value={character.life_stage} />
              </Col>
            </Row>
          </Card>

          <Card title="Attributes">
            <Space direction="vertical" className="w-full" size="middle">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Text>
                    <HeartOutlined className="mr-2 text-red-500" />
                    Emotional
                  </Text>
                  <Text strong>{emotional}/100</Text>
                </div>
                <Progress percent={emotional} strokeColor="#ff4d4f" showInfo={false} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Text>
                    <BulbOutlined className="mr-2 text-blue-500" />
                    Intelligence
                  </Text>
                  <Text strong>{intelligence}/100</Text>
                </div>
                <Progress percent={intelligence} strokeColor="#1890ff" showInfo={false} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Text>
                    <ThunderboltOutlined className="mr-2 text-orange-500" />
                    Fitness
                  </Text>
                  <Text strong>{fitness}/100</Text>
                </div>
                <Progress percent={fitness} strokeColor="#fa8c16" showInfo={false} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Text>
                    <SmileOutlined className="mr-2 text-green-500" />
                    Imagination
                  </Text>
                  <Text strong>{imagination}/100</Text>
                </div>
                <Progress percent={imagination} strokeColor="#52c41a" showInfo={false} />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Game Controls" className="mb-6">
            <div className="text-center">
              <Space size="large">
                <Button
                  type="primary"
                  size="large"
                  icon={<StepForwardOutlined />}
                  onClick={handleNextTurn}
                  loading={loading}
                  disabled={character.game_completed || !!character.pending_decision}
                >
                  Next Year
                </Button>

                {!isPlaying ? (
                  <Button
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={() => {
                      setIsPlaying(true)
                      message.info('Auto mode is not implemented yet')
                    }}
                    disabled={character.game_completed}
                  >
                    Auto
                  </Button>
                ) : (
                  <Button size="large" icon={<PauseCircleOutlined />} onClick={() => setIsPlaying(false)}>
                    Pause
                  </Button>
                )}

                <Button icon={<SettingOutlined />} size="large">
                  Settings
                </Button>
              </Space>

              {character.pending_decision && (
                <div className="mt-4">
                  <Tag color="orange" className="px-4 py-2 text-base">
                    Decision Required
                  </Tag>
                </div>
              )}

              {character.game_completed && (
                <div className="mt-4">
                  <Tag color="red" className="px-4 py-2 text-lg">
                    Game Completed
                  </Tag>
                </div>
              )}
            </div>
          </Card>

          <Card title="Latest Event" className="mb-6">
            {latestEvent ? (
              <>
                <Paragraph>{latestEvent.description}</Paragraph>
                <Text type="secondary">{latestEvent.impact}</Text>
              </>
            ) : (
              <Text type="secondary">No events yet.</Text>
            )}
          </Card>

          <Card title="Recent Events">
            <List
              dataSource={gameHistory.slice(0, 8)}
              renderItem={(event) => (
                <List.Item>
                  <List.Item.Meta title={`Age ${event.age}`} description={event.description} />
                </List.Item>
              )}
              locale={{ emptyText: 'No events yet.' }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card title="Timeline" className="h-fit">
            <Timeline
              items={gameHistory.map((event) => ({
                children: (
                  <div>
                    <Text strong>Age {event.age}</Text>
                    <div className="mt-1 text-sm text-gray-600">{event.description}</div>
                  </div>
                ),
              }))}
            />
            {gameHistory.length === 0 && <div className="py-8 text-center text-gray-500">Start your life journey...</div>}
          </Card>
        </Col>
      </Row>

      <div className="fixed bottom-6 right-6">
        <Space direction="vertical">
          <Button type="primary" shape="circle" size="large" icon={<HomeOutlined />} onClick={() => navigate('/')} />
        </Space>
      </div>

      <Modal
        title="Make A Decision"
        open={decisionModalVisible}
        onOk={handleMakeDecision}
        onCancel={() => setDecisionModalVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{ disabled: !selectedOptionType }}
      >
        <Paragraph>
          A decision is pending for this year. Choose one option to continue.
        </Paragraph>
        <Divider />
        <Radio.Group value={selectedOptionType} onChange={(e) => setSelectedOptionType(e.target.value)}>
          <Space direction="vertical" className="w-full">
            {decisionChoices.map((choice) => (
              <Radio key={choice.key} value={choice.key}>
                <div>
                  <div>{choice.title || choice.key}</div>
                  <div className="mt-1 text-sm text-gray-500">{choice.consequence}</div>
                </div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Modal>
    </div>
  )
}

export default GamePage
