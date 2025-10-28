// Task Template Schema for Position-Based Task Management
// This schema defines reusable task templates that can be assigned to positions

export interface TaskTemplate {
  id: string
  name: string
  description: string
  category: 'onboarding' | 'compliance' | 'operational' | 'project' | 'training' | 'maintenance' | 'custom'
  department: string[]
  positionLevel: number[] // Organizational levels this template applies to
  priority: 'low' | 'medium' | 'high' | 'urgent'
  
  // Task details
  estimatedHours: number
  dueDateOffset: number // Days from assignment date
  isRecurring: boolean
  recurrencePattern?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  
  // Assignment rules
  assignmentType: 'automatic' | 'manual' | 'conditional'
  assignmentConditions?: TaskAssignmentCondition[]
  
  // Task requirements
  requiredSkills: string[]
  requiredCertifications: string[]
  definitionOfDone: TaskDoDItem[]
  
  // Workflow
  approvalRequired: boolean
  approvalMatrix?: string // Reference to approval matrix ID
  escalationRules?: TaskEscalationRule[]
  
  // Compliance and quality
  complianceRequirements: string[]
  qualityCheckpoints: string[]
  safetyRequirements: string[]
  
  // Metadata
  tags: string[]
  isActive: boolean
  isSystemTemplate: boolean // System vs user-created templates
  createdBy: string // User ID
  lastUsedAt?: string
  usageCount: number
  
  createdAt: string
  updatedAt: string
}

export interface TaskAssignmentCondition {
  id: string
  type: 'position_level' | 'department' | 'skill' | 'certification' | 'tenure' | 'custom'
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains'
  value: string | number
  description: string
}

export interface TaskDoDItem {
  id: string
  text: string
  isRequired: boolean
  evidenceType: 'approval' | 'document' | 'checklist' | 'signature' | 'photo' | 'custom'
  validationRules: string[]
  order: number
}

export interface TaskEscalationRule {
  id: string
  name: string
  triggerCondition: 'overdue' | 'stuck' | 'rejected' | 'custom'
  triggerValue: number // Hours or days
  escalationAction: 'notify_manager' | 'reassign' | 'escalate_approval' | 'create_incident'
  targetPosition?: string // Position ID for escalation
  notificationTemplate?: string
}

// Position-Template Assignment
export interface PositionTaskTemplate {
  id: string
  companyId: string
  positionId: string
  templateId: string
  
  // Assignment configuration
  assignmentMode: 'immediate' | 'on_assignment' | 'scheduled' | 'conditional'
  assignmentDate?: string // For scheduled assignments
  assignmentConditions?: TaskAssignmentCondition[]
  
  // Customization for this position
  customDueDateOffset?: number
  customPriority?: 'low' | 'medium' | 'high' | 'urgent'
  customInstructions?: string
  
  // Status
  isActive: boolean
  lastAssignedAt?: string
  assignmentCount: number
  
  createdAt: string
  updatedAt: string
}

// Generated Task from Template
export interface GeneratedTask {
  id: string
  templateId: string
  positionId: string
  assignedUserId: string
  
  // Task details (copied from template)
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedHours: number
  dueDate: string
  
  // Assignment details
  assignmentType: 'template_generated' | 'manual' | 'escalated'
  assignmentReason: string
  assignedBy: string // User ID
  reporter?: string // User ID who created/reported the task
  
  // Status tracking
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'escalated'
  progress: number // 0-100
  
  // Completion tracking
  startedAt?: string
  completedAt?: string
  actualHours?: number
  completionNotes?: string
  
  // Approval workflow
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'escalated'
  approvedBy?: string
  approvedAt?: string
  approvalNotes?: string
  
  // Definition of Done tracking
  definitionOfDone: TaskDoDProgress[]
  
  createdAt: string
  updatedAt: string
}

export interface TaskDoDProgress {
  doDItemId: string
  text: string
  isRequired: boolean
  isCompleted: boolean
  completedAt?: string
  completedBy?: string
  evidence?: TaskEvidence[]
  order: number
}

export interface TaskEvidence {
  id: string
  type: 'file' | 'text' | 'signature' | 'photo' | 'approval'
  content: string
  uploadedBy: string
  uploadedAt: string
  metadata?: Record<string, any>
}

// Task Library Statistics
export interface TaskLibraryStats {
  totalTemplates: number
  activeTemplates: number
  systemTemplates: number
  userTemplates: number
  totalAssignments: number
  completedTasks: number
  overdueTasks: number
  averageCompletionTime: number // hours
  mostUsedTemplates: Array<{
    templateId: string
    templateName: string
    usageCount: number
  }>
}

// Collection structure for Firestore
export interface TaskTemplateCollections {
  taskTemplates: TaskTemplate[]
  positionTaskTemplates: PositionTaskTemplate[]
  generatedTasks: GeneratedTask[]
  taskLibraryStats: TaskLibraryStats[]
}
