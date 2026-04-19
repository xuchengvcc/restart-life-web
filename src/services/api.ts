import type {
  AchievementCategory,
  ApiResponse,
  Character,
  CharacterAchievementsResponse,
  CharacterStatsResponse,
  CharacterTimelineResponse,
  DecisionOptionType,
  Event,
  GameProgressRequest,
  GameState,
} from '@/types'
import axios, { AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

type AuthPayload = {
  user: {
    user_id: number
    username: string
    email: string
    created_at: number
    updated_at: number
  }
  access_token: string
  refresh_token: string
  expires_at: number
}

export const authAPI = {
  login: (username: string, password: string) =>
    api.post<ApiResponse<AuthPayload>>('/auth/login', {
      username,
      password,
    }),

  register: (username: string, email: string, password: string) =>
    api.post<ApiResponse>('/auth/register', {
      username,
      email,
      password,
    }),

  logout: () => api.post<ApiResponse>('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<AuthPayload>>('/auth/refresh', {
      refresh_token: refreshToken,
    }),

  sendVerificationCode: (email: string) =>
    api.post<ApiResponse>('/auth/send-verification-code', { email }),

  verifyCode: (email: string, code: string) =>
    api.post<ApiResponse<{ reset_token: string }>>('/auth/verify-code', { email, code }),

  resetPassword: (resetToken: string, newPassword: string) =>
    api.post<ApiResponse>('/auth/reset-password', {
      reset_token: resetToken,
      new_password: newPassword,
    }),
}

export const characterAPI = {
  create: (character: Partial<Character>) =>
    api.post<ApiResponse<Character>>('/characters/create', character),

  getById: (id: string) => api.get<ApiResponse<Character>>(`/characters/get/${id}`),

  getByUser: () => api.get<ApiResponse<Character[]>>('/characters/list'),

  update: (id: string, character: Partial<Character>) =>
    api.put<ApiResponse<Character>>(`/characters/update/${id}`, character),

  delete: (id: string) => api.delete<ApiResponse>(`/characters/delete/${id}`),
}

export const gameAPI = {
  startOrResume: () => api.post<ApiResponse<GameState>>('/game/start-or-resume'),

  startGame: (characterId: string) => api.post<ApiResponse<GameState>>(`/game/start/${characterId}`),

  advanceGame: (characterId: string, request?: GameProgressRequest) =>
    api.post<ApiResponse<GameState>>(`/game/advance/${characterId}`, request || {}),

  getGameState: (characterId: string) => api.get<ApiResponse<GameState>>(`/game/state/${characterId}`),

  saveGame: (characterId: string) => api.post<ApiResponse>(`/game/save/${characterId}`),

  loadGame: (characterId: string) => api.post<ApiResponse<GameState>>(`/game/load/${characterId}`),

  getHistory: (characterId: string) => api.get<ApiResponse<Event[]>>(`/game/events/${characterId}`),

  getState: (characterId: string) => api.get<ApiResponse<GameState>>(`/game/state/${characterId}`),

  nextTurn: (characterId: string) => api.post<ApiResponse<GameState>>(`/game/advance/${characterId}`, {}),

  makeDecision: (characterId: string, optionType: DecisionOptionType) =>
    api.post<ApiResponse<GameState>>(`/game/advance/${characterId}`, { option_type: optionType }),
}

export const achievementAPI = {
  getCategories: () => api.get<ApiResponse<AchievementCategory[]>>('/achievements/categories'),
  getByCharacter: (characterId: string) =>
    api.get<ApiResponse<CharacterAchievementsResponse>>(`/achievements/${characterId}`),
}

export const statsAPI = {
  getByCharacter: (characterId: string) => api.get<ApiResponse<CharacterStatsResponse>>(`/stats/${characterId}`),
  getTimeline: (characterId: string) =>
    api.get<ApiResponse<CharacterTimelineResponse>>(`/stats/${characterId}/timeline`),
}

export default api
