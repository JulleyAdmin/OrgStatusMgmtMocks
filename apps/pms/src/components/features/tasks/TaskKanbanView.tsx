'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { GeneratedTask } from '@/types/task-template-schema'
import { KanbanTaskItem } from './KanbanTaskItem'
import { DroppableColumn } from './DroppableColumn'

interface TaskKanbanViewProps {
  tasks: GeneratedTask[]
  onDragEnd: (event: DragEndEvent) => void
  onDragStart: (event: any) => void
  onDragCancel: () => void
  activeId: string | null
}

export function TaskKanbanView({
  tasks,
  onDragEnd,
  onDragStart,
  onDragCancel,
  activeId
}: TaskKanbanViewProps) {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragCancel={onDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['assigned', 'in_progress', 'completed', 'cancelled'].map(status => {
          const statusTasks = tasks.filter(task => task.status === status)
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
                {tasks.find(t => t.id === activeId)?.title}
              </h4>
            </div>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

