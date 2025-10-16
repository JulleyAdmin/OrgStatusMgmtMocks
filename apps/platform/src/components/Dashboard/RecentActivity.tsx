'use client'

interface ActivityItem {
  id: string
  type: 'company_created' | 'user_registered' | 'subscription_updated' | 'integration_added'
  message: string
  timestamp: string
  company?: string
}

export function RecentActivity() {
  // Mock recent activity data
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'company_created',
      message: 'New company registered',
      timestamp: '2024-01-15T10:30:00Z',
      company: 'Caterpillar Manufacturing'
    },
    {
      id: '2',
      type: 'user_registered',
      message: 'New user registered',
      timestamp: '2024-01-15T09:15:00Z',
      company: 'John Deere Construction'
    },
    {
      id: '3',
      type: 'subscription_updated',
      message: 'Subscription plan upgraded',
      timestamp: '2024-01-14T16:45:00Z',
      company: 'Caterpillar Manufacturing'
    },
    {
      id: '4',
      type: 'integration_added',
      message: 'Slack integration added',
      timestamp: '2024-01-14T14:20:00Z',
      company: 'John Deere Construction'
    },
    {
      id: '5',
      type: 'company_created',
      message: 'New company registered',
      timestamp: '2024-01-13T11:30:00Z',
      company: 'Komatsu Ltd'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'company_created':
        return '🏢'
      case 'user_registered':
        return '👤'
      case 'subscription_updated':
        return '💳'
      case 'integration_added':
        return '🔗'
      default:
        return '📝'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'company_created':
        return 'bg-green-100 text-green-800'
      case 'user_registered':
        return 'bg-blue-100 text-blue-800'
      case 'subscription_updated':
        return 'bg-purple-100 text-purple-800'
      case 'integration_added':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <p className="text-sm text-gray-600">Latest platform activity and events</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                {activity.company && (
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActivityColor(activity.type)}`}>
                      {activity.company}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  )
}
