'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { COMPANY_CONFIG } from '@/config/company'
import { Task } from '@/types'
import { CheckSquare, Clock, AlertCircle, Plus } from 'lucide-react'

export default function TaskCenterPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockTasks: Task[] = [
          {
            id: '1',
            title: 'Design Robot Control System',
            description: 'Design and engineer the control system for industrial robot assembly line with AI integration.',
            status: 'done',
            priority: 'high',
            assignee: 'user-2',
            reporter: 'user-1',
            projectId: 'project-1',
            dueDate: '2024-01-30',
            estimatedHours: 80,
            actualHours: 75,
            tags: ['design', 'robotics', 'ai'],
            comments: [],
            manufacturingStep: 'Design & Engineering',
            qualityCheckpoints: ['Design Review', 'Safety Analysis'],
            safetyRequirements: ['OSHA Robotics Standards', 'Safety Testing'],
            createdAt: '2024-01-15',
            updatedAt: '2024-01-30'
          },
          {
            id: '2',
            title: 'IoT Sensor Integration',
            description: 'Integrate IoT sensors into smart manufacturing system for real-time monitoring capabilities.',
            status: 'in_progress',
            priority: 'high',
            assignee: 'user-4',
            reporter: 'user-1',
            projectId: 'project-2',
            dueDate: '2024-03-20',
            estimatedHours: 40,
            actualHours: 25,
            tags: ['iot', 'sensors', 'monitoring'],
            comments: [],
            manufacturingStep: 'Production Planning',
            qualityCheckpoints: ['Sensor Testing', 'Integration Check'],
            safetyRequirements: ['Electrical Safety', 'Data Security'],
            createdAt: '2024-02-01',
            updatedAt: '2024-03-15'
          },
          {
            id: '3',
            title: 'Machine Learning Model Development',
            description: 'Develop machine learning models for predictive maintenance and quality control automation.',
            status: 'todo',
            priority: 'medium',
            assignee: 'user-2',
            reporter: 'user-1',
            projectId: 'project-3',
            dueDate: '2024-04-15',
            estimatedHours: 60,
            actualHours: 0,
            tags: ['machine-learning', 'predictive', 'automation'],
            comments: [],
            manufacturingStep: 'Design & Engineering',
            qualityCheckpoints: ['Model Testing', 'Accuracy Validation'],
            safetyRequirements: ['Data Privacy', 'Model Validation'],
            createdAt: '2024-03-01',
            updatedAt: '2024-03-01'
          }
        ]
        
        setTasks(mockTasks)
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckSquare className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'todo':
        return <AlertCircle className="w-4 h-4 text-gray-400" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
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

  if (loading) {
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
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Center</h1>
            <p className="text-gray-600">Manage your {COMPANY_CONFIG.name} manufacturing tasks</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">All Tasks</h2>
              </div>
              <ScrollArea className="h-96">
                <div className="p-6 space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          <span>Step: {task.manufacturingStep}</span>
                        </div>
                        <div className="flex space-x-1">
                          {(Array.isArray(task.tags) ? task.tags : []).map((tag, index) => (
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

          {/* Task Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-semibold">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {tasks.filter(t => t.status === 'done').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">
                    {tasks.filter(t => t.status === 'in_progress').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-gray-600">
                    {tasks.filter(t => t.status === 'todo').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Start Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
