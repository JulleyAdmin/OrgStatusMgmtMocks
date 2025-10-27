'use client'

import { 
  CheckCircle, 
  Clock, 
  Play, 
  XCircle 
} from 'lucide-react'
import type { GeneratedTask } from '@/types/task-template-schema'

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function getPriorityColor(priority: GeneratedTask['priority']) {
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

export function getStatusColor(status: GeneratedTask['status']) {
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

export function isOverdue(task: GeneratedTask) {
  const dueDate = new Date(task.dueDate)
  const now = new Date()
  return dueDate < now && task.status !== 'completed'
}

export function getStatusIcon(status: GeneratedTask['status']) {
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

