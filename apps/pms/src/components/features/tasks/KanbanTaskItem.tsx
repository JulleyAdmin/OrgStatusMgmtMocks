import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDate, getPriorityColor } from './utils'
import type { GeneratedTask } from '@/types/task-template-schema'

interface KanbanTaskItemProps {
  task: GeneratedTask
}

export function KanbanTaskItem({ task }: KanbanTaskItemProps) {
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

