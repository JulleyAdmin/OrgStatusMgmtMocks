'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCompany } from '@/contexts/CompanyContext'
import { ProjectService } from '@/lib/services'
import { EnhancedProject } from '@/types/project-schema'
import { Save, Calendar, DollarSign, Users, AlertCircle, CheckCircle, Clock, Target } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { companyId } = useCompany()
  const projectId = params.id as string

  const [project, setProject] = useState<EnhancedProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<EnhancedProject>>({})

  useEffect(() => {
    const loadProject = async () => {
      if (!companyId || !projectId) return

      try {
        setLoading(true)
        const projectData = await ProjectService.getProject(companyId, projectId)
        if (projectData) {
          setProject(projectData)
          setFormData(projectData)
        } else {
          toast.error('Project not found')
          router.push('/projects')
        }
      } catch (error) {
        console.error('Error loading project:', error)
        toast.error('Failed to load project details')
        router.push('/projects')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [companyId, projectId, router])

  const handleSave = async () => {
    if (!companyId || !project) return

    try {
      setSaving(true)
      await ProjectService.updateProject(companyId, project.id, formData)
      setProject({ ...project, ...formData })
      setIsEditing(false)
      toast.success('Project updated successfully')
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20'
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'planning':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'on-hold':
        return 'bg-muted text-muted-foreground border-muted'
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      default:
        return 'bg-muted text-muted-foreground border-muted'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'low':
        return 'bg-success/10 text-success border-success/20'
      default:
        return 'bg-muted text-muted-foreground border-muted'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Project Not Found</h3>
            <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout projectName={project.name}>
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Project
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false)
                  setFormData(project)
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Project Status and Priority */}
        <div className="flex items-center space-x-4">
          <Badge className={`${getStatusColor(project.status)} border`}>
            {project.status.replace('-', ' ').toUpperCase()}
          </Badge>
          <Badge className={`${getPriorityColor(project.priority)} border`}>
            {project.priority.toUpperCase()} PRIORITY
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>Basic project details and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Project Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{project.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="manager">Project Manager</Label>
                    {isEditing ? (
                      <Input
                        id="manager"
                        value={formData.manager || ''}
                        onChange={(e) => handleInputChange('manager', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{project.manager}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm mt-1">{project.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Timeline, budget, and team information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    {isEditing ? (
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{new Date(project.startDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    {isEditing ? (
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{new Date(project.endDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget</Label>
                    {isEditing ? (
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget || ''}
                        onChange={(e) => handleInputChange('budget', parseFloat(e.target.value))}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">${project.budget?.toLocaleString()}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="actualCost">Actual Cost</Label>
                    <p className="text-sm font-medium mt-1">${project.actualCost?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    {isEditing ? (
                      <Select
                        value={formData.status || project.status}
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm font-medium mt-1">{project.status.replace('-', ' ').toUpperCase()}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    {isEditing ? (
                      <Select
                        value={formData.priority || project.priority}
                        onValueChange={(value) => handleInputChange('priority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm font-medium mt-1">{project.priority.toUpperCase()}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm">Progress</span>
                  </div>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">Team Size</span>
                  </div>
                  <span className="text-sm font-medium">{Array.isArray(project.team) ? project.team.length : 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm">Budget Used</span>
                  </div>
                  <span className="text-sm font-medium">
                    {project.budget ? Math.round((project.actualCost / project.budget) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Tasks Completed</span>
                  </div>
                  <span className="text-sm font-medium">
                    {project.completedTasks || 0} / {project.totalTasks || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Project Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(project.tags) ? project.tags : []).map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
