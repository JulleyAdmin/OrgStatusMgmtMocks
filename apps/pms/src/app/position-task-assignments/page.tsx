'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PositionTaskAssignmentManagement } from '@/components/PositionTaskAssignmentManagement'

export default function PositionTaskAssignmentsPage() {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Task Management', href: '/tasks' },
    { label: 'Position Assignments', href: '/position-task-assignments' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <PositionTaskAssignmentManagement />
      </div>
    </DashboardLayout>
  )
}
