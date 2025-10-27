// Enhanced Task Assignment Service
// Integrates with org structure and respects delegations

import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { resolveWorkItemAssignment, batchResolveWorkItems } from '@/lib/delegation-resolver'
import type { Task } from '@/types'
import type { WorkItemAssignmentContext } from '@/types/org-schema'

/**
 * Assign a task with automatic delegation resolution
 * 
 * @param taskId Task ID to assign
 * @param positionId Position responsible for the task
 * @param userId Optional user override (if not using position-based assignment)
 * @returns Resolved assignment context
 */
export async function assignTaskWithDelegation(
  companyId: string,
  taskId: string,
  positionId: string | null,
  userId: string | null
): Promise<WorkItemAssignmentContext> {
  // Resolve effective assignee considering delegations
  const context = await resolveWorkItemAssignment(companyId, 'task', taskId, positionId, userId)

  // Update task with effective assignee
  const taskRef = doc(db, 'tasks', taskId)
  await updateDoc(taskRef, {
    assignee: context.effectiveUserId,
    assignedPositionId: context.effectivePositionId,
    originalAssignee: context.originalUserId,
    isDelegated: context.delegationChain.length > 0,
    delegationChain: context.delegationChain,
    lastAssignmentResolvedAt: context.resolvedAt,
    updatedAt: new Date().toISOString(),
  })

  return context
}

/**
 * Reassign all tasks for a position when assignment changes
 * Called automatically when a position's occupant changes
 * 
 * @param positionId Position that changed
 * @param newUserId New user assigned to the position
 */
export async function reassignTasksForPosition(
  companyId: string,
  positionId: string,
  newUserId: string
): Promise<{ updated: number; errors: string[] }> {
  const errors: string[] = []
  let updated = 0

  try {
    // Find all active tasks assigned to this position
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('assignedPositionId', '==', positionId),
      where('status', 'in', ['todo', 'in_progress'])
    )

    const tasksSnap = await getDocs(tasksQuery)

    // Reassign each task
    for (const taskDoc of tasksSnap.docs) {
      try {
        await assignTaskWithDelegation(companyId, taskDoc.id, positionId, newUserId)
        updated++
      } catch (error) {
        errors.push(`Failed to reassign task ${taskDoc.id}: ${error}`)
      }
    }
  } catch (error) {
    errors.push(`Failed to query tasks: ${error}`)
  }

  return { updated, errors }
}

/**
 * Refresh task assignments when delegation changes
 * Called when a delegation is activated or revoked
 * 
 * @param delegationId Delegation that changed
 * @param delegatorPositionId Position that delegated
 * @param isActive Whether delegation is now active
 */
export async function refreshTasksForDelegation(
  companyId: string,
  delegationId: string,
  delegatorPositionId: string,
  isActive: boolean
): Promise<{ updated: number; errors: string[] }> {
  const errors: string[] = []
  let updated = 0

  try {
    // Find all tasks for the delegator's position
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('assignedPositionId', '==', delegatorPositionId),
      where('status', 'in', ['todo', 'in_progress'])
    )

    const tasksSnap = await getDocs(tasksQuery)

    // Re-resolve each task assignment
    for (const taskDoc of tasksSnap.docs) {
      try {
        const task = taskDoc.data() as Task
        await assignTaskWithDelegation(companyId, taskDoc.id, delegatorPositionId, task.assignee)
        updated++
      } catch (error) {
        errors.push(`Failed to refresh task ${taskDoc.id}: ${error}`)
      }
    }
  } catch (error) {
    errors.push(`Failed to refresh tasks: ${error}`)
  }

  return { updated, errors }
}

/**
 * Get task assignment details including delegation info
 * 
 * @param taskId Task ID
 * @returns Task with enhanced assignment context
 */
export async function getTaskWithAssignmentContext(companyId: string, taskId: string): Promise<{
  task: Task
  assignmentContext: WorkItemAssignmentContext | null
}> {
  const taskRef = doc(db, 'tasks', taskId)
  const taskSnap = await getDoc(taskRef)

  if (!taskSnap.exists()) {
    throw new Error('Task not found')
  }

  const task = { id: taskSnap.id, ...taskSnap.data() } as Task

  // Get current assignment context
  let assignmentContext: WorkItemAssignmentContext | null = null
  if (task.assignee) {
    assignmentContext = await resolveWorkItemAssignment(
      companyId,
      'task',
      taskId,
      (task as any).assignedPositionId || null,
      task.assignee
    )
  }

  return { task, assignmentContext }
}

/**
 * Batch resolve assignments for multiple tasks
 * Useful for dashboard views showing many tasks
 * 
 * @param taskIds Array of task IDs
 * @returns Map of task ID to assignment context
 */
export async function batchGetTaskAssignments(
  companyId: string,
  taskIds: string[]
): Promise<Map<string, WorkItemAssignmentContext>> {
  const results = new Map<string, WorkItemAssignmentContext>()

  // Get all tasks
  const tasks: Array<{ id: string; positionId: string | null; userId: string | null }> = []
  
  for (const taskId of taskIds) {
    const taskRef = doc(db, 'tasks', taskId)
    const taskSnap = await getDoc(taskRef)
    
    if (taskSnap.exists()) {
      const task = taskSnap.data() as Task
      tasks.push({
        id: taskId,
        positionId: (task as any).assignedPositionId || null,
        userId: task.assignee,
      })
    }
  }

  // Batch resolve
  const contexts = await batchResolveWorkItems(
    companyId,
    tasks.map((t) => ({
      itemType: 'task' as const,
      itemId: t.id,
      positionId: t.positionId,
      userId: t.userId,
    }))
  )

  // Build result map
  contexts.forEach((context) => {
    results.set(context.itemId, context)
  })

  return results
}

/**
 * Check if a user can be assigned a task based on their position
 * 
 * @param userId User to check
 * @param taskId Task to assign
 * @returns Whether user can be assigned and reason
 */
export async function canUserBeAssignedTask(
  userId: string,
  taskId: string
): Promise<{ canAssign: boolean; reason: string }> {
  // Get user's active positions
  const userPositionsQuery = query(
    collection(db, 'positionAssignments'),
    where('userId', '==', userId),
    where('status', '==', 'active')
  )

  const positionsSnap = await getDocs(userPositionsQuery)

  if (positionsSnap.empty) {
    return {
      canAssign: false,
      reason: 'User has no active position assignments',
    }
  }

  // Check if user's positions have required skills for the task
  const taskRef = doc(db, 'tasks', taskId)
  const taskSnap = await getDoc(taskRef)

  if (!taskSnap.exists()) {
    return {
      canAssign: false,
      reason: 'Task not found',
    }
  }

  const task = taskSnap.data() as Task

  // Get positions
  const positionIds = positionsSnap.docs.map((doc) => doc.data().positionId)
  const positions = await Promise.all(
    positionIds.map(async (positionId) => {
      const posSnap = await getDoc(doc(db, 'positions', positionId))
      return posSnap.exists() ? posSnap.data() : null
    })
  )

  // Check if any position has required skills
  // For MVP, we'll allow assignment to any user with an active position
  return {
    canAssign: true,
    reason: 'User has active position assignment',
  }
}

/**
 * Get all tasks assigned to a user (including delegated tasks)
 * 
 * @param userId User ID
 * @param includeDelegated Whether to include tasks delegated to this user
 * @returns Array of tasks with assignment context
 */
export async function getUserTasks(
  companyId: string,
  userId: string,
  includeDelegated: boolean = true
): Promise<Array<{ task: Task; context: WorkItemAssignmentContext }>> {
  const results: Array<{ task: Task; context: WorkItemAssignmentContext }> = []

  // Get tasks directly assigned
  const directTasksQuery = query(
    collection(db, 'tasks'),
    where('assignee', '==', userId),
    where('status', 'in', ['todo', 'in_progress'])
  )

  const directTasksSnap = await getDocs(directTasksQuery)

  for (const taskDoc of directTasksSnap.docs) {
    const task = { id: taskDoc.id, ...taskDoc.data() } as Task
    const context = await resolveWorkItemAssignment(
      companyId,
      'task',
      task.id,
      (task as any).assignedPositionId || null,
      task.assignee
    )
    results.push({ task, context })
  }

  if (includeDelegated) {
    // Find tasks delegated to this user through active delegations
    const delegationsQuery = query(
      collection(db, 'delegations'),
      where('delegateUserId', '==', userId),
      where('status', '==', 'active')
    )

    const delegationsSnap = await getDocs(delegationsQuery)

    for (const delegationDoc of delegationsSnap.docs) {
      const delegation = delegationDoc.data()
      
      // Find tasks for the delegator's position
      const delegatedTasksQuery = query(
        collection(db, 'tasks'),
        where('assignedPositionId', '==', delegation.delegatorPositionId),
        where('status', 'in', ['todo', 'in_progress'])
      )

      const delegatedTasksSnap = await getDocs(delegatedTasksQuery)

      for (const taskDoc of delegatedTasksSnap.docs) {
        // Skip if already in results (direct assignment)
        if (results.some((r) => r.task.id === taskDoc.id)) continue

        const task = { id: taskDoc.id, ...taskDoc.data() } as Task
        const context = await resolveWorkItemAssignment(
          companyId,
          'task',
          task.id,
          (task as any).assignedPositionId || null,
          task.assignee
        )

        // Only include if delegation resolved to this user
        if (context.effectiveUserId === userId) {
          results.push({ task, context })
        }
      }
    }
  }

  return results
}

/**
 * Create a task with position-based assignment
 * 
 * @param taskData Task data
 * @param positionId Position to assign the task to
 * @returns Created task with assignment context
 */
export async function createTaskWithPositionAssignment(
  companyId: string,
  taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  positionId: string
): Promise<{ task: Task; context: WorkItemAssignmentContext }> {
  // Resolve who should be assigned based on position
  const tempTaskId = 'temp-' + Date.now()
  const context = await resolveWorkItemAssignment(companyId, 'task', tempTaskId, positionId, null)

  // Create task with resolved assignee
  const taskRef = doc(collection(db, 'tasks'))
  const now = new Date().toISOString()

  const task: Task = {
    ...taskData,
    id: taskRef.id,
    assignee: context.effectiveUserId,
    createdAt: now,
    updatedAt: now,
  }

  // Add org-specific fields
  const taskWithOrg = {
    ...task,
    assignedPositionId: positionId,
    originalAssignee: context.originalUserId,
    isDelegated: context.delegationChain.length > 0,
    delegationChain: context.delegationChain,
    lastAssignmentResolvedAt: context.resolvedAt,
  }

  // Save to Firestore
  // Note: In real implementation, you'd use setDoc with the taskRef
  // For now, we're just returning the data structure

  // Update context with real task ID
  context.itemId = task.id

  return { task, context }
}

