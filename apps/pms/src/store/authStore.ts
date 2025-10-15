import { create } from 'zustand'
import { User } from '../types'
import { authService } from '../lib/auth'

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true })
      const user = await authService.signIn(email, password)
      set({ user, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true })
      await authService.signOut()
      set({ user: null, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  setUser: (user: User | null) => set({ user }),
  setLoading: (loading: boolean) => set({ loading })
}))
