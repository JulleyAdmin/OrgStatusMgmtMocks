'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCompany } from '@/hooks/useCompany'
import { TaskTemplateService } from '@/lib/services'
import { CheckCircle, Clock, AlertCircle, Play, CheckSquare, Plus, FileText } from 'lucide-react'
import { DragEndEvent } from '@dnd-kit/core'
import type { GeneratedTask } from '@/types/task-template-schema'
import { TaskListView } from './TaskListView'
import { TaskKanbanView } from './TaskKanbanView'
import { TaskForm } from './TaskForm'
import { isOverdue } from './utils'

export function TaskDashboard() {
  const { currentCompany } = useCompany()
  const [tasks, setTasks] = useState<GeneratedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedTask, setSelectedTask] = useState<GeneratedTask | null>(null)
  const [taskFormMode, setTaskFormMode] = useState<'create' | 'edit' | 'view' | 'progress' | null>(null)
  const [progressUpdate, setProgressUpdate] = useState('')
  const [completionNotes, setCompletionNotes] = useState('')
  
  // Drag and drop state
  const [activeId, setActiveId] = useState<string | null>(null)

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ]

  useEffect(() => {
    if (currentCompany?.id) {
      loadUserTasks()
    }
  }, [currentCompany])

  async function loadUserTasks() {
    if (!currentCompany?.id) return

    try {
      setLoading(true)
      const userId = 'current-user-id'
      const tasksData = await TaskTemplateService.getUserTasks(currentCompany.id, userId)
      setTasks(tasksData)
    } catch (error) {
      console.error('Error loading user tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleTaskFormSubmit(data: any) {
    if (!currentCompany?.id || !data.title || !data.dueDate) {
      return
    }

    try {
      const userId = 'current-user-id'
      
      if (taskFormMode === 'create') {
        await TaskTemplateService.createManualTask(currentCompany.id, userId, {
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          estimatedHours: data.estimatedHours,
          dueDate: data.dueDate
        })
      } else if (taskFormMode === 'edit' && selectedTask?.id) {
        await TaskTemplateService.updateTaskStatus(currentCompany.id, selectedTask.id, selectedTask.status, {
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          estimatedHours: data.estimatedHours,
          dueDate: data.dueDate
        })
      }
      
      setTaskFormMode(null)
      await loadUserTasks()
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  async function handleProgressUpdate() {
    if (!currentCompany?.id || !progressUpdate || !selectedTask?.id) {
      return
    }

    try {
      const progress = parseInt(progressUpdate)
      if (progress >= 0 && progress <= 100) {
        await TaskTemplateService.updateTaskProgress(
          currentCompany.id, 
          selectedTask.id, 
          progress, 
          completionNotes
        )
        setProgressUpdate('')
        setCompletionNotes('')
        setTaskFormMode(null)
        await loadUserTasks()
      }
    } catch (error) {
      console.error('Error updating task progress:', error)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    
    if (!over) return
    
    const taskId = active.id as string
    const newStatus = over.id as string
    
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status === newStatus) return
    
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus as GeneratedTask['status'] } : t
      )
    )
    
    try {
      await TaskTemplateService.updateTaskStatus(currentCompany?.id || '', taskId, newStatus as GeneratedTask['status'])
    } catch (error) {
      console.error('Error updating task status:', error)
      await loadUserTasks()
    }
  }

  function handleDragStart(event: any) {
    setActiveId(event.active.id as string)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  async function updateTaskStatus(taskId: string, status: GeneratedTask['status']) {
    if (!currentCompany?.id || !taskId) {
      console.error('Cannot update task status: missing company or task ID')
      return
    }

    try {
      await TaskTemplateService.updateTaskStatus(currentCompany.id, taskId, status)
      await loadUserTasks()
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  async function updateTaskProgress(taskId: string) {
    if (!currentCompany?.id || !progressUpdate || !taskId) {
      console.error('Cannot update task progress: missing company, progress, or task ID')
      return
    }

    try {
      const progress = parseInt(progressUpdate)
      if (progress >= 0 && progress <= 100) {
        await TaskTemplateService.updateTaskProgress(
          currentCompany.id, 
          taskId, 
          progress, 
          completionNotes
        )
        setProgressUpdate('')
        setCompletionNotes('')
        await loadUserTasks()
      }
    } catch (error) {
      console.error('Error updating task progress:', error)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const taskStats = {
    total: tasks.length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => isOverdue(t)).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
          <p className="text-gray-600">Manage your assigned tasks and track your progress</p>
        </div>
        <Button 
          onClick={() => setTaskFormMode('create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-blue-600">{taskStats.assigned}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{taskStats.inProgress}</p>
              </div>
              <Play className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <TaskListView
            tasks={filteredTasks}
            onStatusChange={(taskId, status) => updateTaskStatus(taskId, status)}
            onStartTask={(taskId) => updateTaskStatus(taskId, 'in_progress')}
            onUpdateProgress={(task) => {
              setSelectedTask(task)
              setTaskFormMode('view')
            }}
            onViewTask={(task) => {
              setSelectedTask(task)
              setTaskFormMode('view')
            }}
          />
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <TaskKanbanView
            tasks={filteredTasks}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            activeId={activeId}
          />
        </TabsContent>
      </Tabs>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CheckSquare className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your search criteria'
              : 'You have no assigned tasks at the moment'
            }
          </p>
        </div>
      )}

      {/* Task Form Dialog - Handles Create, Edit, View, and Progress Update */}
      <TaskForm
        isOpen={!!taskFormMode}
        onClose={() => {
          setTaskFormMode(null)
          setSelectedTask(null)
        }}
        onSubmit={handleTaskFormSubmit}
        mode={taskFormMode === 'progress' ? 'view' : taskFormMode || 'create'}
        task={selectedTask}
        isUpdatingProgress={false}
        progressUpdate={progressUpdate}
        onProgressUpdate={(progress, notes) => {
          setProgressUpdate(progress)
          setCompletionNotes(notes)
        }}
        completionNotes={completionNotes}
        onNotesChange={(notes) => setCompletionNotes(notes)}
      />
    </div>
  )
}

