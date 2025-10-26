'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useCompany } from '@/hooks/useCompany'
import { TaskTemplateService } from '@/lib/task-template-service'
import { 
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import {
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Pause, 
  Calendar, 
  User, 
  Tag, 
  FileText,
  CheckSquare,
  XCircle,
  Edit,
  Eye,
  Plus
} from 'lucide-react'
import type { GeneratedTask } from '@/types/task-template-schema'

// Sortable Kanban Task Item Component
function KanbanTaskItem({ task }: { task: GeneratedTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id || '' })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  function getPriorityColor(priority: GeneratedTask['priority']) {
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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`p-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${isDragging ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">{task.title}</h4>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <span className="text-xs text-gray-500">
              Due: {formatDate(task.dueDate)}
            </span>
          </div>
          {task.progress > 0 && (
            <Progress value={task.progress} className="h-1" />
          )}
        </div>
      </Card>
    </div>
  )
}

// Droppable Column Component
function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div 
      ref={setNodeRef} 
      className={`min-h-[200px] transition-colors ${isOver ? 'bg-blue-50' : ''}`}
    >
      {children}
    </div>
  )
}

export function MyTasksDashboard() {
  const { currentCompany } = useCompany()
  const [tasks, setTasks] = useState<GeneratedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedTask, setSelectedTask] = useState<GeneratedTask | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [progressUpdate, setProgressUpdate] = useState('')
  const [completionNotes, setCompletionNotes] = useState('')
  
  // Manual task creation state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'custom' as const,
    priority: 'medium' as const,
    estimatedHours: 1,
    dueDate: ''
  })
  
  // Drag and drop state
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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
      // TODO: Get current user ID from auth context
      const userId = 'current-user-id'
      const tasksData = await TaskTemplateService.getUserTasks(currentCompany.id, userId)
      setTasks(tasksData)
    } catch (error) {
      console.error('Error loading user tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTask() {
    if (!currentCompany?.id || !newTask.title || !newTask.dueDate) {
      return
    }

    try {
      const userId = 'current-user-id' // TODO: Get from auth context
      await TaskTemplateService.createManualTask(currentCompany.id, userId, {
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        priority: newTask.priority,
        estimatedHours: newTask.estimatedHours,
        dueDate: newTask.dueDate
      })
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        category: 'custom',
        priority: 'medium',
        estimatedHours: 1,
        dueDate: ''
      })
      setIsCreateDialogOpen(false)
      await loadUserTasks()
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    
    if (!over) return
    
    const taskId = active.id as string
    const newStatus = over.id as string
    
    // Find the task
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status === newStatus) return
    
    // Optimistically update the UI
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus as GeneratedTask['status'] } : t
      )
    )
    
    // Update task status in the background
    try {
      await TaskTemplateService.updateTaskStatus(currentCompany?.id || '', taskId, newStatus as GeneratedTask['status'])
      // Optionally reload to get fresh data
      // await loadUserTasks()
    } catch (error) {
      console.error('Error updating task status:', error)
      // Revert on error
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

  function getStatusIcon(status: GeneratedTask['status']) {
    switch (status) {
      case 'assigned':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'in_progress':
        return <Play className="h-4 w-4 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  function getPriorityColor(priority: GeneratedTask['priority']) {
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

  function getStatusColor(status: GeneratedTask['status']) {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  function isOverdue(task: GeneratedTask) {
    const dueDate = new Date(task.dueDate)
    const now = new Date()
    return dueDate < now && task.status !== 'completed'
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
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        <p className="text-gray-600">Manage your assigned tasks and track your progress</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Task Statistics */}
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

      {/* Filters */}
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

      {/* Tasks List */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredTasks.map((task, index) => (
            <Card key={task.id || `task-${index}`} className={`hover:shadow-lg transition-shadow ${isOverdue(task) ? 'border-red-200 bg-red-50' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      {isOverdue(task) && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {formatDate(task.dueDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.estimatedHours}h estimated
                      </div>
                      {task.actualHours && (
                        <div className="flex items-center gap-1">
                          <CheckSquare className="h-4 w-4" />
                          {task.actualHours}h actual
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{task.category}</Badge>
                    </div>

                    {task.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900 font-medium">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    )}

                    {task.definitionOfDone && task.definitionOfDone.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Definition of Done:</p>
                        <div className="space-y-1">
                          {task.definitionOfDone.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                item.isCompleted ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'
                              }`}>
                                {item.isCompleted && <CheckSquare className="h-3 w-3 text-green-600" />}
                              </div>
                              <span className={item.isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Select 
                      value={task.status} 
                      onValueChange={(value) => task.id && updateTaskStatus(task.id, value as GeneratedTask['status'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {task.status === 'assigned' && task.id && (
                      <Button
                        size="sm"
                        onClick={() => updateTaskStatus(task.id!, 'in_progress')}
                      >
                        Start Task
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTask(task)
                          setIsTaskDialogOpen(true)
                        }}
                      >
                        Update Progress
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedTask(task)
                        setIsTaskDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
          >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['assigned', 'in_progress', 'completed', 'cancelled'].map(status => {
                const statusTasks = filteredTasks.filter(task => task.status === status)
                const taskIds = statusTasks.map(t => t.id || '').filter(Boolean)
                
                return (
              <Card key={status}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-700 capitalize">
                        {status.replace('_', ' ')} ({statusTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                      <DroppableColumn id={status}>
                        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                          <div className="space-y-3 h-96 overflow-y-auto">
                            {statusTasks.map((task) => (
                              <KanbanTaskItem key={task.id} task={task} />
                        ))}
                    </div>
                        </SortableContext>
                      </DroppableColumn>
                </CardContent>
              </Card>
                )
              })}
            </div>
            <DragOverlay>
              {activeId ? (
                <Card className="p-3 opacity-90 bg-white shadow-lg">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      {filteredTasks.find(t => t.id === activeId)?.title}
                    </h4>
          </div>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
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

      {/* Task Detail Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
            <DialogDescription>
              {selectedTask?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-6">
              {/* Task Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedTask.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <Badge className={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedTask.dueDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estimated Hours</label>
                  <p className="text-sm text-gray-900">{selectedTask.estimatedHours}h</p>
                </div>
              </div>

              {/* Progress Update */}
              {selectedTask.status === 'in_progress' && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Update Progress
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={progressUpdate}
                        onChange={(e) => setProgressUpdate(e.target.value)}
                        placeholder="Enter progress %"
                        className="w-32"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Notes
                    </label>
                    <Textarea
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                      placeholder="Add progress notes..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setProgressUpdate('')
                        setCompletionNotes('')
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={() => {
                        if (selectedTask.id) {
                        updateTaskProgress(selectedTask.id)
                        setIsTaskDialogOpen(false)
                        }
                      }}
                      disabled={!selectedTask.id}
                    >
                      Update Progress
                    </Button>
                  </div>
                </div>
              )}

              {/* Definition of Done */}
              {selectedTask.definitionOfDone && selectedTask.definitionOfDone.length > 0 && (
                <div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Definition of Done
                    </label>
                    <div className="space-y-2">
                      {selectedTask.definitionOfDone.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            item.isCompleted ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'
                          }`}>
                            {item.isCompleted && <CheckSquare className="h-3 w-3 text-green-600" />}
                          </div>
                          <span className={`text-sm ${
                            item.isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'
                          }`}>
                            {item.text}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.evidence?.length || 0} evidence
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your task list
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Task Title *
              </label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Description
              </label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Category *
                </label>
                <Select
                  value={newTask.category}
                  onValueChange={(value) => setNewTask({ ...newTask, category: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Priority *
                </label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Estimated Hours *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseInt(e.target.value) || 1 })}
                  placeholder="Estimated hours"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Due Date *
                </label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setNewTask({
                    title: '',
                    description: '',
                    category: 'custom',
                    priority: 'medium',
                    estimatedHours: 1,
                    dueDate: ''
                  })
                  setIsCreateDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTask}
                disabled={!newTask.title || !newTask.dueDate}
              >
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
