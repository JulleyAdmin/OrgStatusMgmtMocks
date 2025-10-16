'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { DashboardMetrics, Project, Task, Activity } from '../../types'
import { COMPANY_CONFIG } from '../../config/company'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Users, Building2, BarChart3, Settings, CheckSquare } from 'lucide-react'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        // Simulate API calls - in real app, these would be actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data for Autocracy
        const mockMetrics: DashboardMetrics = {
          totalProjects: 12,
          activeProjects: 8,
          completedProjects: 4,
          totalTasks: 156,
          completedTasks: 98,
          overdueTasks: 12,
          teamUtilization: 85,
          averageProjectDuration: 45,
          qualityScore: 94,
          safetyScore: 98
        }

        const mockProjects: Project[] = [
          {
            id: '1',
            name: 'Industrial Robot Assembly Line',
            description: 'Development of automated assembly line with advanced robotics and AI integration',
            status: 'active',
            priority: 'high',
            manager: 'user-1',
            team: ['user-2', 'user-3', 'user-4'],
            startDate: '2024-01-15',
            endDate: '2024-06-30',
            budget: 2500000,
            progress: 65,
            tags: ['robotics', 'automation', 'ai'],
            equipmentType: 'Industrial Robots',
            manufacturingPhase: 'Manufacturing',
            qualityStandards: ['ISO 9001', 'ISO 14001'],
            complianceRequirements: ['OSHA', 'CE Marking'],
            createdAt: '2024-01-15',
            updatedAt: '2024-03-15'
          },
          {
            id: '2',
            name: 'Smart Manufacturing System',
            description: 'Implementation of IoT-enabled smart manufacturing system with real-time monitoring',
            status: 'active',
            priority: 'high',
            manager: 'user-2',
            team: ['user-3', 'user-5'],
            startDate: '2024-02-01',
            endDate: '2024-07-15',
            budget: 1800000,
            progress: 45,
            tags: ['iot', 'smart-factory', 'monitoring'],
            equipmentType: 'Automation Systems',
            manufacturingPhase: 'Production Planning',
            qualityStandards: ['ISO 9001', 'Six Sigma'],
            complianceRequirements: ['OSHA', 'FDA'],
            createdAt: '2024-02-01',
            updatedAt: '2024-03-15'
          }
        ]

        setMetrics(mockMetrics)
        setProjects(mockProjects)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin!</h1>
          <p className="text-gray-600">Manage {COMPANY_CONFIG.name} administration and operations.</p>
        </div>

        {/* Key Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Team</h3>
            <p className="text-gray-600 text-sm mb-4">Manage team members and permissions</p>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
              Manage
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
            <p className="text-gray-600 text-sm mb-4">Manage project lifecycle and operations</p>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
              Manage
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
            <p className="text-gray-600 text-sm mb-4">View analytics and statistics</p>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
              View
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600 text-sm mb-4">Configure system preferences</p>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
              Configure
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Size</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">-</p>
              <p className="text-gray-600 text-sm">Active team members</p>
            </div>

            <div className="bg-white rounded-lg p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Projects</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{metrics.activeProjects}</p>
              <p className="text-gray-600 text-sm">Registered projects</p>
            </div>

            <div className="bg-white rounded-lg p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Rate</h3>
              <p className="text-3xl font-bold text-green-600 mb-1">+12%</p>
              <p className="text-gray-600 text-sm">This month</p>
            </div>

            <div className="bg-white rounded-lg p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity</h3>
              <p className="text-3xl font-bold text-purple-600 mb-1">24</p>
              <p className="text-gray-600 text-sm">Events this year</p>
            </div>
          </div>
        )}

        {/* Bottom Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 card-shadow">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New team member added</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New project created</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Task completed</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-6 card-shadow">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Approvals</span>
                <span className="text-lg font-semibold text-orange-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-lg font-semibold text-gray-900">-</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Tasks</span>
                <span className="text-lg font-semibold text-gray-900">-</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-lg font-semibold text-gray-900">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
