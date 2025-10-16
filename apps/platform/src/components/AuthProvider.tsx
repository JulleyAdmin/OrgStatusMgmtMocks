'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        // In a real app, this would check localStorage, cookies, or make an API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock user for development
        const mockUser: User = {
          id: '1',
          email: 'admin@platform.com',
          name: 'Platform Admin',
          role: 'super_admin',
          companyId: 'platform',
          status: 'active',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
        
        setUser(mockUser)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: '1',
        email: email,
        name: 'Platform Admin',
        role: 'super_admin',
        companyId: 'platform',
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
      
      setUser(mockUser)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
