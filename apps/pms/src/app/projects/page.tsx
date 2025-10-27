'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { COMPANY_CONFIG } from '@/config/company'
import { EnhancedProject } from '@/types/project-schema'
import { ProjectService } from '@/lib/services'
import { useCompany } from '@/contexts/CompanyContext'
import { ViewToggle, ViewType } from '@/components/ui/view-toggle'
import { ProjectTable, VirtualizedProjectTable } from '@/components/features/projects'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { ActionMenu, createViewAction, createEditAction, createDeleteAction } from '@/components/ui/action-menu'
import { Building2, Plus, Users, Calendar, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProjectsPage() {
  const router = useRouter()
  const { companyId, isLoading: companyLoading } = useCompany()
  const [projects, setProjects] = useState<EnhancedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [viewType, setViewType] = useState<ViewType>('card')
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    project: EnhancedProject | null
  }>({ open: false, project: null })

  useEffect(() => {
    const loadProjects = async () => {
      if (!companyId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Load projects from Firebase for the current company
        const firebaseProjects = await ProjectService.getProjects(companyId)
        console.log('Firebase projects loaded:', firebaseProjects)
        setProjects(firebaseProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
        // Fallback to empty array if Firebase fails
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [companyId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success'
      case 'planning':
        return 'bg-primary/10 text-primary'
      case 'completed':
        return 'bg-muted text-muted-foreground'
      case 'on-hold':
        return 'bg-warning/10 text-warning'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive'
      case 'medium':
        return 'bg-warning/10 text-warning'
      case 'low':
        return 'bg-success/10 text-success'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const handleDeleteProject = async (project: EnhancedProject) => {
    if (!companyId) return

    try {
      await ProjectService.deleteProject(companyId, project.id)
      setProjects(projects.filter(p => p.id !== project.id))
      toast.success(`${project.name} has been deleted successfully`)
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project. Please try again.')
    }
  }

  const handleViewProject = (project: EnhancedProject) => {
    // TODO: Implement project detail view
    toast.success(`Viewing ${project.name}`)
  }

  const handleEditProject = (project: EnhancedProject) => {
    router.push(`/projects/${project.id}`)
  }

  if (loading || companyLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mx-auto space-y-4">
        {/* Breadcrumb */}
        <Breadcrumb />
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">Manage your {COMPANY_CONFIG.name} manufacturing projects</p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle currentView={viewType} onViewChange={setViewType} />
            <Button onClick={() => router.push('/projects/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-card-foreground">{projects.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planning</p>
                <p className="text-2xl font-bold text-warning">
                  {projects.filter(p => p.status === 'planning').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-destructive">
                  {projects.filter(p => p.riskLevel === 'high').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-4">
          {/* Project List */}
          <div>
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-xl font-semibold text-card-foreground">All Projects</h2>
              </div>
              <div className="p-4">
                {viewType === 'table' ? (
                  <VirtualizedProjectTable 
                    projects={projects}
                    onEdit={handleEditProject}
                    onDelete={(project) => setDeleteDialog({ open: true, project })}
                    onView={handleViewProject}
                    height={600}
                    loading={loading}
                  />
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div key={project.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Building2 className="w-5 h-5 text-primary" />
                            <div>
                              <h3 className="font-semibold text-card-foreground text-base">{project.name}</h3>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                              {project.priority}
                            </span>
                            <ActionMenu
                              items={[
                                createViewAction(() => handleViewProject(project)),
                                createEditAction(() => handleEditProject(project)),
                                createDeleteAction(() => setDeleteDialog({ open: true, project }))
                              ]}
                              size="sm"
                            />
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span className="font-medium">{project.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress || 0}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {Array.isArray(project.team) ? project.team.length : 0} members
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              ${project.budget?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {project.riskLevel || 'Low'} risk
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {(Array.isArray(project.tags) ? project.tags : []).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, project: null })}
        title="Delete Project"
        description={`Are you sure you want to delete ${deleteDialog.project?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={() => deleteDialog.project && handleDeleteProject(deleteDialog.project)}
      />
    </DashboardLayout>
  )
}
