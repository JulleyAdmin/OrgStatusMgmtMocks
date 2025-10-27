'use client'

import { useState, useEffect } from 'react'
import { X, RefreshCw, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompany } from '@/contexts/CompanyContext'
import { getPositions, getDepartments, getCurrentAssignment } from '@/lib/services/org'
import { UserService } from '@/lib/user-services'
import { Position, Department, PositionAssignment } from '@/types/org-schema'
import { User } from '@/types'
import { OrgChartVisualization } from '@/components/features/org'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OrgChartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrgChartDrawer({ open, onOpenChange }: OrgChartDrawerProps) {
  const { currentCompany, companyId } = useCompany()
  const router = useRouter()
  const [positions, setPositions] = useState<Position[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [assignments, setAssignments] = useState<Map<string, PositionAssignment | null>>(new Map())
  const [users, setUsers] = useState<Map<string, User>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && currentCompany) {
      loadOrgData()
    }
  }, [open, currentCompany])

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
    // Close drawer and navigate to organization page with this position selected
    onOpenChange(false)
    router.push(`/organization?position=${position.id}`)
  }

  const handleExport = () => {
    // TODO: Implement org chart export functionality
    console.log('Export org chart')
  }

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      
      {/* Full Screen Drawer */}
      <div className="fixed inset-0 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Organization Chart</h2>
            <p className="text-sm text-gray-600 mt-1">
              Visual representation of {currentCompany?.name || 'your company'} organizational structure
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadOrgData} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 p-2"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : positions.length > 0 ? (
            <OrgChartVisualization
              positions={positions}
              departments={departments}
              assignments={assignments}
              users={users}
              onNodeClick={handleNodeClick}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center h-full flex items-center justify-center">
              <div>
                <p className="text-gray-500">No organizational structure found. Please create departments and positions first.</p>
                <Button className="mt-4" onClick={() => {
                  onOpenChange(false)
                  router.push('/organization')
                }}>
                  Go to Organization Management
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
