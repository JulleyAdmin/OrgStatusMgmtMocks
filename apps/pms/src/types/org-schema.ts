// Org & Identity Schema for Manufacturing PMS
// EPIC A - Organization Structure, Positions, Assignments, and Delegations

/**
 * Department - Represents organizational departments
 */
export interface Department {
  id: string
  companyId: string
  name: string
  code: string // Short code like "MFG", "QA", "ENG"
  description: string
  parentDepartmentId: string | null // For hierarchical departments
  
  // Metadata
  location?: string
  costCenter?: string
  budget?: number
  
  // Status
  status: 'active' | 'inactive' | 'archived'
  
  // Timestamps
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

/**
 * Position - Represents a role/position in the organization
 */
export interface Position {
  id: string
  companyId: string
  departmentId: string
  
  // Position Details
  title: string // e.g., "Production Line Supervisor"
  code: string // Short code like "PLS-001"
  description: string
  level: number // Organizational level (1 = top, higher = lower in hierarchy)
  
  // Scope and Responsibilities
  scope: PositionScope
  responsibilities: string[]
  
  // Required Skills
  requiredSkills: string[]
  optionalSkills: string[]
  certifications: string[]
  
  // Reporting Structure
  reportsToPositionId: string | null // Position this role reports to
  
  // Employment Details
  employmentType: 'full_time' | 'part_time' | 'contract' | 'temporary'
  headcount: number // Number of positions with this title
  
  // Approval Authority
  approvalAuthority: ApprovalAuthority
  
  // Status
  status: 'active' | 'inactive' | 'archived'
  
  // Timestamps
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

/**
 * Position Scope - Defines what areas this position has authority over
 */
export interface PositionScope {
  departments: string[] // Department IDs this position has scope over
  locations: string[] // Physical locations
  productLines: string[] // Product lines or manufacturing lines
  processes: string[] // Business processes (e.g., "QA Approval", "Production Planning")
  equipmentTypes: string[] // Types of equipment
}

/**
 * Approval Authority - Defines what this position can approve
 */
export interface ApprovalAuthority {
  canApproveProjects: boolean
  canApproveBudgets: boolean
  canApproveQuality: boolean
  canApproveSafety: boolean
  canApproveTimeOff: boolean
  budgetLimit?: number // Max budget they can approve
  customApprovals: string[] // Custom approval types specific to the company
}

/**
 * Position Assignment - Links a person to a position with history
 */
export interface PositionAssignment {
  id: string
  companyId: string
  positionId: string
  userId: string
  
  // Assignment Details
  assignmentType: 'permanent' | 'temporary' | 'acting'
  
  // Time Period
  startAt: string // ISO timestamp
  endAt: string | null // null means current/active
  
  // Assignment Reason
  reason: string // e.g., "Promotion", "Transfer", "Temporary Cover", "New Hire"
  notes: string
  
  // Status
  status: 'active' | 'ended' | 'cancelled'
  
  // Who made the assignment
  assignedBy: string // User ID
  approvedBy: string | null // User ID if approval was required
  
  // Timestamps
  createdAt: string
  updatedAt: string
  
  // Previous occupant reference (for history tracking)
  previousAssignmentId: string | null
}

/**
 * Delegation - Temporary delegation of authority/responsibilities
 */
export interface Delegation {
  id: string
  companyId: string
  
  // Who is delegating
  delegatorUserId: string
  delegatorPositionId: string
  
  // Who is receiving the delegation
  delegateUserId: string
  delegatePositionId: string
  
  // Delegation Scope
  scope: DelegationScope
  
  // Time Period
  startAt: string // ISO timestamp
  endAt: string // ISO timestamp - must have end date
  
  // Status
  status: 'pending' | 'active' | 'expired' | 'revoked' | 'rejected'
  
  // Approval (if required by company policy)
  requiresApproval: boolean
  approvedBy: string | null
  approvedAt: string | null
  rejectionReason: string | null
  
  // Delegation Details
  reason: string
  notes: string
  notifyStakeholders: boolean // Auto-notify affected parties
  
  // Timestamps
  createdAt: string
  updatedAt: string
  revokedAt: string | null
  revokedBy: string | null
  
  // Auto-activation tracking
  activatedAt: string | null
}

/**
 * Delegation Scope - What is being delegated
 */
export interface DelegationScope {
  // Scope Type
  type: 'all' | 'partial' | 'specific'
  
  // If partial or specific, define what's included
  departments: string[] // Department IDs
  locations: string[]
  processes: string[] // e.g., "QA approvals in Line-3"
  approvalTypes: string[] // Specific approval types
  
  // Work Item Filters
  projectIds: string[] // Specific projects
  taskTypes: string[] // Types of tasks
  
  // Authority Limits
  budgetLimit: number | null // Max budget authority delegated
  
  // Description for clarity
  description: string // Human-readable description like "All QA approvals in Line-3"
}

/**
 * Org Audit Log - Track all organizational changes for compliance
 */
export interface OrgAuditLog {
  id: string
  companyId: string
  
  // What changed
  entityType: 'department' | 'position' | 'assignment' | 'delegation'
  entityId: string
  action: 'create' | 'update' | 'delete' | 'assign' | 'unassign' | 'approve' | 'reject' | 'revoke'
  
  // Who made the change
  userId: string
  userName: string
  userEmail: string
  
  // Change Details
  changes: AuditLogChange[]
  
  // Context
  reason: string
  notes: string
  
  // Related Entities (for complex operations like swaps)
  relatedEntities: RelatedEntity[]
  
  // Compliance & Tracking
  ipAddress: string | null
  userAgent: string | null
  timestamp: string
  
  // Approval Chain (if applicable)
  approvalChain: ApprovalChainEntry[]
}

/**
 * Audit Log Change - Individual field changes
 */
export interface AuditLogChange {
  field: string
  oldValue: any
  newValue: any
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'
}

/**
 * Related Entity - Links to other entities affected by the change
 */
export interface RelatedEntity {
  entityType: string
  entityId: string
  relationshipType: string // e.g., "swapped_with", "replaced_by", "reported_to"
}

/**
 * Approval Chain Entry - Tracks approvals in the audit log
 */
export interface ApprovalChainEntry {
  approverUserId: string
  approverName: string
  approvalLevel: number
  action: 'approved' | 'rejected' | 'pending'
  timestamp: string
  comments: string
}

/**
 * Occupant Swap Request - Special operation to swap two people's positions
 */
export interface OccupantSwapRequest {
  id: string
  companyId: string
  
  // Position A
  positionA: {
    positionId: string
    currentUserId: string
    currentAssignmentId: string
  }
  
  // Position B
  positionB: {
    positionId: string
    currentUserId: string
    currentAssignmentId: string
  }
  
  // Swap Details
  reason: string
  notes: string
  effectiveDate: string // When the swap should take effect
  
  // Status
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
  
  // Approval
  requiresApproval: boolean
  approvedBy: string | null
  approvedAt: string | null
  rejectionReason: string | null
  
  // Execution Tracking
  startedAt: string | null
  completedAt: string | null
  
  // Work Item Reassignment Status
  workItemsReassigned: boolean
  reassignmentDetails: {
    tasksReassigned: number
    projectsUpdated: number
    approvalsTransferred: number
    errors: string[]
  } | null
  
  // Timestamps
  createdAt: string
  createdBy: string
  updatedAt: string
}

/**
 * Effective Assignment - Resolved view of who is effectively responsible
 * This considers both direct assignments and active delegations
 */
export interface EffectiveAssignment {
  positionId: string
  userId: string
  assignmentId: string
  
  // Delegation info (if applicable)
  isDelegated: boolean
  delegationId: string | null
  originalUserId: string | null // If delegated, who originally had the assignment
  
  // Validity
  validFrom: string
  validUntil: string | null
  
  // Resolution time (for 60s SLA tracking)
  resolvedAt: string
  resolutionTimeMs: number
}

/**
 * Position History View - For compliance reports
 */
export interface PositionHistoryView {
  positionId: string
  positionTitle: string
  departmentName: string
  
  assignments: {
    userId: string
    userName: string
    userEmail: string
    startAt: string
    endAt: string | null
    assignmentType: string
    reason: string
    isActive: boolean
  }[]
  
  // For specific time queries
  occupantAt?: {
    timestamp: string
    userId: string
    userName: string
    userEmail: string
    assignmentId: string
  }
}

/**
 * Work Item Assignment Context - For resolving who should work on something
 */
export interface WorkItemAssignmentContext {
  itemType: 'task' | 'project' | 'approval' | 'quality_check' | 'safety_inspection'
  itemId: string
  
  // Original assignment
  originalPositionId: string | null
  originalUserId: string | null
  
  // Effective assignment (after delegation resolution)
  effectivePositionId: string
  effectiveUserId: string
  effectiveAssignmentId: string
  
  // Delegation chain (if any)
  delegationChain: {
    delegationId: string
    fromUserId: string
    toUserId: string
    reason: string
  }[]
  
  // Resolution metadata
  resolvedAt: string
  resolutionTimeMs: number
  usedCache: boolean
}

/**
 * Delegation Resolution Cache - For 60s SLA performance
 */
export interface DelegationResolutionCache {
  id: string
  companyId: string
  positionId: string
  
  // Resolved assignments
  effectiveUserId: string
  delegationIds: string[]
  
  // Cache validity
  validFrom: string
  validUntil: string
  
  // Cache metadata
  createdAt: string
  lastUsedAt: string
  hitCount: number
}

