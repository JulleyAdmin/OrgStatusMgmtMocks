'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckSquare, User } from 'lucide-react'
import type { GeneratedTask } from '@/types/task-template-schema'
import { formatDate, getPriorityColor } from './utils'
import { useCompany } from '@/contexts/CompanyContext'
import { useAuthStore } from '@/store/authStore'
import { UserService } from '@/lib/services'
import type { User } from '@/types'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => void
  mode: 'create' | 'edit' | 'view' | 'progress'
  task?: GeneratedTask | null
  isUpdatingProgress?: boolean
  progressUpdate?: string
  onProgressUpdate?: (progress: string, notes: string) => void
  completionNotes?: string
  onNotesChange?: (notes: string) => void
}

export interface TaskFormData {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedHours: number
  dueDate: string
  assignee?: string
  reporter?: string
  progress?: string
  notes?: string
}

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  mode,
  task,
  isUpdatingProgress,
  progressUpdate = '',
  onProgressUpdate,
  completionNotes = '',
  onNotesChange
}: TaskFormProps) {
  const { companyId } = useCompany()
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: 'custom',
    priority: 'medium',
    estimatedHours: 1,
    dueDate: '',
    assignee: '',
    reporter: currentUser?.id || '',
    progress: '',
    notes: ''
  })
  
  // Load users when dialog opens
  useEffect(() => {
    if (isOpen && companyId) {
      loadUsers()
      // Set default reporter to current user
      if (currentUser && mode === 'create') {
        setFormData(prev => ({ ...prev, reporter: currentUser.id }))
      }
    }
  }, [isOpen, companyId, currentUser, mode])
  
  async function loadUsers() {
    if (!companyId) return
    try {
      setLoadingUsers(true)
      const usersData = await UserService.getUsers(companyId)
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  // Load task data when editing
  useEffect(() => {
    if (mode === 'edit' && task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        estimatedHours: task.estimatedHours,
        dueDate: new Date(task.dueDate).toISOString().split('T')[0] || '',
        assignee: '', // TODO: Get from task data if available
        reporter: currentUser?.id || '',
      })
    }
  }, [task, mode, currentUser])

  const handleSubmit = () => {
    onSubmit(formData)
    // Reset form for create mode
    if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        category: 'custom',
        priority: 'medium',
        estimatedHours: 1,
        dueDate: '',
        assignee: '',
        reporter: currentUser?.id || '',
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      category: 'custom',
      priority: 'medium',
      estimatedHours: 1,
      dueDate: '',
      assignee: '',
      reporter: currentUser?.id || '',
    })
    onClose()
  }

  // For progress update mode
  if (isUpdatingProgress) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{task?.title}</DialogTitle>
            <DialogDescription>
              Update task progress
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
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
                  onChange={(e) => onProgressUpdate?.(e.target.value, completionNotes)}
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
                onChange={(e) => onNotesChange?.(e.target.value)}
                placeholder="Add progress notes..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                onProgressUpdate?.(progressUpdate, completionNotes)
                onClose()
              }}>
                Update Progress
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // For view mode
  if (mode === 'view' && task) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
            <DialogDescription>
              {task.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="text-sm text-gray-900 capitalize">{task.status.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <p className="text-sm text-gray-900">{formatDate(task.dueDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Estimated Hours</label>
                <p className="text-sm text-gray-900">{task.estimatedHours}h</p>
              </div>
            </div>

            {task.definitionOfDone && task.definitionOfDone.length > 0 && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Definition of Done
                  </label>
                  <div className="space-y-2">
                    {task.definitionOfDone.map((item, index) => (
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // For create/edit mode
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new task to your task list' : 'Update task details'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Task Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Assignee
              </label>
              <Select
                value={formData.assignee}
                onValueChange={(value) => setFormData({ ...formData, assignee: value })}
                disabled={loadingUsers}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{user.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Reporter
              </label>
              <Select
                value={formData.reporter}
                onValueChange={(value) => setFormData({ ...formData, reporter: value })}
                disabled={loadingUsers}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reporter" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{user.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Category *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
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
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
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
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 1 })}
                placeholder="Estimated hours"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Due Date *
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.dueDate}
            >
              {mode === 'create' ? 'Create Task' : 'Update Task'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

