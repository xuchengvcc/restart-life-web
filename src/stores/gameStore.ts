import type { Character, GameState } from '@/types'
import { create } from 'zustand'

interface GameStore {
  currentCharacter: Character | null
  gameState: GameState | null
  isLoading: boolean
  error: string | null

  // Actions
  setCharacter: (character: Character) => void
  setGameState: (gameState: GameState) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  currentCharacter: null,
  gameState: null,
  isLoading: false,
  error: null,

  setCharacter: (character) => set({ currentCharacter: character }),
  setGameState: (gameState) => set({ gameState }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearGame: () => set({
    currentCharacter: null,
    gameState: null,
    error: null,
    isLoading: false
  }),
}))
