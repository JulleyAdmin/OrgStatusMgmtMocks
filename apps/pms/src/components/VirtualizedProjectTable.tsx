import * as React from "react"
import { EnhancedProject } from "@/types/project-schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ActionMenu, createViewAction, createEditAction, createDeleteAction } from "@/components/ui/action-menu"
import { 
  Calendar, 
  DollarSign, 
  Users, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import { VirtualizedTable, VirtualizedTableColumn } from "./VirtualizedTable"

export interface VirtualizedProjectTableProps {
  projects: EnhancedProject[]
  onEdit?: (project: EnhancedProject) => void
  onDelete?: (project: EnhancedProject) => void
  onView?: (project: EnhancedProject) => void
  className?: string
  height?: number
  loading?: boolean
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'planning':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'on-hold':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

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

export const VirtualizedProjectTable: React.FC<VirtualizedProjectTableProps> = ({
  projects,
  onEdit,
  onDelete,
  onView,
  className,
  height = 500,
  loading = false
}) => {
  const columns: VirtualizedTableColumn<EnhancedProject>[] = [
    {
      key: 'name',
      header: 'Project Name',
      width: 300,
      render: (project) => (
        <div>
          <div className="font-semibold text-gray-900">{project.name}</div>
          <div className="text-sm text-gray-500 truncate max-w-[280px]">
            {project.description}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: 120,
      render: (project) => (
        <Badge variant="outline" className={getStatusColor(project.status)}>
          {project.status}
        </Badge>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      width: 120,
      render: (project) => (
        <Badge variant="outline" className={getPriorityColor(project.priority)}>
          {project.priority}
        </Badge>
      )
    },
    {
      key: 'budget',
      header: 'Budget',
      width: 150,
      render: (project) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="font-medium">
            ${project.budget?.toLocaleString() || 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'progress',
      header: 'Progress',
      width: 150,
      render: (project) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
            {project.progress || 0}%
          </span>
        </div>
      )
    },
    {
      key: 'team',
      header: 'Team Size',
      width: 120,
      render: (project) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium">
            {project.team?.length || 0}
          </span>
        </div>
      )
    },
    {
      key: 'startDate',
      header: 'Start Date',
      width: 120,
      render: (project) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 100,
      render: (project) => (
        <div className="flex items-center gap-1">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onView(project)
              }}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(project)
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(project)
              }}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <VirtualizedTable
      data={projects}
      columns={columns}
      height={height}
      itemHeight={80}
      className={className}
      loading={loading}
      emptyMessage="No projects found"
      onRowClick={onView}
    />
  )
}
