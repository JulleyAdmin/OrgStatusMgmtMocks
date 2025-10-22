'use client'

import { useState, useEffect } from 'react'
import { UserCheck, History, Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Position, PositionAssignment } from '@/types/org-schema'
import type { User } from '@/types'
import {
  assignUserToPosition,
  getCurrentAssignment,
  getPositionAssignmentHistory,
  endPositionAssignment,
  getPositions,
} from '@/lib/org-services'
import { useCompany } from '@/contexts/CompanyContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function AssignmentManagement() {
  const { currentCompany } = useCompany()
  const companyId = currentCompany?.id
  const [positions, setPositions] = useState<Position[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [assignments, setAssignments] = useState<
    Array<{
      position: Position
      currentAssignment: PositionAssignment | null
      currentUser: User | null
    }>
  >([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [assignmentHistory, setAssignmentHistory] = useState<PositionAssignment[]>([])

  // Form state
  const [formData, setFormData] = useState({
    positionId: '',
    userId: '',
    assignmentType: 'permanent' as 'permanent' | 'temporary' | 'acting',
    startAt: new Date().toISOString().split('T')[0],
    endAt: '',
    reason: '',
    notes: '',
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
      
      // Load positions
      const positionsData = await getPositions(companyId)
      setPositions(positionsData)

      // Load users from companies/{companyId}/users
      const usersRef = collection(db, 'companies', companyId, 'users')
      const usersSnap = await getDocs(usersRef)
      const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as User))
      setUsers(usersData)

      // Load current assignments for each position
      const assignmentsData = await Promise.all(
        positionsData.map(async (position) => {
          const currentAssignment = await getCurrentAssignment(companyId, position.id)
          let currentUser: User | null = null
          
          if (currentAssignment) {
            currentUser = usersData.find(u => u.id === currentAssignment.userId) || null
          }

          return {
            position,
            currentAssignment,
            currentUser,
          }
        })
      )

      setAssignments(assignmentsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleAssignClick(position: Position) {
    setSelectedPosition(position)
    setFormData({
      ...formData,
      positionId: position.id,
    })
    setIsDialogOpen(true)
  }

  async function handleViewHistory(position: Position) {
    setSelectedPosition(position)
    if (!companyId) return
    
    try {
      const history = await getPositionAssignmentHistory(companyId, position.id)
      setAssignmentHistory(history)
      setHistoryDialogOpen(true)
    } catch (error) {
      console.error('Error loading assignment history:', error)
    }
  }

  function resetForm() {
    setSelectedPosition(null)
    setFormData({
      positionId: '',
      userId: '',
      assignmentType: 'permanent',
      startAt: new Date().toISOString().split('T')[0],
      endAt: '',
      reason: '',
      notes: '',
    })
    setIsDialogOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!companyId || submitting) return

    try {
      setSubmitting(true)
      const userId = 'current-user-id' // TODO: Get from auth context

      await assignUserToPosition(
        companyId,
        formData.positionId,
        formData.userId,
        {
          assignmentType: formData.assignmentType,
          startAt: formData.startAt ? new Date(formData.startAt).toISOString() : new Date().toISOString(),
          endAt: formData.endAt ? new Date(formData.endAt).toISOString() : null,
          reason: formData.reason,
          notes: formData.notes,
        },
        userId
      )

      await loadData()
      resetForm()
    } catch (error) {
      console.error('Error assigning user:', error)
      alert('Error assigning user to position. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEndAssignment(assignmentId: string) {
    if (!confirm('Are you sure you want to end this assignment?')) return
    if (!companyId || submitting) return

    try {
      setSubmitting(true)
      const userId = 'current-user-id' // TODO: Get from auth context
      await endPositionAssignment(companyId, assignmentId, new Date().toISOString(), userId)
      await loadData()
    } catch (error) {
      console.error('Error ending assignment:', error)
      alert('Error ending assignment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function getUserName(userId: string): string {
    const user = users.find(u => u.id === userId)
    return user?.name || 'Unknown User'
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Position Assignments</h2>
          <p className="text-muted-foreground">
            Assign people to positions and track assignment history
          </p>
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Assign User to Position
              {selectedPosition && ` - ${selectedPosition.title}`}
            </DialogTitle>
            <DialogDescription>
              Assign a user to this position. The current occupant will be automatically unassigned.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">Select User *</Label>
              <Select
                value={formData.userId}
                onValueChange={(value) => setFormData({ ...formData, userId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={users.length === 0 ? "No users available - Create users first" : "Select a user"} />
                </SelectTrigger>
                <SelectContent>
                  {users.length === 0 ? (
                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                      No users found. Please create users first in the Users section.
                    </div>
                  ) : (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {users.length === 0 && (
                <p className="text-xs text-amber-600">
                  ⚠️ No users available. Create users in the Settings → Users section before assigning positions.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignmentType">Assignment Type</Label>
                <Select
                  value={formData.assignmentType}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, assignmentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="acting">Acting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startAt">Start Date *</Label>
                <Input
                  id="startAt"
                  type="date"
                  value={formData.startAt}
                  onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                  required
                />
              </div>
            </div>

            {formData.assignmentType !== 'permanent' && (
              <div className="space-y-2">
                <Label htmlFor="endAt">End Date (Optional)</Label>
                <Input
                  id="endAt"
                  type="date"
                  value={formData.endAt}
                  onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g., Promotion, Transfer, New Hire"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this assignment..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Assigning...
                  </>
                ) : (
                  'Assign User'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Assignment History
              {selectedPosition && ` - ${selectedPosition.title}`}
            </DialogTitle>
            <DialogDescription>
              View all past and current assignments for this position
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {assignmentHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No assignment history available
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignmentHistory.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {getUserName(assignment.userId)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{assignment.assignmentType}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(assignment.startAt)}</TableCell>
                      <TableCell>
                        {assignment.endAt ? formatDate(assignment.endAt) : 'Current'}
                      </TableCell>
                      <TableCell>{assignment.reason}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            assignment.status === 'active'
                              ? 'default'
                              : assignment.status === 'ended'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No positions available</p>
            <p className="text-muted-foreground mb-4">
              Create positions first before assigning users
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardDescription>
              Current assignments and vacant positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Current Occupant</TableHead>
                  <TableHead>Assignment Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map(({ position, currentAssignment, currentUser }) => (
                  <TableRow key={position.id}>
                    <TableCell className="font-medium">{position.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{position.code}</Badge>
                    </TableCell>
                    <TableCell>
                      {currentUser ? (
                        <div>
                          <p className="font-medium">{currentUser.name}</p>
                          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                        </div>
                      ) : (
                        <Badge variant="secondary">Vacant</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {currentAssignment ? (
                        <Badge variant="outline">{currentAssignment.assignmentType}</Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {currentAssignment ? formatDate(currentAssignment.startAt) : '-'}
                    </TableCell>
                    <TableCell>
                      {currentAssignment ? (
                        <Badge variant="default">Assigned</Badge>
                      ) : (
                        <Badge variant="secondary">Vacant</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewHistory(position)}
                        >
                          <History className="h-4 w-4 mr-1" />
                          History
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAssignClick(position)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          {currentAssignment ? 'Reassign' : 'Assign'}
                        </Button>
                        {currentAssignment && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEndAssignment(currentAssignment.id)}
                            disabled={submitting}
                          >
                            {submitting ? 'Ending...' : 'End'}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

