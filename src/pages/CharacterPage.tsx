import { characterAPI, publicAPI } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import type { Attributes, Character } from '@/types'
import {
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Slider,
  Space,
  Spin,
  Steps,
  Table,
  Tag,
  Typography
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography
const { Option } = Select
const { Step } = Steps

const CharacterPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isInitialized } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [characters, setCharacters] = useState<Character[]>([])
  const [countries, setCountries] = useState<Array<{ code: string; name: string; name_cn: string }>>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form] = Form.useForm()

  // 角色创建表单数据
  const [characterData, setCharacterData] = useState({
    character_name: '',
    birth_year: 2000,
    birth_country: '',
    birth_place: '',
    gender: 0,
    race: 0,
    attributes: {
      intelligence: 50,
      emotional_intelligence: 50,
      memory: 50,
      imagination: 50,
      physical_fitness: 50,
      appearance: 50
    } as Attributes
  })

  useEffect(() => {
    if (!isInitialized) return

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadCountries()
    loadCharacters()
  }, [isAuthenticated, isInitialized, navigate])

  const loadCountries = async () => {
    try {
      const response = await publicAPI.getCountries()
      if (response.data.success && response.data.data) {
        setCountries(response.data.data)
      } else {
        message.error('获取国家列表失败')
      }
    } catch (error) {
      console.error('获取国家列表失败:', error)
      message.error('获取国家列表失败')
    }
  }

  const loadCharacters = async () => {
    setLoading(true)
    try {
      const response = await characterAPI.getByUser()
      if (response.data.success) {
        const responseData = response.data.data
        if (Array.isArray(responseData)) {
          setCharacters(responseData)
        } else if (responseData && 'characters' in responseData) {
          setCharacters((responseData as { characters?: Character[] }).characters || [])
        } else {
          setCharacters([])
        }
      }
    } catch (error) {
      console.error('加载角色列表失败:', error)
      message.error('加载角色列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCharacter = async () => {
    setCreating(true)
    try {
      const response = await characterAPI.create({
        character_name: characterData.character_name,
        birth_year: characterData.birth_year,
        birth_country: characterData.birth_country,
        birth_place: characterData.birth_place,
        gender: characterData.gender,
        race: characterData.race,
        current_age: 0,
        life_stage: 'infant',
        attributes: characterData.attributes,
        money: 0,
        health_level: 80,
        happiness_level: 70,
        game_completed: false,
        total_playtime: 0,
        created_at: Date.now().toString(),
        updated_at: Date.now().toString()
      })

      if (response.data.success) {
        message.success('角色创建成功！')
        setCurrentStep(0)
        setCharacterData({
          character_name: '',
          birth_year: 2000,
          birth_country: '',
          birth_place: '',
          gender: 0,
          race: 0,
          attributes: {
            intelligence: 50,
            emotional_intelligence: 50,
            memory: 50,
            imagination: 50,
            physical_fitness: 50,
            appearance: 50,
            health: 50,
            strength: 50,
            happiness: 50
          }
        })
        form.resetFields()
        loadCharacters()

        // 直接进入游戏
        navigate(`/game/${response.data.data!.character_id}`)
      } else {
        message.error(response.data.message)
      }
    } catch (error) {
      console.error('创建角色失败:', error)
      message.error('创建角色失败')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteCharacter = async (characterId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '你确定要删除这个角色吗？此操作不可恢复。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await characterAPI.delete(characterId)
          if (response.data.success) {
            message.success('角色删除成功')
            loadCharacters()
          } else {
            message.error(response.data.message)
          }
        } catch (error) {
          console.error('删除角色失败:', error)
          message.error('删除角色失败')
        }
      }
    })
  }

  const getLifeStageText = (stage: string) => {
    const stageMap: Record<string, string> = {
      'infant': '婴儿',
      'child': '儿童',
      'teenager': '青少年',
      'adult': '成年',
      'middle_aged': '中年',
      'elderly': '老年'
    }
    return stageMap[stage] || stage
  }

  const getLifeStageColor = (stage: string) => {
    const colorMap: Record<string, string> = {
      'infant': 'pink',
      'child': 'blue',
      'teenager': 'cyan',
      'adult': 'green',
      'middle_aged': 'orange',
      'elderly': 'purple'
    }
    return colorMap[stage] || 'default'
  }

  const totalAttributePoints = Object.values(characterData.attributes).reduce((sum, val) => sum + val, 0)
  const averageAttribute = Math.round(totalAttributePoints / 6)

  // 根据国家代码获取国家中文名称
  const getCountryName = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode)
    return country ? country.name_cn : countryCode
  }

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
      title: '人生阶段',
      dataIndex: 'life_stage',
      key: 'life_stage',
      render: (stage: string) => (
        <Tag color={getLifeStageColor(stage)}>
          {getLifeStageText(stage)}
        </Tag>
      )
    },
    {
      title: '出生地',
      key: 'birth_info',
      render: (record: Character) => `${getCountryName(record.birth_country)} (${record.birth_year}年)`
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
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            size="small"
            onClick={() => navigate(`/game/${record.character_id}`)}
            disabled={record.game_completed}
          >
            {record.game_completed ? '已完成' : '继续游戏'}
          </Button>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/character/${record.character_id}/summary`)}
          >
            查看
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteCharacter(record.character_id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  const renderBasicInfoStep = () => (
    <Form form={form} layout="vertical">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="角色姓名"
            name="character_name"
            rules={[{ required: true, message: '请输入角色姓名' }]}
          >
            <Input
              placeholder="为你的角色起个名字"
              value={characterData.character_name}
              onChange={(e) => setCharacterData(prev => ({ ...prev, character_name: e.target.value }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="出生年份"
            name="birth_year"
            rules={[{ required: true, message: '请选择出生年份' }]}
          >
            <Select
              placeholder="选择出生年份"
              value={characterData.birth_year}
              onChange={(value) => setCharacterData(prev => ({ ...prev, birth_year: value }))}
            >
              {Array.from({ length: 251 }, (_, i) => 1800 + i).map(year => (
                <Option key={year} value={year}>{year}年</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="出生国家"
            name="birth_country"
            rules={[{ required: true, message: '请选择出生国家' }]}
          >
            <Select
              placeholder="选择出生国家"
              value={characterData.birth_country}
              onChange={(value) => setCharacterData(prev => ({ ...prev, birth_country: value }))}
              showSearch
              filterOption={(input, option) =>
                String(option?.children)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {countries.map(country => (
                <Option key={country.code} value={country.code}>
                  {country.name_cn} ({country.name})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="出生城市"
            name="birth_place"
            rules={[{ required: true, message: '请输入出生城市' }]}
          >
            <Input
              placeholder="输入出生城市"
              value={characterData.birth_place}
              onChange={(e) => setCharacterData(prev => ({ ...prev, birth_place: e.target.value }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="性别"
            name="gender"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select
              placeholder="选择性别"
              value={characterData.gender}
              onChange={(value) => setCharacterData(prev => ({ ...prev, gender: value }))}
            >
              <Option value={0}>未知</Option>
              <Option value={1}>男</Option>
              <Option value={2}>女</Option>
              <Option value={3}>其他</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="种族"
            name="race"
            rules={[{ required: true, message: '请选择种族类型' }]}
          >
            <Select
              placeholder="选择种族类型"
              value={characterData.race}
              onChange={(value) => setCharacterData(prev => ({ ...prev, race: value }))}
            >
              <Option value={0}>未知</Option>
              <Option value={1}>白人</Option>
              <Option value={2}>黄种人</Option>
              <Option value={3}>黑人</Option>
              <Option value={4}>拉丁裔</Option>
              <Option value={5}>美洲原住民</Option>
              <Option value={6}>混血</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  const renderAttributesStep = () => (
    <div>
      <div className="mb-6 text-center">
        <Text>调整角色初始属性 (总计: {totalAttributePoints}, 平均: {averageAttribute})</Text>
      </div>
      <Row gutter={[24, 24]}>
        {Object.entries(characterData.attributes).map(([key, value]) => (
          <Col xs={24} md={12} key={key}>
            <div className="mb-4">
              <Text strong className="block mb-2">{key.replace('_', ' ')}</Text>
              <Slider
                min={10}
                max={90}
                value={value}
                onChange={(newValue) => setCharacterData(prev => ({
                  ...prev,
                  attributes: { ...prev.attributes, [key]: newValue }
                }))}
                marks={{
                  10: '10',
                  50: '50',
                  90: '90'
                }}
              />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )

  const renderConfirmStep = () => (
    <div>
      <Title level={4}>确认角色信息</Title>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text strong>角色姓名: </Text>
            <Text>{characterData.character_name}</Text>
          </Col>
          <Col span={24}>
            <Text strong>出生信息: </Text>
            <Text>{characterData.birth_year}年生于{getCountryName(characterData.birth_country)}{characterData.birth_place}</Text>
          </Col>
          <Col span={24}>
            <Text strong>初始属性:</Text>
            <div className="mt-2">
              {Object.entries(characterData.attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <Text>{key.replace('_', ' ')}</Text>
                  <Text strong>{value}</Text>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )

  // 等待状态初始化完成
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="正在加载..." />
      </div>
    )
  }

  if (loading || !isInitialized) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="pl-4 pr-6 py-6">
      <Title level={2}>角色管理</Title>

      {/* 现有角色列表 */}
      <Card title="我的角色" className="mb-6">
        <Table
          dataSource={characters}
          columns={characterColumns}
          rowKey="character_id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: '还没有创建角色，点击下方按钮创建你的第一个角色！' }}
        />
      </Card>

      {/* 创建新角色 */}
      <Card
        title="创建新角色"
        extra={
          currentStep > 0 && (
            <Button onClick={() => setCurrentStep(0)}>
              返回角色列表
            </Button>
          )
        }
      >
        {currentStep === 0 ? (
          <div className="text-center py-8">
            <Title level={4}>开始你的新人生</Title>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setCurrentStep(1)}
            >
              创建新角色
            </Button>
          </div>
        ) : (
          <>
            <Steps current={currentStep - 1} className="mb-8">
              <Step title="基本信息" description="设置角色基本信息" />
              <Step title="初始属性" description="调整角色属性" />
              <Step title="确认创建" description="确认并创建角色" />
            </Steps>

            <div className="min-h-96">
              {currentStep === 1 && renderBasicInfoStep()}
              {currentStep === 2 && renderAttributesStep()}
              {currentStep === 3 && renderConfirmStep()}
            </div>

            <Divider />

            <div className="text-center">
              <Space>
                {currentStep > 1 && (
                  <Button onClick={() => setCurrentStep(currentStep - 1)}>
                    上一步
                  </Button>
                )}

                {currentStep < 3 && (
                  <Button
                    type="primary"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      currentStep === 1 && (!characterData.character_name || !characterData.birth_country || !characterData.birth_place)
                    }
                  >
                    下一步
                  </Button>
                )}

                {currentStep === 3 && (
                  <Button
                    type="primary"
                    loading={creating}
                    onClick={handleCreateCharacter}
                  >
                    创建角色并开始游戏
                  </Button>
                )}
              </Space>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default CharacterPage
