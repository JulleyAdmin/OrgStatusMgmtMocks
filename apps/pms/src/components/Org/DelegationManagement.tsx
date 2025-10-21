'use client'

import { useState, useEffect } from 'react'
import { Plus, Shield, X, Check, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Delegation, Position, PositionAssignment } from '@/types/org-schema'
import type { User } from '@/types'
import {
  createDelegation,
  approveDelegation,
  rejectDelegation,
  revokeDelegation,
  getActiveDelegations,
  getReceivedDelegations,
  getPositions,
  getCurrentAssignment,
} from '@/lib/org-services'
import { useCompany } from '@/contexts/CompanyContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function DelegationManagement() {
  const { currentCompany } = useCompany()
  const companyId = currentCompany?.id
  const [delegations, setDelegations] = useState<Delegation[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent')

  // Form state
  const [formData, setFormData] = useState({
    delegatorPositionId: '',
    delegatePositionId: '',
    delegateUserId: '',
    scopeType: 'all' as 'all' | 'partial' | 'specific',
    scopeDescription: '',
    startAt: new Date().toISOString().split('T')[0],
    endAt: '',
    reason: '',
    notes: '',
    requiresApproval: false,
    notifyStakeholders: true,
  })

  // Current user - TODO: Get from auth context
  const currentUserId = 'current-user-id'

  useEffect(() => {
    if (currentCompany) {
      loadData()
    }
  }, [currentCompany, activeTab])

  async function loadData() {
    if (!companyId) return

    try {
      setLoading(true)

      // Load positions and users
      const [positionsData, usersQuery] = await Promise.all([
        getPositions(companyId),
        getDocs(query(collection(db, 'users'), where('companyId', '==', companyId))),
      ])

      setPositions(positionsData)
      setUsers(usersQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User)))

      // Load delegations based on active tab
      if (activeTab === 'sent') {
        const sentDelegations = await getActiveDelegations(companyId, currentUserId)
        setDelegations(sentDelegations)
      } else {
        const receivedDelegations = await getReceivedDelegations(companyId, currentUserId)
        setDelegations(receivedDelegations)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      delegatorPositionId: '',
      delegatePositionId: '',
      delegateUserId: '',
      scopeType: 'all',
      scopeDescription: '',
      startAt: new Date().toISOString().split('T')[0],
      endAt: '',
      reason: '',
      notes: '',
      requiresApproval: false,
      notifyStakeholders: true,
    })
    setIsDialogOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!companyId) return

    try {
      // Get current assignment for delegator
      const delegatorAssignment = await getCurrentAssignment(companyId, formData.delegatorPositionId)
      if (!delegatorAssignment) {
        alert('Delegator position must have an active occupant')
        return
      }

      // Get current assignment for delegate
      const delegateAssignment = await getCurrentAssignment(companyId, formData.delegatePositionId)
      if (!delegateAssignment) {
        alert('Delegate position must have an active occupant')
        return
      }

      await createDelegation(
        companyId,
        {
          delegatorUserId: delegatorAssignment.userId,
          delegatorPositionId: formData.delegatorPositionId,
          delegateUserId: delegateAssignment.userId,
          delegatePositionId: formData.delegatePositionId,
          scope: {
            type: formData.scopeType,
            departments: [],
            locations: [],
            processes: [],
            approvalTypes: [],
            projectIds: [],
            taskTypes: [],
            budgetLimit: null,
            description: formData.scopeDescription,
          },
          startAt: formData.startAt ? new Date(formData.startAt).toISOString() : new Date().toISOString(),
          endAt: formData.endAt ? new Date(formData.endAt).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          reason: formData.reason,
          notes: formData.notes,
          requiresApproval: formData.requiresApproval,
          approvedBy: null,
          approvedAt: null,
          rejectionReason: null,
          notifyStakeholders: formData.notifyStakeholders,
        },
        currentUserId
      )

      await loadData()
      resetForm()
    } catch (error) {
      console.error('Error creating delegation:', error)
      alert('Error creating delegation. Please try again.')
    }
  }

  async function handleApprove(delegationId: string) {
    if (!confirm('Are you sure you want to approve this delegation?')) return
    if (!companyId) return

    try {
      await approveDelegation(companyId, delegationId, currentUserId)
      await loadData()
    } catch (error) {
      console.error('Error approving delegation:', error)
      alert('Error approving delegation. Please try again.')
    }
  }

  async function handleReject(delegationId: string) {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return
    if (!companyId) return

    try {
      await rejectDelegation(companyId, delegationId, currentUserId, reason)
      await loadData()
    } catch (error) {
      console.error('Error rejecting delegation:', error)
      alert('Error rejecting delegation. Please try again.')
    }
  }

  async function handleRevoke(delegationId: string) {
    const reason = prompt('Please provide a reason for revocation:')
    if (!reason) return
    if (!companyId) return

    try {
      await revokeDelegation(companyId, delegationId, currentUserId, reason)
      await loadData()
    } catch (error) {
      console.error('Error revoking delegation:', error)
      alert('Error revoking delegation. Please try again.')
    }
  }

  function getPositionTitle(positionId: string): string {
    const position = positions.find((p) => p.id === positionId)
    return position?.title || 'Unknown Position'
  }

  function getUserName(userId: string): string {
    const user = users.find((u) => u.id === userId)
    return user?.name || 'Unknown User'
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString()
  }

  function isExpiringSoon(endAt: string): boolean {
    const daysUntilExpiry = Math.floor(
      (new Date(endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Delegations</h2>
          <p className="text-muted-foreground">
            Manage temporary delegations of authority and responsibilities
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Delegation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Delegation</DialogTitle>
              <DialogDescription>
                Delegate authority from one position to another for a specific time period
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Delegation Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="delegatorPosition">From Position (Delegator) *</Label>
                  <Select
                    value={formData.delegatorPositionId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, delegatorPositionId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delegator position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.title} ({position.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delegatePosition">To Position (Delegate) *</Label>
                  <Select
                    value={formData.delegatePositionId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, delegatePositionId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delegate position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions
                        .filter((p) => p.id !== formData.delegatorPositionId)
                        .map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            {position.title} ({position.code})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Scope</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="scopeType">Delegation Scope *</Label>
                  <Select
                    value={formData.scopeType}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, scopeType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Responsibilities</SelectItem>
                      <SelectItem value="partial">Partial Responsibilities</SelectItem>
                      <SelectItem value="specific">Specific Tasks Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scopeDescription">Scope Description *</Label>
                  <Textarea
                    id="scopeDescription"
                    value={formData.scopeDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, scopeDescription: e.target.value })
                    }
                    placeholder="e.g., All QA approvals in Production Line 3, or All project approvals under $50k"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Time Period</h3>
                
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="endAt">End Date *</Label>
                    <Input
                      id="endAt"
                      type="date"
                      value={formData.endAt}
                      onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="e.g., Vacation coverage, Training period"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about this delegation..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requiresApproval"
                    checked={formData.requiresApproval}
                    onChange={(e) =>
                      setFormData({ ...formData, requiresApproval: e.target.checked })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="requiresApproval">Requires Manager Approval</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifyStakeholders"
                    checked={formData.notifyStakeholders}
                    onChange={(e) =>
                      setFormData({ ...formData, notifyStakeholders: e.target.checked })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="notifyStakeholders">Notify Stakeholders</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">Create Delegation</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'sent'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('sent')}
        >
          Delegations Sent
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'received'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('received')}
        >
          Delegations Received
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading delegations...</p>
        </div>
      ) : delegations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              No {activeTab === 'sent' ? 'sent' : 'received'} delegations
            </p>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'sent'
                ? 'Create your first delegation to delegate authority'
                : 'You have no delegations received from others'}
            </p>
            {activeTab === 'sent' && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Delegation
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'sent' ? 'Delegations Sent' : 'Delegations Received'} (
              {delegations.length})
            </CardTitle>
            <CardDescription>
              {activeTab === 'sent'
                ? 'Delegations you have created for others'
                : 'Delegations you have received from others'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From Position</TableHead>
                  <TableHead>To Position</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delegations.map((delegation) => (
                  <TableRow key={delegation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {getPositionTitle(delegation.delegatorPositionId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getUserName(delegation.delegatorUserId)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {getPositionTitle(delegation.delegatePositionId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getUserName(delegation.delegateUserId)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline">{delegation.scope.type}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {delegation.scope.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(delegation.startAt)}</p>
                        <p className="text-muted-foreground">
                          to {formatDate(delegation.endAt)}
                        </p>
                        {isExpiringSoon(delegation.endAt) && (
                          <Badge variant="secondary" className="mt-1">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          delegation.status === 'active'
                            ? 'default'
                            : delegation.status === 'pending'
                            ? 'secondary'
                            : delegation.status === 'expired'
                            ? 'outline'
                            : 'destructive'
                        }
                      >
                        {delegation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {delegation.reason}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {delegation.status === 'pending' && activeTab === 'received' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(delegation.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(delegation.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {delegation.status === 'active' && activeTab === 'sent' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevoke(delegation.id)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Revoke
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

