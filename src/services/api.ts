import type { ApiResponse, Character, GameDecision, GameEvent, GameProgressRequest, GameState } from '@/types'
import axios, { AxiosResponse } from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api/v1',
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

  // 发送验证码
  sendVerificationCode: (email: string) =>
    api.post<ApiResponse>('/auth/send-verification-code', {
      email,
    }),

  // 验证验证码
  verifyCode: (email: string, code: string) =>
    api.post<ApiResponse<{ reset_token: string }>>('/auth/verify-code', {
      email,
      code,
    }),

  // 重置密码
  resetPassword: (resetToken: string, newPassword: string) =>
    api.post<ApiResponse>('/auth/reset-password', {
      reset_token: resetToken,
      new_password: newPassword,
    }),
}

// 角色相关API
export const characterAPI = {
  create: (character: Partial<Character>) =>
    api.post<ApiResponse<Character>>('/characters/create', character),

  getById: (id: string) =>
    api.get<ApiResponse<Character>>(`/characters/get/${id}`),

  getByUser: () =>
    api.get<ApiResponse<Character[]>>('/characters/list'),

  update: (id: string, character: Partial<Character>) =>
    api.put<ApiResponse<Character>>(`/characters/update/${id}`, character),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/characters/delete/${id}`),
}

// 游戏相关API
export const gameAPI = {
  startOrResume: () =>
    api.post<ApiResponse<GameState>>('/game/start-or-resume'),

  startGame: (characterId: string) =>
    api.post<ApiResponse<GameState>>(`/game/start/${characterId}`),

  advanceGame: (characterId: string, request?: GameProgressRequest) =>
    api.post<ApiResponse<GameState>>(`/game/advance/${characterId}`, request || {}),

  getGameState: (characterId: string) =>
    api.get<ApiResponse<GameState>>(`/game/state/${characterId}`),

  saveGame: (characterId: string) =>
    api.post<ApiResponse>(`/game/save/${characterId}`),

  loadGame: (characterId: string) =>
    api.get<ApiResponse<GameState>>(`/game/load/${characterId}`),

  getHistory: (characterId: string) =>
    api.get<ApiResponse<GameEvent[]>>(`/game/history/${characterId}`),

  // 兼容旧的API调用
  getState: (characterId: string) =>
    api.get<ApiResponse<GameState>>(`/game/state/${characterId}`),

  nextTurn: (characterId: string) =>
    api.post<ApiResponse<GameEvent>>(`/game/next-turn/${characterId}`),

  makeDecision: (characterId: string, decision: GameDecision) =>
    api.post<ApiResponse<GameState>>(`/game/decision/${characterId}`, decision),
}

export default api
