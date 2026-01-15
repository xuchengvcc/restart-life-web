// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

// 角色属性
export interface Attributes {
  intelligence: number
  emotional_intelligence: number
  memory: number
  imagination: number
  physical_fitness: number
  appearance: number
  health: number
  strength: number
  happiness: number
}

// 角色信息
export interface Character {
  character_id: string
  character_name: string
  birth_year: number
  birth_country: string
  birth_place: string
  current_age: number
  life_stage: string
  attributes: Attributes
  money: number
  education_desc?: string
  career_desc?: string
  current_country?: string
  marital_status?: string
  family_background?: string
  social_relationships?: string
  health_level: number
  happiness_level: number
  game_completed: boolean
  final_age?: number
  death_cause?: string
  summary?: string
  total_playtime: number
  created_at: string
  updated_at: string
}

// 游戏状态
export interface GameState {
  character_id: string
  character_name: string
  current_age: number
  life_stage: string
  attributes: Attributes
  is_game_active: boolean
  game_completed: boolean
  last_save_time: number
  total_playtime: number
  created_at: string
  updated_at: string

  // 角色详细状态
  education: string
  career: string
  location: string
  marital_status: string
  family_situation: string
  social_status: string
  health_status: string
  wealth_level: string
  relationships: string
  personal_growth: string
  money: number
  last_year_description: string

  // 出生信息
  birth_year: number
  birth_country: string
  birth_place: string

  // 事件和决策
  key_events: Event[]
  pending_decision?: Decision
}

// 事件
export interface Event {
  event_id: number
  character_id: string
  age: number
  event_type: string
  title: string
  description: string
  impact: string
  created_at: number
}

// 游戏事件 (扩展版本)
export interface GameEvent {
  event_id: string
  character_id: string
  age: number
  event_type: string
  title: string
  description: string
  impact: string
  requires_decision: boolean
  decisions?: DecisionOption[]
  created_at: number
}

// 决策选项
export interface DecisionOption {
  decision_id: string
  option_id: string
  title: string
  description: string
  effects?: string
  potential_impact: string
}

// 游戏决策
export interface GameDecision {
  event_id: string
  decision_id: string
}

// 决策
export interface Decision {
  character_id: string
  options: DecisionOption[]
  created_at: number
  updated_at: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

// 游戏推进请求
export interface GameProgressRequest {
  option_type?: string
}
