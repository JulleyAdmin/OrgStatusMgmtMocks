'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftRight, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Position, PositionAssignment, OccupantSwapRequest } from '@/types/org-schema'
import type { User } from '@/types'
import { swapOccupants, getCurrentAssignment, getPositions, getAllActiveAssignments } from '@/lib/services/org'
import { useCompany } from '@/contexts/CompanyContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function OccupantSwap() {
  const { currentCompany } = useCompany()
  const companyId = currentCompany?.id
  const [positions, setPositions] = useState<Position[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [assignedPositions, setAssignedPositions] = useState<
    Array<{
      position: Position
      assignment: PositionAssignment
      user: User
    }>
  >([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [swapResult, setSwapResult] = useState<OccupantSwapRequest | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    positionAId: '',
    positionBId: '',
    reason: '',
    notes: '',
    effectiveDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (currentCompany) {
      loadData()
    }
  }, [currentCompany])

  async function loadData() {
    if (!companyId) return

    try {
      setLoading(true)

      // Load positions, users, and active assignments in parallel
      const [positionsData, usersSnap, assignmentsData] = await Promise.all([
        getPositions(companyId),
        getDocs(collection(db, 'companies', companyId, 'users')),
        getAllActiveAssignments(companyId)
      ])

      const usersData = usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User))
      
      setPositions(positionsData)
      setUsers(usersData)

      // Create a map for fast lookups
      const usersMap = new Map(usersData.map(u => [u.id, u]))
      const positionsMap = new Map(positionsData.map(p => [p.id, p]))

      // Build assigned positions by matching assignments with positions and users
      const assigned: Array<{
        position: Position
        assignment: PositionAssignment
        user: User
      }> = []

      for (const assignment of assignmentsData) {
        const position = positionsMap.get(assignment.positionId)
        const user = usersMap.get(assignment.userId)
        
        if (position && user) {
          assigned.push({ position, assignment, user })
        }
      }

      setAssignedPositions(assigned)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      positionAId: '',
      positionBId: '',
      reason: '',
      notes: '',
      effectiveDate: new Date().toISOString().split('T')[0],
    })
    setSwapResult(null)
  }

  async function handleSwap(e: React.FormEvent) {
    e.preventDefault()
    if (!companyId) return

    if (formData.positionAId === formData.positionBId) {
      alert('Please select two different positions')
      return
    }

    if (
      !confirm(
        'Are you sure you want to swap these occupants? This will reassign all open work items.'
      )
    ) {
      return
    }

    try {
      setSwapping(true)
      const userId = 'current-user-id' // TODO: Get from auth context

      const result = await swapOccupants(
        companyId,
        formData.positionAId,
        formData.positionBId,
        formData.reason,
        formData.notes,
        formData.effectiveDate ? new Date(formData.effectiveDate).toISOString() : new Date().toISOString(),
        userId
      )

      setSwapResult(result)
      await loadData()
    } catch (error) {
      console.error('Error swapping occupants:', error)
      alert('Error swapping occupants. Please try again.')
    } finally {
      setSwapping(false)
    }
  }

  function getPositionInfo(positionId: string) {
    const item = assignedPositions.find((ap) => ap.position.id === positionId)
    if (!item) return null
    return {
      position: item.position,
      user: item.user,
    }
  }

  function closeDialog() {
    setIsDialogOpen(false)
    resetForm()
  }

  const positionAInfo = formData.positionAId ? getPositionInfo(formData.positionAId) : null
  const positionBInfo = formData.positionBId ? getPositionInfo(formData.positionBId) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Occupant Swap</h2>
          <p className="text-muted-foreground">
            Swap two position occupants and automatically reassign work items
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Swap Occupants
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Swap Position Occupants</DialogTitle>
              <DialogDescription>
                Select two positions to swap their occupants. All open work items will be
                automatically reassigned within 60 seconds.
              </DialogDescription>
            </DialogHeader>

            {!swapResult ? (
              <form onSubmit={handleSwap} className="space-y-6">
                {/* Position Selectors */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
                  {/* Position A */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="positionA">Position A *</Label>
                      <Select
                        value={formData.positionAId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, positionAId: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position A" />
                        </SelectTrigger>
                        <SelectContent className="z-[10000]">
                          {assignedPositions.map(({ position, user }) => (
                            <SelectItem
                              key={position.id}
                              value={position.id}
                              disabled={position.id === formData.positionBId}
                            >
                              {position.title} - {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {positionAInfo && (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <p className="font-semibold">{positionAInfo.position.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Code: {positionAInfo.position.code}
                            </p>
                            <div className="pt-2">
                              <p className="text-sm font-medium">Current Occupant:</p>
                              <p className="text-sm">{positionAInfo.user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {positionAInfo.user.email}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Swap Icon - Hidden on mobile, shown on larger screens */}
                  <div className="hidden lg:flex items-center justify-center pt-8">
                    <ArrowLeftRight className="h-8 w-8 text-muted-foreground" />
                  </div>

                  {/* Position B */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="positionB">Position B *</Label>
                      <Select
                        value={formData.positionBId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, positionBId: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position B" />
                        </SelectTrigger>
                        <SelectContent className="z-[10000]">
                          {assignedPositions.map(({ position, user }) => (
                            <SelectItem
                              key={position.id}
                              value={position.id}
                              disabled={position.id === formData.positionAId}
                            >
                              {position.title} - {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {positionBInfo && (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <p className="font-semibold">{positionBInfo.position.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Code: {positionBInfo.position.code}
                            </p>
                            <div className="pt-2">
                              <p className="text-sm font-medium">Current Occupant:</p>
                              <p className="text-sm">{positionBInfo.user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {positionBInfo.user.email}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="effectiveDate">Effective Date *</Label>
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) =>
                        setFormData({ ...formData, effectiveDate: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason *</Label>
                    <Input
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="e.g., Organizational restructuring"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional details about the swap..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-yellow-900">Important Notes:</p>
                      <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
                        <li>Current assignments will be ended automatically</li>
                        <li>New cross-assignments will be created</li>
                        <li>All open tasks will be reassigned to new occupants</li>
                        <li>Projects managed by these positions will be updated</li>
                        <li>This action is logged in the audit trail</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={swapping}>
                    {swapping ? 'Swapping...' : 'Execute Swap'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-green-900">Swap Completed!</p>
                      <p className="text-sm text-green-800">
                        The occupants have been successfully swapped.
                      </p>
                    </div>
                  </div>
                </div>

                {swapResult.reassignmentDetails && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Work Item Reassignment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tasks Reassigned</p>
                          <p className="text-2xl font-bold">
                            {swapResult.reassignmentDetails.tasksReassigned}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Projects Updated</p>
                          <p className="text-2xl font-bold">
                            {swapResult.reassignmentDetails.projectsUpdated}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Approvals Transferred</p>
                          <p className="text-2xl font-bold">
                            {swapResult.reassignmentDetails.approvalsTransferred}
                          </p>
                        </div>
                      </div>

                      {swapResult.reassignmentDetails.errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                          <p className="text-sm font-medium text-red-900 mb-2">
                            Some errors occurred:
                          </p>
                          <ul className="text-sm text-red-800 list-disc list-inside">
                            {swapResult.reassignmentDetails.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button onClick={closeDialog}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading positions...</p>
        </div>
      ) : assignedPositions.length < 2 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <ArrowLeftRight className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Not enough assigned positions</p>
            <p className="text-muted-foreground mb-4">
              You need at least 2 positions with assigned occupants to perform a swap
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Assigned Positions ({assignedPositions.length})</CardTitle>
            <CardDescription>
              Positions with current occupants eligible for swapping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedPositions.map(({ position, user, assignment }) => (
                <div
                  key={position.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{position.title}</p>
                      <Badge variant="outline">{position.code}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Occupant:</p>
                        <p className="text-sm font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email:</p>
                        <p className="text-sm">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Since:</p>
                        <p className="text-sm">
                          {new Date(assignment.startAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Badge variant="secondary">{assignment.assignmentType}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

