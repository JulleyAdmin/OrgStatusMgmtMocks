'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, Calendar, CheckSquare, Eye, Play, Edit } from 'lucide-react'
import type { GeneratedTask } from '@/types/task-template-schema'
import { formatDate, getPriorityColor, getStatusColor, isOverdue, getStatusIcon } from './utils'

interface TaskListViewProps {
  tasks: GeneratedTask[]
  onStatusChange: (taskId: string, status: GeneratedTask['status']) => void
  onStartTask: (taskId: string) => void
  onUpdateProgress: (task: GeneratedTask) => void
  onViewTask: (task: GeneratedTask) => void
  onEditTask: (task: GeneratedTask) => void
}

export function TaskListView({
  tasks,
  onStatusChange,
  onStartTask,
  onUpdateProgress,
  onViewTask,
  onEditTask
}: TaskListViewProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
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
                  onValueChange={(value) => task.id && onStatusChange(task.id, value as GeneratedTask['status'])}
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
                    onClick={() => onStartTask(task.id!)}
                  >
                    Start Task
                  </Button>
                )}
                {task.status === 'in_progress' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateProgress(task)}
                  >
                    Update Progress
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewTask(task)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditTask(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

