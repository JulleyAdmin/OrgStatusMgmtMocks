'use client'

import { useState, useEffect } from 'react'
import { Plus, Building2, Edit2, Trash2, Archive, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Department } from '@/types/org-schema'
import { createDepartment, updateDepartment, getDepartments, deleteDepartment } from '@/lib/org-services'
import { useCompany } from '@/contexts/CompanyContext'

export function DepartmentManagement() {
  const { currentCompany } = useCompany()
  const companyId = currentCompany?.id
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    parentDepartmentId: null as string | null,
    location: '',
    costCenter: '',
    budget: 0,
    status: 'active' as 'active' | 'inactive' | 'archived',
  })

  useEffect(() => {
    if (currentCompany) {
      loadDepartments()
    }
  }, [currentCompany])

  async function loadDepartments() {
    if (!companyId) return

    try {
      setLoading(true)
      const data = await getDepartments(companyId)
      setDepartments(data)
    } catch (error) {
      console.error('Error loading departments:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(department: Department) {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description,
      parentDepartmentId: department.parentDepartmentId,
      location: department.location || '',
      costCenter: department.costCenter || '',
      budget: department.budget || 0,
      status: department.status,
    })
    setIsDialogOpen(true)
  }

  function resetForm() {
    setEditingDepartment(null)
    setFormData({
      name: '',
      code: '',
      description: '',
      parentDepartmentId: null,
      location: '',
      costCenter: '',
      budget: 0,
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

      if (editingDepartment) {
        await updateDepartment(companyId, editingDepartment.id, formData, userId)
      } else {
        await createDepartment(
          companyId,
          {
            ...formData,
            companyId: companyId,
            createdBy: userId,
            updatedBy: userId,
          },
          userId
        )
      }

      await loadDepartments()
      resetForm()
    } catch (error) {
      console.error('Error saving department:', error)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(departmentId: string) {
    if (!confirm('Are you sure you want to archive this department?')) return
    if (!companyId || submitting) return

    try {
      setSubmitting(true)
      const userId = 'current-user-id' // TODO: Get from auth context
      await deleteDepartment(companyId, departmentId, userId)
      await loadDepartments()
    } catch (error) {
      console.error('Error deleting department:', error)
    } finally {
      setSubmitting(false)
    }
  }

  function getParentDepartmentName(parentId: string | null): string {
    if (!parentId) return '-'
    const parent = departments.find(d => d.id === parentId)
    return parent?.name || 'Unknown'
  }

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.location && dept.location.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Departments</h2>
          <p className="text-muted-foreground">
            Manage organizational departments and their hierarchy
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Box */}
          {!loading && departments.length > 0 && (
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search departments..."
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
                Add Department
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Edit Department' : 'Create Department'}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment
                  ? 'Update department information'
                  : 'Add a new department to your organization'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Manufacturing"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Department Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., MFG"
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
                  placeholder="Describe the department's responsibilities..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentDepartment">Parent Department</Label>
                  <Select
                    value={formData.parentDepartmentId || 'none'}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        parentDepartmentId: value === 'none' ? null : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {departments
                        .filter(d => d.id !== editingDepartment?.id)
                        .map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Building A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costCenter">Cost Center</Label>
                  <Input
                    id="costCenter"
                    value={formData.costCenter}
                    onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                    placeholder="e.g., CC-1001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Annual Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {editingDepartment ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingDepartment ? 'Update Department' : 'Create Department'
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
          <p className="text-muted-foreground">Loading departments...</p>
        </div>
      ) : departments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No departments yet</p>
            <p className="text-muted-foreground mb-4">
              Create your first department to start organizing your company
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </CardContent>
        </Card>
      ) : filteredDepartments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No departments found</p>
            <p className="text-muted-foreground mb-4">
              No departments match your search "{searchTerm}"
            </p>
            <Button onClick={() => setSearchTerm('')} variant="outline">
              Clear Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardDescription> 
            {searchTerm 
                ? `Departments (${filteredDepartments.length} of ${departments.length})` 
                : `All Departments (${departments.length})`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Parent Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Cost Center</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{department.code}</Badge>
                    </TableCell>
                    <TableCell>{getParentDepartmentName(department.parentDepartmentId)}</TableCell>
                    <TableCell>{department.location || '-'}</TableCell>
                    <TableCell>{department.costCenter || '-'}</TableCell>
                    <TableCell>
                      {department.budget
                        ? `$${department.budget.toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          department.status === 'active'
                            ? 'default'
                            : department.status === 'inactive'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {department.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(department)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(department.id)}
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

