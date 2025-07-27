import { gameAPI } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import { useGameStore } from '@/stores/gameStore'
import type { GameEvent, GameState } from '@/types'
import {
    BulbOutlined,
    HeartOutlined,
    HomeOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    SettingOutlined,
    SmileOutlined,
    StepForwardOutlined,
    ThunderboltOutlined
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
    Typography
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const { Title, Text, Paragraph } = Typography

const GamePage: React.FC = () => {
    const { characterId } = useParams<{ characterId: string }>()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()
    const { setGameState: setStoreGameState } = useGameStore()

    const [loading, setLoading] = useState(false)
    const [localGameState, setLocalGameState] = useState<GameState | null>(null)
    const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null)
    const [decisionModalVisible, setDecisionModalVisible] = useState(false)
    const [selectedDecision, setSelectedDecision] = useState<string>('')
    const [gameHistory, setGameHistory] = useState<GameEvent[]>([])
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        if (characterId) {
            loadGameState()
        }
    }, [isAuthenticated, characterId])

    const loadGameState = async () => {
        if (!characterId) return

        setLoading(true)
        try {
            const response = await gameAPI.getState(characterId)
            if (response.data.success && response.data.data) {
                const state = response.data.data
                setLocalGameState(state)
                setStoreGameState(state)

                // 加载游戏历史
                const historyResponse = await gameAPI.getHistory(characterId)
                if (historyResponse.data.success) {
                    setGameHistory(historyResponse.data.data || [])
                }
            }
        } catch (error) {
            console.error('加载游戏状态失败:', error)
            message.error('加载游戏状态失败')
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
                const event = response.data.data
                setCurrentEvent(event)

                if (event.requires_decision && event.decisions && event.decisions.length > 0) {
                    setDecisionModalVisible(true)
                } else {
                    // 自动应用事件效果
                    await applyEventEffects(event)
                }
            }
        } catch (error) {
            console.error('下一回合失败:', error)
            message.error('游戏进行失败')
        } finally {
            setLoading(false)
        }
    }

    const handleMakeDecision = async () => {
        if (!characterId || !currentEvent || !selectedDecision) return

        setLoading(true)
        try {
            const response = await gameAPI.makeDecision(characterId, {
                event_id: currentEvent.event_id,
                decision_id: selectedDecision
            })

            if (response.data.success) {
                await applyEventEffects(currentEvent)
                setDecisionModalVisible(false)
                setSelectedDecision('')
                setCurrentEvent(null)
                message.success('决策已执行')
            }
        } catch (error) {
            console.error('执行决策失败:', error)
            message.error('执行决策失败')
        } finally {
            setLoading(false)
        }
    }

    const applyEventEffects = async (event: GameEvent) => {
        // 刷新游戏状态
        await loadGameState()

        // 添加到历史记录
        setGameHistory(prev => [event, ...prev])
    }

    const startAutoPlay = () => {
        setIsPlaying(true)
        // 这里可以实现自动游戏逻辑
        message.info('自动游戏功能开发中...')
    }

    const pauseAutoPlay = () => {
        setIsPlaying(false)
    }

    if (loading && !localGameState) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        )
    }

    if (!localGameState) {
        return (
            <div className="p-6">
                <Card>
                    <div className="text-center">
                        <Title level={3}>角色不存在</Title>
                        <Button type="primary" onClick={() => navigate('/character')}>
                            返回角色页面
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    // 从GameState直接获取角色信息
    const character = localGameState
    const attributes = character.attributes
    const healthPercentage = Math.round((attributes.health / 100) * 100)
    const intelligencePercentage = Math.round((attributes.intelligence / 100) * 100)
    const strengthPercentage = Math.round((attributes.strength / 100) * 100)
    const happinessPercentage = Math.round((attributes.happiness / 100) * 100)

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Row gutter={[24, 24]}>
                {/* 左侧：角色信息和属性 */}
                <Col xs={24} lg={8}>
                    <Card title="角色信息" className="mb-6">
                        <div className="text-center mb-4">
                            <Avatar size={64} className="mb-2">
                                {character.character_name[0]}
                            </Avatar>
                            <Title level={4}>{character.character_name}</Title>
                            <Text type="secondary">
                                {character.current_age}岁 · {character.birth_country}
                            </Text>
                        </div>

                        <Divider />

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="当前年龄"
                                    value={character.current_age}
                                    suffix="岁"
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="游戏时长"
                                    value={character.total_playtime}
                                    suffix="年"
                                />
                            </Col>
                        </Row>
                    </Card>

                    {/* 属性面板 */}
                    <Card title="属性">
                        <Space direction="vertical" className="w-full" size="middle">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Text><HeartOutlined className="mr-2 text-red-500" />健康</Text>
                                    <Text strong>{attributes.health}/100</Text>
                                </div>
                                <Progress
                                    percent={healthPercentage}
                                    strokeColor="#ff4d4f"
                                    showInfo={false}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Text><BulbOutlined className="mr-2 text-blue-500" />智力</Text>
                                    <Text strong>{attributes.intelligence}/100</Text>
                                </div>
                                <Progress
                                    percent={intelligencePercentage}
                                    strokeColor="#1890ff"
                                    showInfo={false}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Text><ThunderboltOutlined className="mr-2 text-orange-500" />力量</Text>
                                    <Text strong>{attributes.strength}/100</Text>
                                </div>
                                <Progress
                                    percent={strengthPercentage}
                                    strokeColor="#fa8c16"
                                    showInfo={false}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Text><SmileOutlined className="mr-2 text-green-500" />幸福</Text>
                                    <Text strong>{attributes.happiness}/100</Text>
                                </div>
                                <Progress
                                    percent={happinessPercentage}
                                    strokeColor="#52c41a"
                                    showInfo={false}
                                />
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* 中间：游戏控制区域 */}
                <Col xs={24} lg={10}>
                    <Card title="游戏控制" className="mb-6">
                        <div className="text-center">
                            <Space size="large">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<StepForwardOutlined />}
                                    onClick={handleNextTurn}
                                    loading={loading}
                                    disabled={localGameState.game_completed}
                                >
                                    下一年
                                </Button>

                                {!isPlaying ? (
                                    <Button
                                        size="large"
                                        icon={<PlayCircleOutlined />}
                                        onClick={startAutoPlay}
                                        disabled={localGameState.game_completed}
                                    >
                                        自动游戏
                                    </Button>
                                ) : (
                                    <Button
                                        size="large"
                                        icon={<PauseCircleOutlined />}
                                        onClick={pauseAutoPlay}
                                    >
                                        暂停
                                    </Button>
                                )}

                                <Button
                                    icon={<SettingOutlined />}
                                    size="large"
                                >
                                    设置
                                </Button>
                            </Space>

                            {localGameState.game_completed && (
                                <div className="mt-4">
                                    <Tag color="red" className="text-lg px-4 py-2">
                                        游戏已结束
                                    </Tag>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* 当前事件显示 */}
                    {currentEvent && (
                        <Card title="当前事件" className="mb-6">
                            <Paragraph>{currentEvent.description}</Paragraph>
                            {currentEvent.requires_decision && currentEvent.decisions && (
                                <div className="mt-4">
                                    <Text strong>请选择你的决策：</Text>
                                    <div className="mt-2">
                                        {currentEvent.decisions?.map((decision: any, index: number) => (
                                            <Button
                                                key={index}
                                                type={selectedDecision === decision.decision_id ? 'primary' : 'default'}
                                                className="mb-2 mr-2"
                                                onClick={() => setSelectedDecision(decision.decision_id)}
                                            >
                                                {decision.description}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* 最近事件 */}
                    <Card title="最近事件">
                        <List
                            dataSource={gameHistory.slice(0, 5)}
                            renderItem={(event) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={`${character.current_age - gameHistory.indexOf(event)}岁`}
                                        description={event.description}
                                    />
                                </List.Item>
                            )}
                            locale={{ emptyText: '还没有事件发生' }}
                        />
                    </Card>
                </Col>

                {/* 右侧：游戏历史时间线 */}
                <Col xs={24} lg={6}>
                    <Card title="人生轨迹" className="h-fit">
                        <Timeline
                            items={gameHistory.map((event, index) => ({
                                children: (
                                    <div>
                                        <Text strong>{character.current_age - index}岁</Text>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {event.description}
                                        </div>
                                    </div>
                                )
                            }))}
                        />
                        {gameHistory.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                开始你的人生旅程...
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* 快捷操作按钮 */}
            <div className="fixed bottom-6 right-6">
                <Space direction="vertical">
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        icon={<HomeOutlined />}
                        onClick={() => navigate('/')}
                    />
                </Space>
            </div>

            {/* 决策弹窗 */}
            <Modal
                title="重要决策"
                open={decisionModalVisible}
                onOk={handleMakeDecision}
                onCancel={() => setDecisionModalVisible(false)}
                okText="确认决策"
                cancelText="取消"
                okButtonProps={{ disabled: !selectedDecision }}
            >
                {currentEvent && (
                    <div>
                        <Paragraph>{currentEvent.description}</Paragraph>
                        <Divider />
                        <Text strong>请选择你的决策：</Text>
                        <Radio.Group
                            className="mt-3"
                            value={selectedDecision}
                            onChange={(e) => setSelectedDecision(e.target.value)}
                        >
                            <Space direction="vertical" className="w-full">
                                {currentEvent.decisions?.map((decision: any) => (
                                    <Radio key={decision.decision_id} value={decision.decision_id}>
                                        <div>
                                            <div>{decision.description}</div>
                                            {decision.effects && (
                                                <div className="text-sm text-gray-500 mt-1">
                                                    影响：{decision.effects}
                                                </div>
                                            )}
                                        </div>
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default GamePage
