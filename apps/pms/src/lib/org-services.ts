// Organization Structure Services
// CRUD operations for departments, positions, assignments, and delegations

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  runTransaction,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  Department,
  Position,
  PositionAssignment,
  Delegation,
  OrgAuditLog,
  OccupantSwapRequest,
  EffectiveAssignment,
  PositionHistoryView,
  WorkItemAssignmentContext,
  DelegationResolutionCache,
} from '@/types/org-schema'

// ============================================================================
// DEPARTMENT OPERATIONS
// ============================================================================

/**
 * Create a new department
 */
export async function createDepartment(
  companyId: string,
  data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<Department> {
  const departmentRef = doc(collection(db, 'companies', companyId, 'departments'))
  const now = new Date().toISOString()

  const department: Department = {
    ...data,
    id: departmentRef.id,
    companyId,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: userId,
  }

  await setDoc(departmentRef, department)
  
  // Log audit trail
  await createAuditLog({
    companyId,
    entityType: 'department',
    entityId: department.id,
    action: 'create',
    userId,
    changes: [
      { field: 'name', oldValue: null, newValue: department.name, dataType: 'string' },
      { field: 'code', oldValue: null, newValue: department.code, dataType: 'string' },
    ],
    reason: 'Department created',
  })

  return department
}

/**
 * Update a department
 */
export async function updateDepartment(
  companyId: string,
  departmentId: string,
  updates: Partial<Department>,
  userId: string
): Promise<void> {
  const departmentRef = doc(db, 'companies', companyId, 'departments', departmentId)
  const departmentSnap = await getDoc(departmentRef)
  
  if (!departmentSnap.exists()) {
    throw new Error('Department not found')
  }

  const oldData = departmentSnap.data() as Department
  const now = new Date().toISOString()

  await updateDoc(departmentRef, {
    ...updates,
    updatedAt: now,
    updatedBy: userId,
  })

  // Log changes
  const changes = Object.keys(updates)
    .filter(key => key !== 'updatedAt' && key !== 'updatedBy')
    .map(key => ({
      field: key,
      oldValue: oldData[key as keyof Department],
      newValue: updates[key as keyof Department],
      dataType: typeof updates[key as keyof Department] as any,
    }))

  await createAuditLog({
    companyId: oldData.companyId,
    entityType: 'department',
    entityId: departmentId,
    action: 'update',
    userId,
    changes,
    reason: 'Department updated',
  })
}

/**
 * Get department by ID
 */
export async function getDepartment(companyId: string, departmentId: string): Promise<Department | null> {
  const departmentSnap = await getDoc(doc(db, 'companies', companyId, 'departments', departmentId))
  return departmentSnap.exists() ? (departmentSnap.data() as Department) : null
}

/**
 * Get all departments for a company
 */
export async function getDepartments(companyId: string): Promise<Department[]> {
  const q = query(
    collection(db, 'companies', companyId, 'departments'),
    where('status', '==', 'active'),
    orderBy('name')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as Department)
}

/**
 * Delete a department (soft delete by setting status to archived)
 */
export async function deleteDepartment(companyId: string, departmentId: string, userId: string): Promise<void> {
  await updateDepartment(companyId, departmentId, { status: 'archived' }, userId)
}

// ============================================================================
// POSITION OPERATIONS
// ============================================================================

/**
 * Create a new position
 */
export async function createPosition(
  companyId: string,
  data: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<Position> {
  const positionRef = doc(collection(db, 'companies', companyId, 'positions'))
  const now = new Date().toISOString()

  const position: Position = {
    ...data,
    id: positionRef.id,
    companyId,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: userId,
  }

  await setDoc(positionRef, position)
  
  await createAuditLog({
    companyId,
    entityType: 'position',
    entityId: position.id,
    action: 'create',
    userId,
    changes: [
      { field: 'title', oldValue: null, newValue: position.title, dataType: 'string' },
      { field: 'code', oldValue: null, newValue: position.code, dataType: 'string' },
      { field: 'departmentId', oldValue: null, newValue: position.departmentId, dataType: 'string' },
    ],
    reason: 'Position created',
  })

  return position
}

/**
 * Update a position
 */
export async function updatePosition(
  companyId: string,
  positionId: string,
  updates: Partial<Position>,
  userId: string
): Promise<void> {
  const positionRef = doc(db, 'companies', companyId, 'positions', positionId)
  const positionSnap = await getDoc(positionRef)
  
  if (!positionSnap.exists()) {
    throw new Error('Position not found')
  }

  const oldData = positionSnap.data() as Position
  const now = new Date().toISOString()

  await updateDoc(positionRef, {
    ...updates,
    updatedAt: now,
    updatedBy: userId,
  })

  const changes = Object.keys(updates)
    .filter(key => key !== 'updatedAt' && key !== 'updatedBy')
    .map(key => ({
      field: key,
      oldValue: oldData[key as keyof Position],
      newValue: updates[key as keyof Position],
      dataType: typeof updates[key as keyof Position] as any,
    }))

  await createAuditLog({
    companyId: oldData.companyId,
    entityType: 'position',
    entityId: positionId,
    action: 'update',
    userId,
    changes,
    reason: 'Position updated',
  })
}

/**
 * Get position by ID
 */
export async function getPosition(companyId: string, positionId: string): Promise<Position | null> {
  const positionSnap = await getDoc(doc(db, 'companies', companyId, 'positions', positionId))
  return positionSnap.exists() ? (positionSnap.data() as Position) : null
}

/**
 * Get all positions for a company
 */
export async function getPositions(companyId: string): Promise<Position[]> {
  const q = query(
    collection(db, 'companies', companyId, 'positions'),
    where('status', '==', 'active'),
    orderBy('level'),
    orderBy('title')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as Position)
}

/**
 * Get positions by department
 */
export async function getPositionsByDepartment(companyId: string, departmentId: string): Promise<Position[]> {
  const q = query(
    collection(db, 'companies', companyId, 'positions'),
    where('departmentId', '==', departmentId),
    where('status', '==', 'active'),
    orderBy('level'),
    orderBy('title')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as Position)
}

/**
 * Delete a position
 */
export async function deletePosition(companyId: string, positionId: string, userId: string): Promise<void> {
  await updatePosition(companyId, positionId, { status: 'archived' }, userId)
}

// ============================================================================
// POSITION ASSIGNMENT OPERATIONS
// ============================================================================

/**
 * Assign a user to a position
 */
export async function assignUserToPosition(
  companyId: string,
  positionId: string,
  userId: string,
  data: {
    assignmentType: 'permanent' | 'temporary' | 'acting'
    startAt: string
    endAt?: string | null
    reason: string
    notes: string
  },
  assignedBy: string
): Promise<PositionAssignment> {
  return await runTransaction(db, async (transaction) => {
    // Check for existing active assignment
    const existingQuery = query(
      collection(db, 'companies', companyId, 'positionAssignments'),
      where('positionId', '==', positionId),
      where('status', '==', 'active')
    )
    
    const existingSnap = await getDocs(existingQuery)
    let previousAssignmentId: string | null = null

    // Close existing active assignment
    if (!existingSnap.empty && existingSnap.docs[0]) {
      const existingAssignment = existingSnap.docs[0]
      previousAssignmentId = existingAssignment.id
      const existingRef = doc(db, 'companies', companyId, 'positionAssignments', existingAssignment.id)
      
      transaction.update(existingRef, {
        endAt: data.startAt,
        status: 'ended',
        updatedAt: new Date().toISOString(),
      })
    }

    // Create new assignment
    const assignmentRef = doc(collection(db, 'companies', companyId, 'positionAssignments'))
    const now = new Date().toISOString()

    const assignment: PositionAssignment = {
      id: assignmentRef.id,
      companyId,
      positionId,
      userId,
      assignmentType: data.assignmentType,
      startAt: data.startAt,
      endAt: data.endAt || null,
      reason: data.reason,
      notes: data.notes,
      status: 'active',
      assignedBy,
      approvedBy: null,
      createdAt: now,
      updatedAt: now,
      previousAssignmentId,
    }

    transaction.set(assignmentRef, assignment)

    // Invalidate delegation cache for this position
    await invalidateDelegationCache(companyId, positionId)

    return assignment
  })
}

/**
 * Get current active assignment for a position
 */
export async function getCurrentAssignment(companyId: string, positionId: string): Promise<PositionAssignment | null> {
  const q = query(
    collection(db, 'companies', companyId, 'positionAssignments'),
    where('positionId', '==', positionId),
    where('status', '==', 'active'),
    limit(1)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.empty || !snapshot.docs[0] ? null : (snapshot.docs[0].data() as PositionAssignment)
}

/**
 * Get assignment history for a position
 */
export async function getPositionAssignmentHistory(
  companyId: string,
  positionId: string
): Promise<PositionAssignment[]> {
  const q = query(
    collection(db, 'companies', companyId, 'positionAssignments'),
    where('positionId', '==', positionId),
    orderBy('startAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as PositionAssignment)
}

/**
 * Get all assignments for a user
 */
export async function getUserAssignments(companyId: string, userId: string): Promise<PositionAssignment[]> {
  const q = query(
    collection(db, 'companies', companyId, 'positionAssignments'),
    where('userId', '==', userId),
    orderBy('startAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as PositionAssignment)
}

/**
 * End a position assignment
 */
export async function endPositionAssignment(
  companyId: string,
  assignmentId: string,
  endAt: string,
  userId: string
): Promise<void> {
  const assignmentRef = doc(db, 'companies', companyId, 'positionAssignments', assignmentId)
  
  await updateDoc(assignmentRef, {
    endAt,
    status: 'ended',
    updatedAt: new Date().toISOString(),
  })

  const assignment = await getDoc(assignmentRef)
  const assignmentData = assignment.data() as PositionAssignment

  await createAuditLog({
    companyId: assignmentData.companyId,
    entityType: 'assignment',
    entityId: assignmentId,
    action: 'unassign',
    userId,
    changes: [
      { field: 'endAt', oldValue: null, newValue: endAt, dataType: 'date' },
      { field: 'status', oldValue: 'active', newValue: 'ended', dataType: 'string' },
    ],
    reason: 'Assignment ended',
  })

  // Invalidate cache
  await invalidateDelegationCache(companyId, assignmentData.positionId)
}

// ============================================================================
// OCCUPANT SWAP OPERATIONS
// ============================================================================

/**
 * Swap two position occupants
 * This is a complex operation that:
 * 1. Ends current assignments
 * 2. Creates new cross-assignments
 * 3. Reassigns all work items within 60s
 */
export async function swapOccupants(
  companyId: string,
  positionAId: string,
  positionBId: string,
  reason: string,
  notes: string,
  effectiveDate: string,
  userId: string
): Promise<OccupantSwapRequest> {
  // Create swap request
  const swapRef = doc(collection(db, 'companies', companyId, 'occupantSwaps'))
  const now = new Date().toISOString()

  // Get current assignments
  const assignmentA = await getCurrentAssignment(companyId, positionAId)
  const assignmentB = await getCurrentAssignment(companyId, positionBId)

  if (!assignmentA || !assignmentB) {
    throw new Error('Both positions must have active occupants to swap')
  }

  const swap: OccupantSwapRequest = {
    id: swapRef.id,
    companyId,
    positionA: {
      positionId: positionAId,
      currentUserId: assignmentA.userId,
      currentAssignmentId: assignmentA.id,
    },
    positionB: {
      positionId: positionBId,
      currentUserId: assignmentB.userId,
      currentAssignmentId: assignmentB.id,
    },
    reason,
    notes,
    effectiveDate,
    status: 'in_progress',
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    startedAt: now,
    completedAt: null,
    workItemsReassigned: false,
    reassignmentDetails: null,
    createdAt: now,
    createdBy: userId,
    updatedAt: now,
  }

  await setDoc(swapRef, swap)

  // Execute swap in transaction
  try {
    await runTransaction(db, async (transaction) => {
      // End current assignments
      const assignmentARef = doc(db, 'companies', companyId, 'positionAssignments', assignmentA.id)
      const assignmentBRef = doc(db, 'companies', companyId, 'positionAssignments', assignmentB.id)

      transaction.update(assignmentARef, {
        endAt: effectiveDate,
        status: 'ended',
        updatedAt: now,
      })

      transaction.update(assignmentBRef, {
        endAt: effectiveDate,
        status: 'ended',
        updatedAt: now,
      })

      // Create new swapped assignments
      const newAssignmentARef = doc(collection(db, 'companies', companyId, 'positionAssignments'))
      const newAssignmentBRef = doc(collection(db, 'companies', companyId, 'positionAssignments'))

      const newAssignmentA: PositionAssignment = {
        id: newAssignmentARef.id,
        companyId,
        positionId: positionAId,
        userId: assignmentB.userId, // User B now in Position A
        assignmentType: 'permanent',
        startAt: effectiveDate,
        endAt: null,
        reason: `Swapped from ${positionBId}`,
        notes: `Part of swap: ${swap.id}`,
        status: 'active',
        assignedBy: userId,
        approvedBy: null,
        createdAt: now,
        updatedAt: now,
        previousAssignmentId: assignmentA.id,
      }

      const newAssignmentB: PositionAssignment = {
        id: newAssignmentBRef.id,
        companyId,
        positionId: positionBId,
        userId: assignmentA.userId, // User A now in Position B
        assignmentType: 'permanent',
        startAt: effectiveDate,
        endAt: null,
        reason: `Swapped from ${positionAId}`,
        notes: `Part of swap: ${swap.id}`,
        status: 'active',
        assignedBy: userId,
        approvedBy: null,
        createdAt: now,
        updatedAt: now,
        previousAssignmentId: assignmentB.id,
      }

      transaction.set(newAssignmentARef, newAssignmentA)
      transaction.set(newAssignmentBRef, newAssignmentB)
    })

    // Reassign work items (async, target < 60s)
    const reassignmentStart = Date.now()
    const reassignmentDetails = await reassignWorkItems(
      companyId,
      [
        { fromUserId: assignmentA.userId, toUserId: assignmentB.userId, positionId: positionAId },
        { fromUserId: assignmentB.userId, toUserId: assignmentA.userId, positionId: positionBId },
      ]
    )
    const reassignmentTime = Date.now() - reassignmentStart

    console.log(`Work items reassigned in ${reassignmentTime}ms`)

    // Update swap status
    await updateDoc(swapRef, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      workItemsReassigned: true,
      reassignmentDetails,
      updatedAt: new Date().toISOString(),
    })

    swap.status = 'completed'
    swap.completedAt = new Date().toISOString()
    swap.workItemsReassigned = true
    swap.reassignmentDetails = reassignmentDetails

    // Invalidate caches
    await Promise.all([
      invalidateDelegationCache(companyId, positionAId),
      invalidateDelegationCache(companyId, positionBId),
    ])

    // Audit log
    await createAuditLog({
      companyId,
      entityType: 'assignment',
      entityId: swap.id,
      action: 'assign',
      userId,
      changes: [
        {
          field: 'swap',
          oldValue: `${assignmentA.userId}@${positionAId}, ${assignmentB.userId}@${positionBId}`,
          newValue: `${assignmentB.userId}@${positionAId}, ${assignmentA.userId}@${positionBId}`,
          dataType: 'string',
        },
      ],
      reason: `Occupant swap: ${reason}`,
      relatedEntities: [
        { entityType: 'position', entityId: positionAId, relationshipType: 'swapped_with' },
        { entityType: 'position', entityId: positionBId, relationshipType: 'swapped_with' },
      ],
    })

    return swap
  } catch (error) {
    // Update swap status to failed
    await updateDoc(swapRef, {
      status: 'failed',
      updatedAt: new Date().toISOString(),
    })
    throw error
  }
}

/**
 * Reassign work items from one user to another
 */
async function reassignWorkItems(
  companyId: string,
  reassignments: Array<{ fromUserId: string; toUserId: string; positionId: string }>
): Promise<{
  tasksReassigned: number
  projectsUpdated: number
  approvalsTransferred: number
  errors: string[]
}> {
  const batch = writeBatch(db)
  let tasksReassigned = 0
  let projectsUpdated = 0
  let approvalsTransferred = 0
  const errors: string[] = []

  try {
    for (const reassignment of reassignments) {
      // Reassign tasks
      const tasksQuery = query(
        collection(db, 'companies', companyId, 'tasks'),
        where('assignee', '==', reassignment.fromUserId),
        where('status', 'in', ['todo', 'in_progress'])
      )
      
      const taskSnap = await getDocs(tasksQuery)
      taskSnap.docs.forEach(taskDoc => {
        batch.update(taskDoc.ref, {
          assignee: reassignment.toUserId,
          updatedAt: new Date().toISOString(),
        })
        tasksReassigned++
      })

      // Update project managers
      const projectsQuery = query(
        collection(db, 'companies', companyId, 'projects'),
        where('manager', '==', reassignment.fromUserId),
        where('status', 'in', ['planning', 'active'])
      )
      
      const projectSnap = await getDocs(projectsQuery)
      projectSnap.docs.forEach(projectDoc => {
        batch.update(projectDoc.ref, {
          manager: reassignment.toUserId,
          updatedAt: new Date().toISOString(),
        })
        projectsUpdated++
      })

      // TODO: Handle approvals, quality checks, safety inspections, etc.
      // This would involve updating various collections based on position scope
    }

    await batch.commit()
  } catch (error) {
    errors.push(`Failed to reassign work items: ${error}`)
  }

  return { tasksReassigned, projectsUpdated, approvalsTransferred, errors }
}

// ============================================================================
// DELEGATION OPERATIONS
// ============================================================================

/**
 * Create a delegation
 */
export async function createDelegation(
  companyId: string,
  data: Omit<Delegation, 'id' | 'companyId' | 'createdAt' | 'updatedAt' | 'status' | 'activatedAt' | 'revokedAt' | 'revokedBy'>,
  userId: string
): Promise<Delegation> {
  const delegationRef = doc(collection(db, 'companies', companyId, 'delegations'))
  const now = new Date().toISOString()

  const delegation: Delegation = {
    ...data,
    id: delegationRef.id,
    companyId,
    status: data.requiresApproval ? 'pending' : 'active',
    createdAt: now,
    updatedAt: now,
    revokedAt: null,
    revokedBy: null,
    activatedAt: data.requiresApproval ? null : now,
  }

  await setDoc(delegationRef, delegation)

  // Invalidate cache
  await invalidateDelegationCache(companyId, data.delegatorPositionId)

  await createAuditLog({
    companyId,
    entityType: 'delegation',
    entityId: delegation.id,
    action: 'create',
    userId,
    changes: [
      { field: 'delegatorUserId', oldValue: null, newValue: data.delegatorUserId, dataType: 'string' },
      { field: 'delegateUserId', oldValue: null, newValue: data.delegateUserId, dataType: 'string' },
      { field: 'startAt', oldValue: null, newValue: data.startAt, dataType: 'date' },
      { field: 'endAt', oldValue: null, newValue: data.endAt, dataType: 'date' },
    ],
    reason: `Delegation created: ${data.reason}`,
  })

  return delegation
}

/**
 * Approve a delegation
 */
export async function approveDelegation(
  companyId: string,
  delegationId: string,
  approverUserId: string
): Promise<void> {
  const delegationRef = doc(db, 'companies', companyId, 'delegations', delegationId)
  const now = new Date().toISOString()

  await updateDoc(delegationRef, {
    status: 'active',
    approvedBy: approverUserId,
    approvedAt: now,
    activatedAt: now,
    updatedAt: now,
  })

  const delegation = await getDoc(delegationRef)
  const delegationData = delegation.data() as Delegation

  await invalidateDelegationCache(companyId, delegationData.delegatorPositionId)

  await createAuditLog({
    companyId: delegationData.companyId,
    entityType: 'delegation',
    entityId: delegationId,
    action: 'approve',
    userId: approverUserId,
    changes: [
      { field: 'status', oldValue: 'pending', newValue: 'active', dataType: 'string' },
    ],
    reason: 'Delegation approved',
  })
}

/**
 * Reject a delegation
 */
export async function rejectDelegation(
  companyId: string,
  delegationId: string,
  approverUserId: string,
  reason: string
): Promise<void> {
  const delegationRef = doc(db, 'companies', companyId, 'delegations', delegationId)

  await updateDoc(delegationRef, {
    status: 'rejected',
    approvedBy: approverUserId,
    approvedAt: new Date().toISOString(),
    rejectionReason: reason,
    updatedAt: new Date().toISOString(),
  })

  const delegation = await getDoc(delegationRef)
  const delegationData = delegation.data() as Delegation

  await createAuditLog({
    companyId: delegationData.companyId,
    entityType: 'delegation',
    entityId: delegationId,
    action: 'reject',
    userId: approverUserId,
    changes: [
      { field: 'status', oldValue: 'pending', newValue: 'rejected', dataType: 'string' },
    ],
    reason: `Delegation rejected: ${reason}`,
  })
}

/**
 * Revoke a delegation
 */
export async function revokeDelegation(
  companyId: string,
  delegationId: string,
  userId: string,
  reason: string
): Promise<void> {
  const delegationRef = doc(db, 'companies', companyId, 'delegations', delegationId)
  const now = new Date().toISOString()

  await updateDoc(delegationRef, {
    status: 'revoked',
    revokedAt: now,
    revokedBy: userId,
    updatedAt: now,
  })

  const delegation = await getDoc(delegationRef)
  const delegationData = delegation.data() as Delegation

  await invalidateDelegationCache(companyId, delegationData.delegatorPositionId)

  await createAuditLog({
    companyId: delegationData.companyId,
    entityType: 'delegation',
    entityId: delegationId,
    action: 'revoke',
    userId,
    changes: [
      { field: 'status', oldValue: 'active', newValue: 'revoked', dataType: 'string' },
    ],
    reason: `Delegation revoked: ${reason}`,
  })
}

/**
 * Get active delegations for a user (as delegator)
 */
export async function getActiveDelegations(companyId: string, userId: string): Promise<Delegation[]> {
  const now = new Date().toISOString()
  
  const q = query(
    collection(db, 'companies', companyId, 'delegations'),
    where('delegatorUserId', '==', userId),
    where('status', '==', 'active'),
    where('endAt', '>', now)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as Delegation)
}

/**
 * Get delegations received by a user (as delegate)
 */
export async function getReceivedDelegations(companyId: string, userId: string): Promise<Delegation[]> {
  const now = new Date().toISOString()
  
  const q = query(
    collection(db, 'companies', companyId, 'delegations'),
    where('delegateUserId', '==', userId),
    where('status', '==', 'active'),
    where('endAt', '>', now)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as Delegation)
}

// ============================================================================
// EFFECTIVE ASSIGNMENT & DELEGATION RESOLUTION
// ============================================================================

/**
 * Resolve effective assignment for a position (with delegation consideration)
 * Target: < 60s resolution time
 */
export async function resolveEffectiveAssignment(
  companyId: string,
  positionId: string
): Promise<EffectiveAssignment | null> {
  const startTime = Date.now()

  // Check cache first
  const cached = await getDelegationCache(companyId, positionId)
  if (cached && cached.validUntil > new Date().toISOString()) {
    return {
      positionId,
      userId: cached.effectiveUserId,
      assignmentId: '', // Would need to store this in cache
      isDelegated: cached.delegationIds.length > 0,
      delegationId: cached.delegationIds[0] || null,
      originalUserId: null, // Would need to fetch if delegated
      validFrom: cached.validFrom,
      validUntil: cached.validUntil,
      resolvedAt: new Date().toISOString(),
      resolutionTimeMs: Date.now() - startTime,
    }
  }

  // Get current assignment
  const assignment = await getCurrentAssignment(companyId, positionId)
  if (!assignment) {
    return null
  }

  // Check for active delegations
  const now = new Date().toISOString()
  const delegationsQuery = query(
    collection(db, 'companies', companyId, 'delegations'),
    where('delegatorPositionId', '==', positionId),
    where('status', '==', 'active'),
    where('startAt', '<=', now),
    where('endAt', '>', now)
  )

  const delegationSnap = await getDocs(delegationsQuery)
  
  let effectiveUserId = assignment.userId
  let isDelegated = false
  let delegationId: string | null = null
  let originalUserId: string | null = null

  if (!delegationSnap.empty && delegationSnap.docs[0]) {
    // Use first active delegation (would need more complex logic for multiple delegations)
    const delegation = delegationSnap.docs[0].data() as Delegation
    effectiveUserId = delegation.delegateUserId
    isDelegated = true
    delegationId = delegation.id
    originalUserId = assignment.userId
  }

  const resolutionTimeMs = Date.now() - startTime

  // Cache the result
  await cacheDelegationResolution(companyId, positionId, effectiveUserId, delegationId ? [delegationId] : [])

  return {
    positionId,
    userId: effectiveUserId,
    assignmentId: assignment.id,
    isDelegated,
    delegationId,
    originalUserId,
    validFrom: assignment.startAt,
    validUntil: assignment.endAt,
    resolvedAt: new Date().toISOString(),
    resolutionTimeMs,
  }
}

/**
 * Cache delegation resolution
 */
async function cacheDelegationResolution(
  companyId: string,
  positionId: string,
  effectiveUserId: string,
  delegationIds: string[]
): Promise<void> {
  const cacheRef = doc(db, 'companies', companyId, 'delegationCache', positionId)
  const now = new Date().toISOString()
  const validUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minute cache

  const cache: DelegationResolutionCache = {
    id: positionId,
    companyId: '', // Would need to pass this in
    positionId,
    effectiveUserId,
    delegationIds,
    validFrom: now,
    validUntil,
    createdAt: now,
    lastUsedAt: now,
    hitCount: 0,
  }

  await setDoc(cacheRef, cache, { merge: true })
}

/**
 * Get delegation cache
 */
async function getDelegationCache(companyId: string, positionId: string): Promise<DelegationResolutionCache | null> {
  const cacheSnap = await getDoc(doc(db, 'companies', companyId, 'delegationCache', positionId))
  
  if (!cacheSnap.exists()) {
    return null
  }

  // Update hit count
  await updateDoc(cacheSnap.ref, {
    lastUsedAt: new Date().toISOString(),
    hitCount: (cacheSnap.data().hitCount || 0) + 1,
  })

  return cacheSnap.data() as DelegationResolutionCache
}

/**
 * Invalidate delegation cache
 */
async function invalidateDelegationCache(companyId: string, positionId: string): Promise<void> {
  const cacheRef = doc(db, 'companies', companyId, 'delegationCache', positionId)
  try {
    await deleteDoc(cacheRef)
  } catch (error) {
    // Cache might not exist, ignore error
  }
}

// ============================================================================
// AUDIT & REPORTING
// ============================================================================

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: {
  companyId: string
  entityType: 'department' | 'position' | 'assignment' | 'delegation'
  entityId: string
  action: 'create' | 'update' | 'delete' | 'assign' | 'unassign' | 'approve' | 'reject' | 'revoke'
  userId: string
  changes: Array<{ field: string; oldValue: any; newValue: any; dataType: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object' }>
  reason: string
  notes?: string
  relatedEntities?: Array<{ entityType: string; entityId: string; relationshipType: string }>
}): Promise<void> {
  const auditRef = doc(collection(db, 'companies', data.companyId, 'orgAuditLogs'))
  
  // Get user details
  const userSnap = await getDoc(doc(db, 'companies', data.companyId, 'users', data.userId))
  const userData = userSnap.data()

  const auditLog: OrgAuditLog = {
    id: auditRef.id,
    companyId: data.companyId,
    entityType: data.entityType,
    entityId: data.entityId,
    action: data.action,
    userId: data.userId,
    userName: userData?.name || 'Unknown',
    userEmail: userData?.email || 'unknown@example.com',
    changes: data.changes,
    reason: data.reason,
    notes: data.notes || '',
    relatedEntities: data.relatedEntities || [],
    ipAddress: null,
    userAgent: null,
    timestamp: new Date().toISOString(),
    approvalChain: [],
  }

  await setDoc(auditRef, auditLog)
}

/**
 * Get position history for compliance reports
 */
export async function getPositionHistory(
  companyId: string,
  positionId: string,
  atTimestamp?: string
): Promise<PositionHistoryView> {
  const position = await getPosition(companyId, positionId)
  if (!position) {
    throw new Error('Position not found')
  }

  const department = await getDepartment(companyId, position.departmentId)
  const assignments = await getPositionAssignmentHistory(companyId, positionId)

  // Get user details for each assignment
  const assignmentsWithUsers = await Promise.all(
    assignments.map(async (assignment) => {
      const userSnap = await getDoc(doc(db, 'companies', companyId, 'users', assignment.userId))
      const userData = userSnap.data()

      return {
        userId: assignment.userId,
        userName: userData?.name || 'Unknown',
        userEmail: userData?.email || 'unknown@example.com',
        startAt: assignment.startAt,
        endAt: assignment.endAt,
        assignmentType: assignment.assignmentType,
        reason: assignment.reason,
        isActive: assignment.status === 'active',
      }
    })
  )

  const result: PositionHistoryView = {
    positionId,
    positionTitle: position.title,
    departmentName: department?.name || 'Unknown',
    assignments: assignmentsWithUsers,
  }

  // If specific timestamp requested, find who was in position at that time
  if (atTimestamp) {
    const occupantAtTime = assignmentsWithUsers.find(
      (a) => a.startAt <= atTimestamp && (!a.endAt || a.endAt > atTimestamp)
    )

    if (occupantAtTime) {
      const assignment = assignments.find(a => a.userId === occupantAtTime.userId)
      result.occupantAt = {
        timestamp: atTimestamp,
        userId: occupantAtTime.userId,
        userName: occupantAtTime.userName,
        userEmail: occupantAtTime.userEmail,
        assignmentId: assignment?.id || '',
      }
    }
  }

  return result
}

/**
 * Get audit logs for a specific entity
 */
export async function getEntityAuditLogs(
  companyId: string,
  entityType: string,
  entityId: string
): Promise<OrgAuditLog[]> {
  const q = query(
    collection(db, 'companies', companyId, 'orgAuditLogs'),
    where('entityType', '==', entityType),
    where('entityId', '==', entityId),
    orderBy('timestamp', 'desc')
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as OrgAuditLog)
}

/**
 * Get audit logs for a company within a time range
 */
export async function getCompanyAuditLogs(
  companyId: string,
  startDate: string,
  endDate: string
): Promise<OrgAuditLog[]> {
  const q = query(
    collection(db, 'companies', companyId, 'orgAuditLogs'),
    where('companyId', '==', companyId),
    where('timestamp', '>=', startDate),
    where('timestamp', '<=', endDate),
    orderBy('timestamp', 'desc')
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as OrgAuditLog)
}

