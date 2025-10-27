'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { OrgChartVisualization } from '@/components/features/org'
import { useCompany } from '@/contexts/CompanyContext'
import { getPositions, getDepartments, getCurrentAssignment } from '@/lib/services/org'
import { UserService } from '@/lib/services'
import { Position, Department, PositionAssignment } from '@/types/org-schema'
import { User } from '@/types'
import { Loader2, FileDown, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/Breadcrumb'

export default function OrgChartPage() {
  const router = useRouter()
  const { currentCompany, companyId } = useCompany()
  const [positions, setPositions] = useState<Position[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [assignments, setAssignments] = useState<Map<string, PositionAssignment | null>>(new Map())
  const [users, setUsers] = useState<Map<string, User>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentCompany) {
      loadOrgData()
    }
  }, [currentCompany])

  async function loadOrgData() {
    if (!companyId) return

    try {
      setLoading(true)

      // Load positions, departments, and users
      const [positionsData, departmentsData, usersData] = await Promise.all([
        getPositions(companyId),
        getDepartments(companyId),
        UserService.getUsers(companyId)
      ])

      setPositions(positionsData)
      setDepartments(departmentsData)

      // Create users map for quick lookup
      const usersMap = new Map<string, User>()
      usersData.forEach(user => {
        usersMap.set(user.id, user)
      })
      setUsers(usersMap)

      // Load current assignments for each position
      const assignmentsMap = new Map<string, PositionAssignment | null>()
      await Promise.all(
        positionsData.map(async (position) => {
          const assignment = await getCurrentAssignment(companyId, position.id)
          assignmentsMap.set(position.id, assignment)
        })
      )
      setAssignments(assignmentsMap)

    } catch (error) {
      console.error('Error loading org chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNodeClick = (position: Position) => {
    // Navigate to organization page with this position selected
    router.push(`/organization?position=${position.id}`)
  }

  const handleExport = () => {
    // TODO: Implement org chart export functionality
    console.log('Export org chart')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Breadcrumb />
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Breadcrumb />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Organization Chart</h1>
            <p className="text-sm text-gray-600 mt-1">
              Visual representation of {currentCompany?.name || 'your company'} organizational structure
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadOrgData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Org Chart Visualization */}
        {positions.length > 0 ? (
        <OrgChartVisualization
          positions={positions}
          departments={departments}
          assignments={assignments}
          users={users}
          onNodeClick={handleNodeClick}
        />
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No organizational structure found. Please create departments and positions first.</p>
            <Button className="mt-4" onClick={() => router.push('/organization')}>
              Go to Organization Management
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
