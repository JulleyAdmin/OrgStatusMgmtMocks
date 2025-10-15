'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { COMPANY_CONFIG } from '@/config/company'
import { EnhancedProject } from '@/types/project-schema'
import { ProjectService } from '@/lib/project-services'
import { useCompany } from '@/contexts/CompanyContext'
import { CompanySelector } from '@/components/CompanySelector'
import { Building2, Plus, Users, Calendar, DollarSign } from 'lucide-react'

export default function ProjectsPage() {
  const router = useRouter()
  const { companyId, isLoading: companyLoading } = useCompany()
  const [projects, setProjects] = useState<EnhancedProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      if (!companyId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Load projects from Firebase for the current company
        const firebaseProjects = await ProjectService.getProjects(companyId)
        console.log('Firebase projects loaded:', firebaseProjects)
        setProjects(firebaseProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
        // Fallback to empty array if Firebase fails
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [companyId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'planning':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading || companyLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Debug Company Selector */}
        <div className="mb-6">
          <CompanySelector />
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">Manage your {COMPANY_CONFIG.name} manufacturing projects</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => router.push('/projects/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
              </div>
              <ScrollArea className="h-96">
                <div className="p-6 space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{Array.isArray(project.team) ? project.team.length : 0} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(project.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${project.budget.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {(Array.isArray(project.tags) ? project.tags : []).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Project Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Projects</span>
                  <span className="font-semibold">{projects.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active</span>
                  <span className="font-semibold text-green-600">
                    {projects.filter(p => p.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Planning</span>
                  <span className="font-semibold text-blue-600">
                    {projects.filter(p => p.status === 'planning').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-gray-600">
                    {projects.filter(p => p.status === 'completed').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Types</h3>
              <div className="space-y-2">
                {COMPANY_CONFIG.equipmentTypes?.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{type}</span>
                    <span className="font-semibold">
                      {projects.filter(p => p.equipmentType === type).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/projects/create')}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Assign Team
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Timeline
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
