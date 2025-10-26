'use client'

import dynamic from 'next/dynamic'

// Loading component for dynamic imports
const DefaultLoading = () => (
  <div className="space-y-4 p-4">
    <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
    <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
  </div>
)

// Pre-configured dynamic components for common use cases
export const DynamicProjectTable = dynamic(
  () => import('@/components/ProjectTable').then(mod => ({ default: mod.ProjectTable })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicVirtualizedProjectTable = dynamic(
  () => import('@/components/VirtualizedProjectTable').then(mod => ({ default: mod.VirtualizedProjectTable })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicProjectCreationWizard = dynamic(
  () => import('@/components/ProjectCreationWizard').then(mod => ({ default: mod.ProjectCreationWizard })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicProjectCreationForm = dynamic(
  () => import('@/components/ProjectCreationForm').then(mod => ({ default: mod.ProjectCreationForm })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicOrgChartVisualization = dynamic(
  () => import('@/components/Org/OrgChartVisualization').then(mod => ({ default: mod.OrgChartVisualization })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicTaskTemplateManagement = dynamic(
  () => import('@/components/TaskTemplateManagement').then(mod => ({ default: mod.TaskTemplateManagement })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicPositionTaskAssignmentManagement = dynamic(
  () => import('@/components/PositionTaskAssignmentManagement').then(mod => ({ default: mod.PositionTaskAssignmentManagement })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

// Heavy components that should be loaded on demand
export const DynamicMyTasksDashboard = dynamic(
  () => import('@/components/MyTasksDashboard').then(mod => ({ default: mod.MyTasksDashboard })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicDepartmentManagement = dynamic(
  () => import('@/components/Org/DepartmentManagement').then(mod => ({ default: mod.DepartmentManagement })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicPositionManagement = dynamic(
  () => import('@/components/Org/PositionManagement').then(mod => ({ default: mod.PositionManagement })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicAssignmentManagement = dynamic(
  () => import('@/components/Org/AssignmentManagement').then(mod => ({ default: mod.AssignmentManagement })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicDelegationManagement = dynamic(
  () => import('@/components/Org/DelegationManagement').then(mod => ({ default: mod.DelegationManagement })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)

export const DynamicAuditReport = dynamic(
  () => import('@/components/Org/AuditReport').then(mod => ({ default: mod.AuditReport })),
  { 
    loading: DefaultLoading,
    ssr: false 
  }
)