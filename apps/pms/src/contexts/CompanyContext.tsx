// Company Context for Multi-Tenant Project Management System

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Company, CompanyUser } from '@/types/company-schema'
import { CompanyService, CompanyUserService } from '@/lib/company-services'

interface CompanyContextType {
  // Current Company
  currentCompany: Company | null
  setCurrentCompany: (company: Company | null) => void
  
  // Current User in Company
  currentCompanyUser: CompanyUser | null
  setCurrentCompanyUser: (user: CompanyUser | null) => void
  
  // Company ID (for easy access)
  companyId: string | null
  
  // Loading States
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Company Management
  switchCompany: (companyId: string) => Promise<void>
  refreshCompany: () => Promise<void>
  
  // User Companies
  userCompanies: Company[]
  setUserCompanies: (companies: Company[]) => void
  
  // Error Handling
  error: string | null
  setError: (error: string | null) => void
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

interface CompanyProviderProps {
  children: ReactNode
  initialCompanyId?: string
}

export function CompanyProvider({ children, initialCompanyId }: CompanyProviderProps) {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null)
  const [currentCompanyUser, setCurrentCompanyUser] = useState<CompanyUser | null>(null)
  const [userCompanies, setUserCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const companyId = currentCompany?.id || null

  // Load company by ID
  const loadCompany = async (companyId: string) => {
    try {
      console.log('Loading company:', companyId)
      setIsLoading(true)
      setError(null)
      
      const company = await CompanyService.getCompany(companyId)
      if (company) {
        console.log('Company loaded successfully:', company)
        setCurrentCompany(company)
        
        // Load current user's role in this company
        const companyUsers = await CompanyUserService.getCompanyUsers(companyId)
        console.log('Company users loaded:', companyUsers)
        // For now, we'll assume the first user is the current user
        // In a real app, you'd get this from auth context
        if (companyUsers.length > 0) {
          setCurrentCompanyUser(companyUsers[0] || null)
        }
      } else {
        console.error('Company not found:', companyId)
        setError('Company not found')
      }
    } catch (err) {
      console.error('Error loading company:', err)
      setError('Failed to load company')
    } finally {
      setIsLoading(false)
    }
  }

  // Switch to a different company
  const switchCompany = async (companyId: string) => {
    await loadCompany(companyId)
  }

  // Refresh current company data
  const refreshCompany = async () => {
    if (companyId) {
      await loadCompany(companyId)
    }
  }

  // Load user's companies
  const loadUserCompanies = async () => {
    try {
      console.log('Loading user companies...')
      // For now, we'll load all companies
      // In a real app, you'd filter by user ID
      const companies = await CompanyService.getCompanies()
      console.log('Loaded companies:', companies)
      setUserCompanies(companies)
    } catch (err) {
      console.error('Error loading user companies:', err)
    }
  }

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      await loadUserCompanies()
    }
    
    initialize()
  }, [])

  // Auto-select company after userCompanies are loaded
  useEffect(() => {
    console.log('Auto-select effect triggered:', { userCompanies: userCompanies.length, currentCompany: !!currentCompany, initialCompanyId })
    if (userCompanies.length > 0 && !currentCompany) {
      if (initialCompanyId) {
        console.log('Loading initial company:', initialCompanyId)
        loadCompany(initialCompanyId)
      } else {
        // Auto-select first company if no initial company specified
        console.log('Auto-selecting first company:', userCompanies[0]?.id)
        if (userCompanies[0]?.id) {
          loadCompany(userCompanies[0].id)
        }
      }
    }
  }, [userCompanies, currentCompany, initialCompanyId])

  const value: CompanyContextType = {
    currentCompany,
    setCurrentCompany,
    currentCompanyUser,
    setCurrentCompanyUser,
    companyId,
    isLoading,
    setIsLoading,
    switchCompany,
    refreshCompany,
    userCompanies,
    setUserCompanies,
    error,
    setError
  }

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  )
}

// Hook to use company context
export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}

// Hook to get company ID (for easy access in components)
export function useCompanyId() {
  const { companyId } = useCompany()
  return companyId
}

// Hook to check if user has permission
export function useCompanyPermission(permission: keyof CompanyUser['permissions']) {
  const { currentCompanyUser } = useCompany()
  return currentCompanyUser?.permissions[permission] || false
}

// Hook to check if user is admin or owner
export function useIsCompanyAdmin() {
  const { currentCompanyUser } = useCompany()
  return currentCompanyUser?.role === 'admin' || currentCompanyUser?.role === 'owner'
}

// Hook to check if user is owner
export function useIsCompanyOwner() {
  const { currentCompanyUser } = useCompany()
  return currentCompanyUser?.role === 'owner'
}
