// Platform-specific types for multi-tenant management

export interface Company {
  id: string
  name: string
  domain: string
  industry: string
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  subscription: Subscription
  settings: CompanySettings
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  companyId: string
  plan: 'starter' | 'professional' | 'enterprise' | 'custom'
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  startDate: string
  endDate: string
  maxUsers: number
  maxProjects: number
  features: string[]
  billingCycle: 'monthly' | 'yearly'
  price: number
  currency: string
}

export interface CompanySettings {
  timezone: string
  dateFormat: string
  currency: string
  language: string
  notifications: NotificationSettings
  integrations: IntegrationSettings
  customFields: Record<string, any>
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  weeklyReports: boolean
  monthlyReports: boolean
  alerts: boolean
}

export interface IntegrationSettings {
  slack: boolean
  microsoftTeams: boolean
  googleWorkspace: boolean
  salesforce: boolean
  customApi: boolean
}

export interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'manager' | 'user'
  companyId: string
  department?: string
  position?: string
  avatar?: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
  order: number
}

export interface OnboardingProgress {
  companyId: string
  steps: OnboardingStep[]
  currentStep: number
  completedAt?: string
  startedAt: string
}

export interface PlatformMetrics {
  totalCompanies: number
  activeCompanies: number
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRecurringRevenue: number
  churnRate: number
  averageRevenuePerUser: number
}

export interface AuditLog {
  id: string
  companyId: string
  userId: string
  action: string
  resource: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: string
}
