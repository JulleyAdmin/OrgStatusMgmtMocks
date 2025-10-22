'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DepartmentManagement } from '@/components/Org/DepartmentManagement'
import { PositionManagement } from '@/components/Org/PositionManagement'
import { AssignmentManagement } from '@/components/Org/AssignmentManagement'
import { OccupantSwap } from '@/components/Org/OccupantSwap'
import { DelegationManagement } from '@/components/Org/DelegationManagement'
import { AuditReport } from '@/components/Org/AuditReport'
import { Building2, Briefcase, UserCheck, ArrowLeftRight, Shield, FileText } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { getDepartments, getPositions } from '@/lib/org-services'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function OrgStructurePage() {
  const [activeTab, setActiveTab] = useState('departments')
  const { currentCompany } = useCompany()
  const [stats, setStats] = useState({
    departments: 0,
    positions: 0,
    activeAssignments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!currentCompany?.id) return
      
      try {
        setLoading(true)
        const companyId = currentCompany.id

        // Fetch departments count
        const depts = await getDepartments(companyId)
        
        // Fetch positions count
        const positions = await getPositions(companyId)
        
        // Fetch active assignments count
        const assignmentsRef = collection(db, 'companies', companyId, 'positionAssignments')
        const activeQuery = query(assignmentsRef, where('endAt', '==', null))
        const assignmentsSnap = await getDocs(activeQuery)
        
        setStats({
          departments: depts.length,
          positions: positions.length,
          activeAssignments: assignmentsSnap.size,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [currentCompany?.id])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb />
        
        {/* Header */}
        <div>
          <p className="text-muted-foreground">
            Manage departments, positions, assignments, and delegations with full audit trail
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.departments}
              </div>
              <p className="text-xs text-muted-foreground">Organizational departments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positions</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.positions}
              </div>
              <p className="text-xs text-muted-foreground">Defined positions & roles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.activeAssignments}
              </div>
              <p className="text-xs text-muted-foreground">Current position occupants</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Positions
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="swap" className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Swap
            </TabsTrigger>
            <TabsTrigger value="delegations" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Delegations
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="space-y-4">
            <DepartmentManagement />
          </TabsContent>

          <TabsContent value="positions" className="space-y-4">
            <PositionManagement />
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <AssignmentManagement />
          </TabsContent>

          <TabsContent value="swap" className="space-y-4">
            <OccupantSwap />
          </TabsContent>

          <TabsContent value="delegations" className="space-y-4">
            <DelegationManagement />
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <AuditReport />
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>EPIC A — Org & Identity Features</CardTitle>
            <CardDescription>
              Complete organization structure management with history and compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Department Management
                </h4>
                <p className="text-sm text-muted-foreground">
                  Create and manage organizational departments with hierarchy, locations, and budget tracking.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Position Definition
                </h4>
                <p className="text-sm text-muted-foreground">
                  Define positions with skills, responsibilities, reporting structure, and approval authority.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  Assignment History
                </h4>
                <p className="text-sm text-muted-foreground">
                  Track who held which position when, with full historical records and automatic transitions.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4 text-primary" />
                  Occupant Swap
                </h4>
                <p className="text-sm text-muted-foreground">
                  Swap position occupants with automatic work item reassignment within 60 seconds.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Delegations
                </h4>
                <p className="text-sm text-muted-foreground">
                  Time-bounded authority delegations by scope with optional approval workflows.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Compliance Audit
                </h4>
                <p className="text-sm text-muted-foreground">
                  Full audit trail with compliance reports showing who approved what and when.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

