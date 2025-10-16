'use client'

import { PlatformMetrics as PlatformMetricsType } from '@/types'

interface PlatformMetricsProps {
  metrics: PlatformMetricsType
}

export function PlatformMetrics({ metrics }: PlatformMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const metricCards = [
    {
      title: 'Total Companies',
      value: metrics.totalCompanies,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Companies',
      value: metrics.activeCompanies,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      change: '+18%',
      changeType: 'positive' as const,
    },
    {
      title: 'Monthly Recurring Revenue',
      value: formatCurrency(metrics.monthlyRecurringRevenue),
      change: '+22%',
      changeType: 'positive' as const,
    },
    {
      title: 'Churn Rate',
      value: formatPercentage(metrics.churnRate),
      change: '-2%',
      changeType: 'positive' as const,
    },
    {
      title: 'ARPU',
      value: formatCurrency(metrics.averageRevenuePerUser),
      change: '+5%',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Platform Metrics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
