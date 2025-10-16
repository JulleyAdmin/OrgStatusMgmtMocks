'use client'

import { Company } from '@/types'

interface SubscriptionOverviewProps {
  companies: Company[]
}

export function SubscriptionOverview({ companies }: SubscriptionOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate subscription statistics
  const totalRevenue = companies.reduce((sum, company) => sum + company.subscription.price, 0)
  const activeSubscriptions = companies.filter(c => c.subscription.status === 'active').length
  const planDistribution = companies.reduce((acc, company) => {
    acc[company.subscription.plan] = (acc[company.subscription.plan] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const subscriptionStats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Subscriptions',
      value: activeSubscriptions,
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Average Revenue',
      value: formatCurrency(totalRevenue / companies.length),
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Renewal Rate',
      value: '94%',
      change: '+2%',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Subscription Stats */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subscriptionStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
        
        <div className="space-y-3">
          {Object.entries(planDistribution).map(([plan, count]) => {
            const percentage = (count / companies.length) * 100
            const planColors = {
              starter: 'bg-green-500',
              professional: 'bg-blue-500',
              enterprise: 'bg-purple-500',
              custom: 'bg-orange-500',
            }
            
            return (
              <div key={plan} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${planColors[plan as keyof typeof planColors] || 'bg-gray-500'}`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {plan}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{count} companies</span>
                  <span className="text-sm text-gray-500">({percentage.toFixed(1)}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Renewals */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Renewals</h3>
        
        <div className="space-y-3">
          {companies
            .filter(company => company.subscription.status === 'active')
            .sort((a, b) => new Date(a.subscription.endDate).getTime() - new Date(b.subscription.endDate).getTime())
            .slice(0, 5)
            .map((company) => {
              const daysUntilRenewal = Math.ceil(
                (new Date(company.subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )
              
              return (
                <div key={company.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{company.name}</p>
                    <p className="text-xs text-gray-500">{company.subscription.plan} plan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(company.subscription.price)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {daysUntilRenewal > 0 ? `${daysUntilRenewal} days` : 'Expired'}
                    </p>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
