export interface ApiError {
  code: number
  message: string
  details?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
}

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Attributes {
  intelligence: number
  emotional_intelligence: number
  memory: number
  imagination: number
  physical_fitness: number
  appearance: number
  health?: number
  strength?: number
  happiness?: number
}

export interface Character {
  character_id: string
  character_name: string
  birth_year: number
  birth_country: string
  birth_place?: string
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

export interface Event {
  event_id: number
  character_id: string
  age: number
  description: string
  impact: string
  created_at: number
}

export interface DecisionDetails {
  decision_type: number
  option_text: string
  consequence: string
}

export interface DecisionOptions {
  conservative: DecisionDetails
  moderate: DecisionDetails
  aggressive: DecisionDetails
}

export interface PendingDecision {
  character_id: string
  options: DecisionOptions
  created_at: number
  updated_at: number
}

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
  created_at: string | number
  updated_at: string | number
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
  birth_year: number
  birth_country: string
  birth_place: string
  key_events: Event[]
  pending_decision?: PendingDecision | null
}

export type DecisionOptionType = 'conservative' | 'moderate' | 'aggressive'

export interface GameProgressRequest {
  option_type?: DecisionOptionType
}

export interface GameDecision {
  option_type: DecisionOptionType
  decision_id?: string
  event_id?: string
}

export interface AchievementItem {
  id: string
  title: string
  description: string
  category: string
  unlocked: boolean
  progress: number
  max_progress: number
  unlocked_at?: number
}

export interface AchievementCategory {
  id: string
  name: string
  description: string
  total_count: number
  unlocked_count: number
}

export interface CharacterAchievementsResponse {
  character_id: string
  character_name: string
  items: AchievementItem[]
  unlocked_count: number
  total_count: number
}

export interface CharacterStatsResponse {
  character_id: string
  character_name: string
  current_age: number
  life_stage: string
  is_game_active: boolean
  total_playtime: number
  money: number
  event_count: number
  pending_decision: boolean
  attributes: Attributes
  last_event?: Event
}

export interface TimelineItem {
  age: number
  description: string
  impact: string
  created_at: number
}

export interface CharacterTimelineResponse {
  character_id: string
  timeline: TimelineItem[]
  total: number
}
