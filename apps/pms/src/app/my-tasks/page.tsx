'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Breadcrumb } from '@/components/Breadcrumb'
import { TaskDashboard } from '@/components/features/tasks'

export default function MyTasksPage() {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'My Tasks', href: '/my-tasks' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <TaskDashboard />
      </div>
    </DashboardLayout>
  )
}
