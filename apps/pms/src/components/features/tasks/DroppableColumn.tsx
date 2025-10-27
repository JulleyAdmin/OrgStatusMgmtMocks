import { useDroppable } from '@dnd-kit/core'

interface DroppableColumnProps {
  id: string
  children: React.ReactNode
}

export function DroppableColumn({ id, children }: DroppableColumnProps) {
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

