// PMS-specific types for Autocracy Manufacturing & Technology

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'employee'
  department: string
  position: string
  avatar?: string
  skills: string[]
  contact: {
    phone: string
    slack: string
  }
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  manager: string // User ID
  team: string[] // User IDs
  startDate: string // ISO date string
  endDate: string // ISO date string
  budget: number
  progress: number // 0-100
  tags: string[]
  equipmentType: 'Industrial Robots' | 'Automation Systems' | 'Manufacturing Equipment' | 'Quality Control Systems' | 'Smart Sensors' | 'other'
  manufacturingPhase: 'Design & Engineering' | 'Prototyping' | 'Production Planning' | 'Manufacturing' | 'Quality Testing' | 'Packaging & Delivery'
  qualityStandards: string[]
  complianceRequirements: string[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: string // User ID
  reporter: string // User ID
  projectId: string
  dueDate: string
  estimatedHours: number
  actualHours: number
  tags: string[]
  comments: TaskComment[]
  manufacturingStep: string
  qualityCheckpoints: string[]
  safetyRequirements: string[]
  createdAt: string
  updatedAt: string
}

export interface TaskComment {
  userId: string
  text: string
  timestamp: string
}

export interface Activity {
  id: string
  type: 'task_completed' | 'project_created' | 'user_joined' | 'task_assigned' | 'quality_check' | 'safety_incident'
  title: string
  description: string
  userId: string
  userName: string
  userAvatar: string
  timestamp: string
  metadata: Record<string, any>
}

export interface OrgChartNode {
  id: string
  name: string
  position: string
  department: string
  manager: string | null
  reports: string[]
  avatar: string
  level: number
  userId: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  projectId?: string
  equipmentType?: string
  createdAt: string
  updatedAt: string
}

export interface WorkflowNode {
  id: string
  type: 'start' | 'process' | 'decision' | 'quality_check' | 'safety_check' | 'end'
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    assignee?: string
    estimatedHours?: number
    qualityRequirements?: string[]
    safetyRequirements?: string[]
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type: 'default' | 'conditional'
  data?: {
    condition?: string
    label?: string
  }
}

export interface DashboardMetrics {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  teamUtilization: number
  averageProjectDuration: number
  qualityScore: number
  safetyScore: number
}

export interface Equipment {
  id: string
  name: string
  type: 'Industrial Robots' | 'Automation Systems' | 'Manufacturing Equipment' | 'Quality Control Systems' | 'Smart Sensors' | 'other'
  model: string
  serialNumber: string
  manufacturer: string
  specifications: Record<string, any>
  manufacturingDate: string
  status: 'in_production' | 'completed' | 'delivered' | 'maintenance'
  projectId: string
  qualityChecks: QualityCheck[]
  safetyInspections: SafetyInspection[]
  createdAt: string
  updatedAt: string
}

export interface QualityCheck {
  id: string
  equipmentId: string
  checkpoint: string
  status: 'passed' | 'failed' | 'pending'
  inspector: string
  notes: string
  timestamp: string
  photos?: string[]
}

export interface SafetyInspection {
  id: string
  equipmentId: string
  inspectionType: string
  status: 'passed' | 'failed' | 'pending'
  inspector: string
  notes: string
  timestamp: string
  complianceStandards: string[]
}
