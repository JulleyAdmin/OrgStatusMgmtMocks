'use client'

import { useEffect, useState } from 'react'
import { PlatformLayout } from '@/components/Layout/PlatformLayout'
import { PlatformMetrics } from '@/components/Dashboard/PlatformMetrics'
import { CompanyList } from '@/components/Dashboard/CompanyList'
import { RecentActivity } from '@/components/Dashboard/RecentActivity'
import { SubscriptionOverview } from '@/components/Dashboard/SubscriptionOverview'
import { Company, PlatformMetrics as PlatformMetricsType } from '@/types'
import { useAuthStore } from '@/store/authStore'

export default function PlatformDashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [metrics, setMetrics] = useState<PlatformMetricsType | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        // Simulate API calls - in real app, these would be actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - replace with actual API calls
        const mockCompanies: Company[] = [
          {
            id: '1',
            name: 'Caterpillar Manufacturing',
            domain: 'caterpillar.com',
            industry: 'Heavy Equipment Manufacturing',
            size: 'enterprise',
            status: 'active',
            subscription: {
              id: 'sub-1',
              companyId: '1',
              plan: 'enterprise',
              status: 'active',
              startDate: '2024-01-01',
              endDate: '2025-01-01',
              maxUsers: 1000,
              maxProjects: 500,
              features: ['advanced_analytics', 'custom_integrations'],
              billingCycle: 'yearly',
              price: 50000,
              currency: 'USD'
            },
            settings: {
              timezone: 'America/Chicago',
              dateFormat: 'MM/DD/YYYY',
              currency: 'USD',
              language: 'en',
              notifications: {
                email: true,
                sms: false,
                push: true,
                weeklyReports: true,
                monthlyReports: true,
                alerts: true
              },
              integrations: {
                slack: true,
                microsoftTeams: true,
                googleWorkspace: true,
                salesforce: true,
                customApi: true
              },
              customFields: {}
            },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          {
            id: '2',
            name: 'John Deere Construction',
            domain: 'johndeere.com',
            industry: 'Agricultural & Construction Equipment',
            size: 'large',
            status: 'active',
            subscription: {
              id: 'sub-2',
              companyId: '2',
              plan: 'professional',
              status: 'active',
              startDate: '2024-02-01',
              endDate: '2025-02-01',
              maxUsers: 500,
              maxProjects: 200,
              features: ['advanced_analytics'],
              billingCycle: 'yearly',
              price: 25000,
              currency: 'USD'
            },
            settings: {
              timezone: 'America/Chicago',
              dateFormat: 'MM/DD/YYYY',
              currency: 'USD',
              language: 'en',
              notifications: {
                email: true,
                sms: true,
                push: true,
                weeklyReports: true,
                monthlyReports: true,
                alerts: true
              },
              integrations: {
                slack: true,
                microsoftTeams: false,
                googleWorkspace: true,
                salesforce: false,
                customApi: true
              },
              customFields: {}
            },
            createdAt: '2024-02-01',
            updatedAt: '2024-02-01'
          }
        ]

        const mockMetrics: PlatformMetricsType = {
          totalCompanies: 5,
          activeCompanies: 4,
          totalUsers: 25,
          activeUsers: 23,
          totalRevenue: 85000,
          monthlyRecurringRevenue: 7083,
          churnRate: 0.05,
          averageRevenuePerUser: 3400
        }

        setCompanies(mockCompanies)
        setMetrics(mockMetrics)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </PlatformLayout>
    )
  }

  return (
    <PlatformLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
            <p className="text-gray-600">Manage companies and monitor platform performance</p>
          </div>
          <div className="text-sm text-gray-500">
            Welcome back, {user?.name || 'Admin'}
          </div>
        </div>

        {/* Metrics Overview */}
        {metrics && <PlatformMetrics metrics={metrics} />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Companies List */}
          <div className="lg:col-span-1">
            <CompanyList companies={companies} />
          </div>

          {/* Subscription Overview */}
          <div className="lg:col-span-1">
            <SubscriptionOverview companies={companies} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <RecentActivity />
        </div>
      </div>
    </PlatformLayout>
  )
}
