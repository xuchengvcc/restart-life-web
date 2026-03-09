import type { ApiResponse, Character, GameDecision, GameEvent, GameProgressRequest, GameState } from '@/types'
import axios, { AxiosResponse } from 'axios'

// 根据环境确定API基础URL
const getApiBaseURL = () => {
  // 在开发环境，通过Vite代理到本地后端
  if (import.meta.env?.DEV) {
    return '/api/v1'
  }

  // 在生产环境，使用相同域名的API路径
  return '/api/v1'
}

// 创建axios实例
const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 30000,
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
      const url = error.config?.url || ''
      // 登录/注册类接口让调用方自行处理，不要强制跳转，避免静默回到登录页
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/send-verification-code')
      if (!isAuthEndpoint) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// 认证相关API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post<ApiResponse<{ user: any; access_token: string; refresh_token: string; expires_at: number }>>('/auth/login', {
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

// 公共数据API（不需要认证）
export const publicAPI = {
  getCountries: () =>
    api.get<ApiResponse<Array<{ code: string; name: string; name_cn: string }>>>('/countries'),
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
    api.get<ApiResponse<GameEvent[]>>(`/game/events/${characterId}`),

  // 兼容旧的API调用
  getState: (characterId: string) =>
    api.get<ApiResponse<GameState>>(`/game/state/${characterId}`),

  nextTurn: (characterId: string, optionType?: string) =>
    api.post<ApiResponse<GameState>>(`/game/advance/${characterId}`, optionType ? { option_type: optionType } : {}),

  makeDecision: (characterId: string, decision: GameDecision) =>
    api.post<ApiResponse<GameState>>(`/game/decision/${characterId}`, decision),
}

export default api
