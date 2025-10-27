'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Building2, 
  Users, 
  Calendar, 
  Settings, 
  Shield,
  ArrowRight,
  ArrowLeft,
  Save,
  Eye
} from 'lucide-react'
import { 
  PRDAlignedProject, 
  Position, 
  WorkflowTemplate, 
  ComplianceRequirement
} from '@/types/prd-aligned-schema'
import { EnhancedProject } from '@/types/project-schema'
import { ProjectService } from '@/lib/services'
import { useCompany } from '@/contexts/CompanyContext'
import toast from 'react-hot-toast'

interface ProjectCreationWizardProps {
  onProjectCreated?: (project: EnhancedProject) => void
  onCancel?: () => void
  currentUser: any
  positions: Position[]
  workflowTemplates: WorkflowTemplate[]
  complianceRequirements: ComplianceRequirement[]
}

interface FormData {
  // Step 1: Basic Info
  name: string
  description: string
  projectCode: string
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  
  // Step 2: Team & Assignment
  assignedPositionId: string
  assignedUserId?: string
  matrixPositions: string[]
  
  // Step 3: Timeline & Budget
  startDate: string
  endDate: string
  estimatedDuration: number
  budget: number
  costCategory: string
  
  // Step 4: Organization & Context
  department: string
  businessUnit: string
  costCenter: string
  location: string
  equipmentType: 'Industrial Robots' | 'Automation Systems' | 'Manufacturing Equipment' | 'Quality Control Systems' | 'Smart Sensors' | 'other'
  manufacturingPhase: 'Design & Engineering' | 'Prototyping' | 'Production Planning' | 'Manufacturing' | 'Quality Testing' | 'Packaging & Delivery'
  qualityStandards: string[]
  
  // Step 5: Workflow & Compliance
  workflowTemplateId?: string
  complianceRequirements: string[]
  requiresApproval: boolean
  approvalMatrixId?: string
  definitionOfDone: string[]
  tags: string[]
  client?: string
}

const STEPS = [
  {
    id: 1,
    title: 'Project Basics',
    description: 'Name, description, and priority',
    icon: Building2,
    fields: ['name', 'description', 'projectCode', 'status', 'priority']
  },
  {
    id: 2,
    title: 'Team Assignment',
    description: 'Assign team members and positions',
    icon: Users,
    fields: ['assignedPositionId', 'assignedUserId', 'matrixPositions']
  },
  {
    id: 3,
    title: 'Timeline & Budget',
    description: 'Schedule and financial planning',
    icon: Calendar,
    fields: ['startDate', 'endDate', 'budget', 'costCategory']
  },
  {
    id: 4,
    title: 'Organization',
    description: 'Department, location, and context',
    icon: Settings,
    fields: ['department', 'businessUnit', 'location', 'equipmentType', 'manufacturingPhase']
  },
  {
    id: 5,
    title: 'Workflow & Compliance',
    description: 'Processes, approvals, and requirements',
    icon: Shield,
    fields: ['workflowTemplateId', 'complianceRequirements', 'requiresApproval', 'tags']
  }
]

const COMPLIANCE_REGULATIONS = [
  'SOX', 'GDPR', 'HIPAA', 'PCI-DSS', 'ISO 27001', 'SOC 2', 'FDA', 'OSHA', 'CE Marking', 'RoHS'
]

const COST_CATEGORIES = [
  'Capital Expenditure', 'Operating Expense', 'Research & Development', 'Compliance', 'Training', 'Infrastructure'
]

export function ProjectCreationWizard({ 
  onProjectCreated, 
  onCancel, 
  currentUser, 
  positions,
  workflowTemplates,
  complianceRequirements
}: ProjectCreationWizardProps) {
  const { companyId } = useCompany()
  const [currentStep, setCurrentStep] = useState(1)
  const [tagInput, setTagInput] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
  const [routingPreview, setRoutingPreview] = useState<any>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [stepErrors, setStepErrors] = useState<Record<number, Record<string, string>>>({})

  const initialValues: FormData = {
    name: '',
    description: '',
    projectCode: '',
    status: 'planning',
    priority: 'medium',
    assignedPositionId: '',
    assignedUserId: '',
    matrixPositions: [],
    startDate: '',
    endDate: '',
    estimatedDuration: 0,
    budget: 0,
    costCategory: 'Operating Expense',
    department: currentUser.department || '',
    businessUnit: '',
    costCenter: '',
    location: '',
    equipmentType: 'other',
    manufacturingPhase: 'Design & Engineering',
    qualityStandards: [],
    workflowTemplateId: '',
    complianceRequirements: [],
    requiresApproval: true,
    approvalMatrixId: '',
    definitionOfDone: [],
    tags: [],
    client: ''
  }

  const [values, setValues] = useState<FormData>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback((field: keyof FormData, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    // Clear step errors when user starts typing
    if (stepErrors[currentStep]?.[field]) {
      setStepErrors(prev => ({
        ...prev,
        [currentStep]: {
          ...prev[currentStep],
          [field]: ''
        }
      }))
    }
  }, [currentStep, stepErrors])

  const validateStep = (stepNumber: number): Record<string, string> => {
    const step = STEPS.find(s => s.id === stepNumber)
    if (!step) return {}

    const errors: Record<string, string> = {}

    switch (stepNumber) {
      case 1:
        if (!values.name.trim()) errors.name = 'Project name is required'
        if (!values.description.trim()) errors.description = 'Description is required'
        if (!values.projectCode.trim()) errors.projectCode = 'Project code is required'
        break
      case 2:
        if (!values.assignedPositionId) errors.assignedPositionId = 'Primary position is required'
        break
      case 3:
        if (!values.startDate) errors.startDate = 'Start date is required'
        if (!values.endDate) errors.endDate = 'End date is required'
        if (values.startDate && values.endDate && values.startDate >= values.endDate) {
          errors.endDate = 'End date must be after start date'
        }
        if (!values.budget || values.budget <= 0) errors.budget = 'Budget must be greater than 0'
        break
      case 4:
        if (!values.department.trim()) errors.department = 'Department is required'
        if (!values.location.trim()) errors.location = 'Location is required'
        break
      case 5:
        // Step 5 is optional, no required validation
        break
    }

    return errors
  }

  const handleNext = () => {
    const errors = validateStep(currentStep)
    setStepErrors(prev => ({ ...prev, [currentStep]: errors }))

    if (Object.keys(errors).length === 0) {
      setCompletedSteps(prev => [...prev, currentStep])
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepNumber: number) => {
    // Allow navigation to completed steps or next step
    if (completedSteps.includes(stepNumber) || stepNumber === currentStep + 1) {
      setCurrentStep(stepNumber)
    }
  }

  const handleSubmit = async () => {
    // Validate all steps
    let hasErrors = false
    const allErrors: Record<number, Record<string, string>> = {}

    for (let i = 1; i <= STEPS.length; i++) {
      const errors = validateStep(i)
      if (Object.keys(errors).length > 0) {
        allErrors[i] = errors
        hasErrors = true
      }
    }

    setStepErrors(allErrors)
    if (hasErrors) {
      // Go to first step with errors
      const firstErrorStep = Object.keys(allErrors)[0]
      if (firstErrorStep) {
        setCurrentStep(parseInt(firstErrorStep))
      }
      return
    }

    setIsSubmitting(true)
    try {
      // Create project data
      const projectData = {
        ...values,
        actualCost: 0,
        progress: 0,
        riskLevel: 'low',
        qualityScore: 0,
        complianceScore: 0,
        workflowSteps: selectedTemplate?.steps || [],
        currentStepId: selectedTemplate?.steps[0]?.id,
        routingRules: [],
        lastRoutingDecision: null as any,
        manualOverrides: [],
        approvalStatus: values.requiresApproval ? 'pending' : 'approved',
        approvalHistory: [],
        comments: [],
        mentions: [],
        activityLog: [],
        notificationPreferences: [],
        auditTrail: [],
        createdBy: currentUser.id,
        lastModifiedBy: currentUser.id
      }

      if (!companyId) {
        throw new Error('No company selected')
      }
      
      const projectId = await ProjectService.createProject(companyId, {
        name: values.name,
        description: values.description,
        status: values.status,
        priority: values.priority,
        manager: values.assignedUserId || null,
        team: values.assignedUserId ? [values.assignedUserId] : [],
        startDate: values.startDate,
        endDate: values.endDate,
        budget: values.budget,
        actualCost: 0,
        progress: 0,
        tags: values.tags,
        equipmentType: values.equipmentType || 'other',
        manufacturingPhase: values.manufacturingPhase || 'Design & Engineering',
        qualityStandards: values.qualityStandards || [],
        complianceRequirements: values.complianceRequirements,
        templateId: values.workflowTemplateId || null,
        projectCode: values.projectCode,
        department: values.department,
        client: values.client || null,
        location: values.location,
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        teamUtilization: 0,
        qualityScore: 0,
        safetyScore: 0,
        riskLevel: 'low',
        issuesCount: 0,
        resolvedIssuesCount: 0,
        lastActivityDate: new Date().toISOString(),
        requiresApproval: values.requiresApproval,
        approvedBy: values.requiresApproval ? null : currentUser.id,
        approvedAt: values.requiresApproval ? null : new Date().toISOString(),
        approvalNotes: values.requiresApproval ? null : 'Auto-approved'
      })
      
      console.log('Project created successfully with ID:', projectId)
      
      toast.success(`Project "${values.name}" created successfully!`)
      
      if (onProjectCreated) {
        const createdProject = {
          id: projectId,
          ...projectData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        onProjectCreated(createdProject as any)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate project code when name changes
  useEffect(() => {
    if (values.name && !values.projectCode) {
      const code = values.name
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 8)
        .toUpperCase()
      setValue('projectCode', `${code}-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`)
    }
  }, [values.name, values.projectCode, setValue])

  // Calculate estimated duration when dates change
  useEffect(() => {
    if (values.startDate && values.endDate) {
      const start = new Date(values.startDate)
      const end = new Date(values.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setValue('estimatedDuration', diffDays)
    }
  }, [values.startDate, values.endDate, setValue])

  const handleTagAdd = () => {
    if (tagInput.trim() && !values.tags.includes(tagInput.trim())) {
      setValue('tags', [...values.tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setValue('tags', values.tags.filter(tag => tag !== tagToRemove))
  }

  const handleComplianceToggle = (requirement: string) => {
    setValue('complianceRequirements', values.complianceRequirements.includes(requirement)
      ? values.complianceRequirements.filter(r => r !== requirement)
      : [...values.complianceRequirements, requirement]
    )
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId)
    setSelectedTemplate(template || null)
    
    if (template) {
      setValue('workflowTemplateId', template.id)
      setValue('complianceRequirements', template.complianceRequirements.map(cr => cr.id))
      setValue('definitionOfDone', template.steps.flatMap(step => step.definitionOfDone.map(item => item.text)))
    }
  }

  const handleMatrixPositionToggle = (positionId: string) => {
    setValue('matrixPositions', values.matrixPositions.includes(positionId)
      ? values.matrixPositions.filter(id => id !== positionId)
      : [...values.matrixPositions, positionId]
    )
  }

  const previewRouting = () => {
    if (values.assignedPositionId) {
      const position = positions.find(p => p.id === values.assignedPositionId)
      setRoutingPreview({
        primaryPosition: position,
        reasoning: `Project assigned to ${position?.title} based on department alignment and skill requirements`,
        confidence: 0.95
      })
    }
  }

  const progressPercentage = (completedSteps.length / STEPS.length) * 100

  const renderStepContent = () => {
    const currentStepData = STEPS.find(s => s.id === currentStep)
    const errors = stepErrors[currentStep] || {}

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Basics</h2>
              <p className="text-gray-600">Let's start with the essential information about your project</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={values.name}
                  onChange={(e) => setValue('name', e.target.value)}
                  placeholder="Enter project name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectCode">Project Code *</Label>
                <Input
                  id="projectCode"
                  value={values.projectCode}
                  onChange={(e) => setValue('projectCode', e.target.value)}
                  placeholder="Auto-generated"
                  className={errors.projectCode ? 'border-red-500' : ''}
                />
                {errors.projectCode && <p className="text-sm text-red-500">{errors.projectCode}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={values.description}
                onChange={(e) => setValue('description', e.target.value)}
                placeholder="Describe the project objectives and scope"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={values.status}
                  onValueChange={(value) => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={values.priority}
                  onValueChange={(value) => setValue('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Assignment</h2>
              <p className="text-gray-600">Assign team members and define reporting structure</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="assignedPositionId">Primary Position *</Label>
                <Select
                  value={values.assignedPositionId}
                  onValueChange={(value) => {
                    setValue('assignedPositionId', value)
                    previewRouting()
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary position..." />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(position => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.title} - {position.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignedPositionId && <p className="text-sm text-red-500">{errors.assignedPositionId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedUserId">Specific Person (Optional)</Label>
                <Select
                  value={values.assignedUserId}
                  onValueChange={(value) => setValue('assignedUserId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Auto-assign based on position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-assign based on position</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Matrix Positions (Dotted-line reporting)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-4">
                {positions.map(position => (
                  <label key={position.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={values.matrixPositions.includes(position.id)}
                      onChange={(e) => handleMatrixPositionToggle(position.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{position.title} ({position.department})</span>
                  </label>
                ))}
              </div>
            </div>

            {routingPreview && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-semibold text-blue-900 mb-2">Routing Preview</h4>
                <p className="text-sm text-blue-800">
                  <strong>Primary Position:</strong> {routingPreview.primaryPosition?.title}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Reasoning:</strong> {routingPreview.reasoning}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Confidence:</strong> {(routingPreview.confidence * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Timeline & Budget</h2>
              <p className="text-gray-600">Set project schedule and financial parameters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={values.startDate}
                  onChange={(e) => setValue('startDate', e.target.value)}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={values.endDate}
                  onChange={(e) => setValue('endDate', e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Duration (Days)</Label>
                <Input
                  id="estimatedDuration"
                  type="number"
                  value={values.estimatedDuration}
                  placeholder="Auto-calculated"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={values.budget}
                  onChange={(e) => setValue('budget', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className={errors.budget ? 'border-red-500' : ''}
                />
                {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="costCategory">Cost Category</Label>
                <Select
                  value={values.costCategory}
                  onValueChange={(value) => setValue('costCategory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cost category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COST_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Settings className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization</h2>
              <p className="text-gray-600">Define organizational context and manufacturing details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={values.department}
                  onChange={(e) => setValue('department', e.target.value)}
                  placeholder="Enter department"
                  className={errors.department ? 'border-red-500' : ''}
                />
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessUnit">Business Unit</Label>
                <Input
                  id="businessUnit"
                  value={values.businessUnit}
                  onChange={(e) => setValue('businessUnit', e.target.value)}
                  placeholder="Enter business unit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={values.location}
                  onChange={(e) => setValue('location', e.target.value)}
                  placeholder="Enter location"
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="equipmentType">Equipment Type</Label>
                <Select
                  value={values.equipmentType}
                  onValueChange={(value) => setValue('equipmentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Industrial Robots">Industrial Robots</SelectItem>
                    <SelectItem value="Automation Systems">Automation Systems</SelectItem>
                    <SelectItem value="Manufacturing Equipment">Manufacturing Equipment</SelectItem>
                    <SelectItem value="Quality Control Systems">Quality Control Systems</SelectItem>
                    <SelectItem value="Smart Sensors">Smart Sensors</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturingPhase">Manufacturing Phase</Label>
                <Select
                  value={values.manufacturingPhase}
                  onValueChange={(value) => setValue('manufacturingPhase', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manufacturing phase..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Design & Engineering">Design & Engineering</SelectItem>
                    <SelectItem value="Prototyping">Prototyping</SelectItem>
                    <SelectItem value="Production Planning">Production Planning</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Quality Testing">Quality Testing</SelectItem>
                    <SelectItem value="Packaging & Delivery">Packaging & Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualityStandards">Quality Standards</Label>
              <Input
                id="qualityStandards"
                value={values.qualityStandards.join(', ')}
                onChange={(e) => setValue('qualityStandards', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                placeholder="ISO 9001, ISO 14001, etc."
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Workflow & Compliance</h2>
              <p className="text-gray-600">Configure processes, approvals, and compliance requirements</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workflowTemplate">Workflow Template (Optional)</Label>
                <Select
                  value={values.workflowTemplateId}
                  onValueChange={(value) => handleTemplateSelect(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workflow template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {workflowTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} - {template.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <div className="mt-2 p-3 bg-gray-50 border rounded-md">
                    <p className="text-sm text-gray-700">
                      <strong>Template:</strong> {selectedTemplate.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Steps:</strong> {selectedTemplate.steps.length} workflow steps
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Estimated Duration:</strong> {selectedTemplate.estimatedDuration} days
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label>Regulatory Compliance</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {COMPLIANCE_REGULATIONS.map(regulation => (
                    <label key={regulation} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={values.complianceRequirements.includes(regulation)}
                        onChange={() => handleComplianceToggle(regulation)}
                        className="rounded"
                      />
                      <span className="text-sm">{regulation}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requiresApproval"
                    checked={values.requiresApproval}
                    onChange={(e) => setValue('requiresApproval', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="requiresApproval">Requires approval before starting</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter tag and press Enter"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                  />
                  <Button type="button" onClick={handleTagAdd} variant="outline">
                    Add
                  </Button>
                </div>
                {values.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {values.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleTagRemove(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client Name (Optional)</Label>
                <Input
                  id="client"
                  value={values.client}
                  onChange={(e) => setValue('client', e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {STEPS.length}
          </div>
        </div>
        
        <Progress value={progressPercentage} className="mb-4" />
        
        {/* Step Navigation */}
        <div className="flex justify-between">
          {STEPS.map((step) => {
            const Icon = step.icon
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = currentStep === step.id
            const isClickable = completedSteps.includes(step.id) || step.id === currentStep + 1

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  isClickable ? 'hover:opacity-80' : 'opacity-50'
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    isCurrent ? 'text-primary' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400 max-w-20">
                    {step.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </Button>

        <div className="flex space-x-2">
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext} disabled={isSubmitting}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
