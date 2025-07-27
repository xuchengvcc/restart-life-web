import type { ApiResponse, Character, GameDecision, GameEvent, GameProgressRequest, GameState } from '@/types'
import axios, { AxiosResponse } from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 认证相关API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post<ApiResponse<{ token: string; refresh_token: string }>>('/auth/login', {
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
    api.post<ApiResponse<{ token: string }>>('/auth/refresh', {
      refresh_token: refreshToken,
    }),
}

// 角色相关API
export const characterAPI = {
  create: (character: Partial<Character>) =>
    api.post<ApiResponse<Character>>('/characters', character),

  getById: (id: string) =>
    api.get<ApiResponse<Character>>(`/characters/${id}`),

  getByUser: () =>
    api.get<ApiResponse<Character[]>>('/characters'),

  update: (id: string, character: Partial<Character>) =>
    api.put<ApiResponse<Character>>(`/characters/${id}`, character),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/characters/${id}`),
}

// 游戏相关API
export const gameAPI = {
  getGameState: (characterId: string) =>
    api.get<ApiResponse<GameState>>(`/game/${characterId}/state`),

  getState: (characterId: string) =>
    api.get<ApiResponse<GameState>>(`/game/${characterId}/state`),

  advanceGame: (characterId: string, request?: GameProgressRequest) =>
    api.post<ApiResponse<GameState>>(`/game/${characterId}/advance`, request || {}),

  nextTurn: (characterId: string) =>
    api.post<ApiResponse<GameEvent>>(`/game/${characterId}/next-turn`),

  makeDecision: (characterId: string, decision: GameDecision) =>
    api.post<ApiResponse<GameState>>(`/game/${characterId}/decision`, decision),

  getHistory: (characterId: string) =>
    api.get<ApiResponse<GameEvent[]>>(`/game/${characterId}/history`),

  saveGame: (characterId: string) =>
    api.post<ApiResponse>(`/game/${characterId}/save`),

  loadGame: (characterId: string) =>
    api.get<ApiResponse<GameState>>(`/game/${characterId}/load`),
}

export default api
