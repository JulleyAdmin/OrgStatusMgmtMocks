'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { authService } from '../lib/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [setUser, setLoading])

  return <>{children}</>
}
