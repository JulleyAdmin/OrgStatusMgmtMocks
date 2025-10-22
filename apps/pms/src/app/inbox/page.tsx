'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { Task } from '@/types'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { useCompany } from '@/contexts/CompanyContext'
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Filter,
  Calendar,
  User,
  Inbox as InboxIcon
} from 'lucide-react'
import Link from 'next/link'

export default function InboxPage() {
  const { user } = useAuthStore()
  const { companyId } = useCompany()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'overdue'>('all')

  useEffect(() => {
    const loadUserTasks = async () => {
      if (!user || !companyId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Query tasks where the current user is the assignee
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('assignee', '==', user.id)
        )
        
        const snapshot = await getDocs(tasksQuery)
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[]

        // Sort by due date (earliest first) and priority
        const sortedTasks = tasksData.sort((a, b) => {
          // First by status (todo and in_progress first)
          if ((a.status === 'todo' || a.status === 'in_progress') && 
              (b.status !== 'todo' && b.status !== 'in_progress')) {
            return -1
          }
          if ((b.status === 'todo' || b.status === 'in_progress') && 
              (a.status !== 'todo' && a.status !== 'in_progress')) {
            return 1
          }
          
          // Then by due date
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })

        setTasks(sortedTasks)
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserTasks()
  }, [user, companyId])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-gray-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-orange-600" />
    }
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'done' || status === 'cancelled') return false
    return new Date(dueDate) < new Date()
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'overdue') return isOverdue(task.dueDate, task.status)
    return task.status === filter
  })

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate, t.status)).length,
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
            <p className="text-gray-600">Your assigned tasks and work items</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <InboxIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-orange-600">{stats.todo}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({stats.total})
              </Button>
              <Button
                variant={filter === 'todo' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('todo')}
              >
                To Do ({stats.todo})
              </Button>
              <Button
                variant={filter === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('in_progress')}
              >
                In Progress ({stats.inProgress})
              </Button>
              <Button
                variant={filter === 'overdue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('overdue')}
              >
                Overdue ({stats.overdue})
              </Button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filter === 'all' ? 'All Tasks' : 
               filter === 'overdue' ? 'Overdue Tasks' :
               filter === 'todo' ? 'To Do Tasks' : 'In Progress Tasks'}
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <InboxIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? "You don't have any tasks assigned yet."
                    : `No ${filter === 'overdue' ? 'overdue' : filter.replace('_', ' ')} tasks.`
                  }
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="mt-1">
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {task.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            {isOverdue(task.dueDate, task.status) && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                                Overdue
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{task.estimatedHours}h estimated</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          task.status === 'done' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

