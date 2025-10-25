'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Breadcrumb } from '@/components/Breadcrumb'
import { MyTasksDashboard } from '@/components/MyTasksDashboard'

export default function MyTasksPage() {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'My Tasks', href: '/my-tasks' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <MyTasksDashboard />
      </div>
    </DashboardLayout>
  )
}
