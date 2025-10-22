'use client'

import { useState, useEffect } from 'react'
import { Plus, Briefcase, Edit2, Archive, Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Position, Department } from '@/types/org-schema'
import { createPosition, updatePosition, getPositions, deletePosition, getDepartments } from '@/lib/org-services'
import { useCompany } from '@/contexts/CompanyContext'

export function PositionManagement() {
  const { currentCompany } = useCompany()
  const companyId = currentCompany?.id
  const [positions, setPositions] = useState<Position[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Form state
  const [formData, setFormData] = useState<Partial<Position>>({
    title: '',
    code: '',
    description: '',
    departmentId: '',
    level: 1,
    scope: {
      departments: [],
      locations: [],
      productLines: [],
      processes: [],
      equipmentTypes: [],
    },
    responsibilities: [],
    requiredSkills: [],
    optionalSkills: [],
    certifications: [],
    reportsToPositionId: null,
    employmentType: 'full_time',
    headcount: 1,
    approvalAuthority: {
      canApproveProjects: false,
      canApproveBudgets: false,
      canApproveQuality: false,
      canApproveSafety: false,
      canApproveTimeOff: false,
      customApprovals: [],
    },
    status: 'active',
  })

  // Input fields for arrays
  const [newResponsibility, setNewResponsibility] = useState('')
  const [newRequiredSkill, setNewRequiredSkill] = useState('')
  const [newOptionalSkill, setNewOptionalSkill] = useState('')
  const [newCertification, setNewCertification] = useState('')

  useEffect(() => {
    if (currentCompany) {
      loadData()
    }
  }, [currentCompany])

  async function loadData() {
    if (!companyId) return

    try {
      setLoading(true)
      const [positionsData, departmentsData] = await Promise.all([
        getPositions(companyId),
        getDepartments(companyId),
      ])
      setPositions(positionsData)
      setDepartments(departmentsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(position: Position) {
    setEditingPosition(position)
    setFormData(position)
    setIsDialogOpen(true)
  }

  function resetForm() {
    setEditingPosition(null)
    setFormData({
      title: '',
      code: '',
      description: '',
      departmentId: '',
      level: 1,
      scope: {
        departments: [],
        locations: [],
        productLines: [],
        processes: [],
        equipmentTypes: [],
      },
      responsibilities: [],
      requiredSkills: [],
      optionalSkills: [],
      certifications: [],
      reportsToPositionId: null,
      employmentType: 'full_time',
      headcount: 1,
      approvalAuthority: {
        canApproveProjects: false,
        canApproveBudgets: false,
        canApproveQuality: false,
        canApproveSafety: false,
        canApproveTimeOff: false,
        customApprovals: [],
      },
      status: 'active',
    })
    setIsDialogOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!companyId || submitting) return

    try {
      setSubmitting(true)
      const userId = 'current-user-id' // TODO: Get from auth context

      if (editingPosition) {
        await updatePosition(companyId, editingPosition.id, formData, userId)
      } else {
        await createPosition(
          companyId,
          {
            ...formData,
            companyId: companyId,
            createdBy: userId,
            updatedBy: userId,
          } as any,
          userId
        )
      }

      await loadData()
      resetForm()
    } catch (error) {
      console.error('Error saving position:', error)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(positionId: string) {
    if (!confirm('Are you sure you want to archive this position?')) return
    if (!companyId || submitting) return

    try {
      setSubmitting(true)
      const userId = 'current-user-id' // TODO: Get from auth context
      await deletePosition(companyId, positionId, userId)
      await loadData()
    } catch (error) {
      console.error('Error deleting position:', error)
    } finally {
      setSubmitting(false)
    }
  }

  function getDepartmentName(departmentId: string): string {
    const dept = departments.find(d => d.id === departmentId)
    return dept?.name || 'Unknown'
  }

  function getPositionTitle(positionId: string | null): string {
    if (!positionId) return '-'
    const pos = positions.find(p => p.id === positionId)
    return pos?.title || 'Unknown'
  }

  function addToArray(field: keyof Position, value: string) {
    if (!value.trim()) return
    const currentArray = (formData[field] as string[]) || []
    setFormData({
      ...formData,
      [field]: [...currentArray, value.trim()],
    })
  }

  function removeFromArray(field: keyof Position, index: number) {
    const currentArray = (formData[field] as string[]) || []
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index),
    })
  }

  // Filter positions based on search term
  const filteredPositions = positions.filter(pos =>
    pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pos.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pos.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDepartmentName(pos.departmentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pos.requiredSkills && pos.requiredSkills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Positions</h2>
          <p className="text-muted-foreground">
            Manage organizational positions, roles, and reporting structure
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Box */}
          {!loading && positions.length > 0 && (
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Position
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPosition ? 'Edit Position' : 'Create Position'}
              </DialogTitle>
              <DialogDescription>
                {editingPosition
                  ? 'Update position information'
                  : 'Add a new position to your organization'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Position Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Production Line Supervisor"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Position Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., PLS-001"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the position's role and purpose..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.departmentId}
                      onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={departments.length === 0 ? "No departments - Create one first" : "Select department"} />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.length === 0 ? (
                          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                            No departments found. Create departments in the Departments tab first.
                          </div>
                        ) : (
                          departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name} ({dept.code})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {departments.length === 0 && (
                      <p className="text-xs text-amber-600">
                        ⚠️ No departments available. Create departments first in the Departments tab.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Org Level</Label>
                    <Input
                      id="level"
                      type="number"
                      min="1"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">1 = highest level</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headcount">Headcount</Label>
                    <Input
                      id="headcount"
                      type="number"
                      min="1"
                      value={formData.headcount}
                      onChange={(e) => setFormData({ ...formData, headcount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value: any) => setFormData({ ...formData, employmentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportsTo">Reports To</Label>
                    <Select
                      value={formData.reportsToPositionId || 'none'}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          reportsToPositionId: value === 'none' ? null : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reporting position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Top Level)</SelectItem>
                        {positions
                          .filter(p => p.id !== editingPosition?.id)
                          .map((pos) => (
                            <SelectItem key={pos.id} value={pos.id}>
                              {pos.title} ({pos.code})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Responsibilities</h3>
                <div className="flex gap-2">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Add a responsibility..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addToArray('responsibilities', newResponsibility)
                        setNewResponsibility('')
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addToArray('responsibilities', newResponsibility)
                      setNewResponsibility('')
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.responsibilities?.map((resp, index) => (
                    <Badge key={index} variant="secondary">
                      {resp}
                      <button
                        type="button"
                        onClick={() => removeFromArray('responsibilities', index)}
                        className="ml-2 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Required Skills</h3>
                <div className="flex gap-2">
                  <Input
                    value={newRequiredSkill}
                    onChange={(e) => setNewRequiredSkill(e.target.value)}
                    placeholder="Add a required skill..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addToArray('requiredSkills', newRequiredSkill)
                        setNewRequiredSkill('')
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addToArray('requiredSkills', newRequiredSkill)
                      setNewRequiredSkill('')
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills?.map((skill, index) => (
                    <Badge key={index} variant="default">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeFromArray('requiredSkills', index)}
                        className="ml-2 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mt-4">Optional Skills</h3>
                <div className="flex gap-2">
                  <Input
                    value={newOptionalSkill}
                    onChange={(e) => setNewOptionalSkill(e.target.value)}
                    placeholder="Add an optional skill..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addToArray('optionalSkills', newOptionalSkill)
                        setNewOptionalSkill('')
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addToArray('optionalSkills', newOptionalSkill)
                      setNewOptionalSkill('')
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.optionalSkills?.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeFromArray('optionalSkills', index)}
                        className="ml-2 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mt-4">Certifications</h3>
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add a certification..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addToArray('certifications', newCertification)
                        setNewCertification('')
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addToArray('certifications', newCertification)
                      setNewCertification('')
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications?.map((cert, index) => (
                    <Badge key={index} variant="secondary">
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeFromArray('certifications', index)}
                        className="ml-2 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Approval Authority */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Approval Authority</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canApproveProjects"
                      checked={formData.approvalAuthority?.canApproveProjects}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          approvalAuthority: {
                            ...formData.approvalAuthority!,
                            canApproveProjects: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="canApproveProjects">Can Approve Projects</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canApproveBudgets"
                      checked={formData.approvalAuthority?.canApproveBudgets}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          approvalAuthority: {
                            ...formData.approvalAuthority!,
                            canApproveBudgets: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="canApproveBudgets">Can Approve Budgets</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canApproveQuality"
                      checked={formData.approvalAuthority?.canApproveQuality}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          approvalAuthority: {
                            ...formData.approvalAuthority!,
                            canApproveQuality: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="canApproveQuality">Can Approve Quality</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canApproveSafety"
                      checked={formData.approvalAuthority?.canApproveSafety}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          approvalAuthority: {
                            ...formData.approvalAuthority!,
                            canApproveSafety: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="canApproveSafety">Can Approve Safety</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {editingPosition ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingPosition ? 'Update Position' : 'Create Position'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading positions...</p>
        </div>
      ) : positions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No positions yet</p>
            <p className="text-muted-foreground mb-4">
              Create your first position to define organizational roles
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Position
            </Button>
          </CardContent>
        </Card>
      ) : filteredPositions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No positions found</p>
            <p className="text-muted-foreground mb-4">
              No positions match your search "{searchTerm}"
            </p>
            <Button onClick={() => setSearchTerm('')} variant="outline">
              Clear Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {searchTerm 
                ? `Positions (${filteredPositions.length} of ${positions.length})` 
                : `All Positions (${positions.length})`
              }
            </CardTitle>
            <CardDescription>
              Manage positions, roles, and organizational hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Reports To</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell className="font-medium">{position.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{position.code}</Badge>
                    </TableCell>
                    <TableCell>{getDepartmentName(position.departmentId)}</TableCell>
                    <TableCell>{position.level}</TableCell>
                    <TableCell>{getPositionTitle(position.reportsToPositionId)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {position.employmentType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          position.status === 'active'
                            ? 'default'
                            : position.status === 'inactive'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {position.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(position)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(position.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
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

