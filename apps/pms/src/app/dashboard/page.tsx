'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { DashboardMetrics, Project, Task, Activity } from '../../types'
import { COMPANY_CONFIG } from '../../config/company'
import { DashboardLayout } from '../../components/DashboardLayout'

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
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{COMPANY_CONFIG.name} Dashboard</h1>
          <p className="text-gray-600">{COMPANY_CONFIG.industry} Operations Overview</p>
        </div>

        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
              <p className="text-3xl font-bold text-blue-600">{metrics.activeProjects}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Completed Tasks</h3>
              <p className="text-3xl font-bold text-green-600">{metrics.completedTasks}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Quality Score</h3>
              <p className="text-3xl font-bold text-purple-600">{metrics.qualityScore}%</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Safety Score</h3>
              <p className="text-3xl font-bold text-orange-600">{metrics.safetyScore}%</p>
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active {COMPANY_CONFIG.name} Projects</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">Equipment: {project.equipmentType}</span>
                      <span className="text-sm text-gray-500">Phase: {project.manufacturingPhase}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Welcome to {COMPANY_CONFIG.name} PMS!</h3>
          <p className="text-blue-700">
            You're now logged in as <strong>{user?.name}</strong> ({user?.role}). 
            This is your project management dashboard for {COMPANY_CONFIG.industry.toLowerCase()} operations.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
