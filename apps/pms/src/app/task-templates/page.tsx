'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Breadcrumb } from '@/components/Breadcrumb'
import { TaskTemplateManagement } from '@/components/TaskTemplateManagement'

export default function TaskTemplatesPage() {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Task Management', href: '/tasks' },
    { label: 'Task Templates', href: '/task-templates' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <TaskTemplateManagement />
      </div>
    </DashboardLayout>
  )
}
