// Task Template Management Service
// Handles CRUD operations for task templates and position assignments

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  runTransaction,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import type { 
  TaskTemplate, 
  PositionTaskTemplate, 
  GeneratedTask, 
  TaskLibraryStats,
  TaskAssignmentCondition,
  TaskDoDItem,
  TaskEscalationRule
} from '@/types/task-template-schema'

export class TaskTemplateService {
  
  // ============================================================================
  // TASK TEMPLATE CRUD OPERATIONS
  // ============================================================================
  
  /**
   * Create a new task template
   */
  static async createTaskTemplate(
    companyId: string,
    templateData: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsedAt'>
  ): Promise<string> {
    try {
      const templateRef = collection(db, 'companies', companyId, 'taskTemplates')
      const now = new Date().toISOString()
      
      const templateDataToSave = {
        ...templateData,
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
      }
      
      const docRef = await addDoc(templateRef, templateDataToSave)
      return docRef.id
    } catch (error) {
      console.error('Error creating task template:', error)
      throw error
    }
  }
  
  /**
   * Get all task templates for a company
   */
  static async getTaskTemplates(
    companyId: string,
    filters?: {
      category?: string
      department?: string
      positionLevel?: number
      isActive?: boolean
      isSystemTemplate?: boolean
    }
  ): Promise<TaskTemplate[]> {
    try {
      const templateCollection = collection(db, 'companies', companyId, 'taskTemplates')
      let q = query(templateCollection)
      
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category))
      }
      if (filters?.department) {
        q = query(q, where('department', 'array-contains', filters.department))
      }
      if (filters?.positionLevel) {
        q = query(q, where('positionLevel', 'array-contains', filters.positionLevel))
      }
      if (filters?.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive))
      }
      if (filters?.isSystemTemplate !== undefined) {
        q = query(q, where('isSystemTemplate', '==', filters.isSystemTemplate))
      }
      
      q = query(q, orderBy('name'))
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaskTemplate))
    } catch (error) {
      console.error('Error getting task templates:', error)
      // Return empty array if collection doesn't exist or there's an error
      return []
    }
  }
  
  /**
   * Get a specific task template
   */
  static async getTaskTemplate(companyId: string, templateId: string): Promise<TaskTemplate | null> {
    const templateRef = doc(db, 'companies', companyId, 'taskTemplates', templateId)
    const templateSnap = await getDoc(templateRef)
    
    if (!templateSnap.exists()) {
      return null
    }
    
    return { id: templateSnap.id, ...templateSnap.data() } as TaskTemplate
  }
  
  /**
   * Update a task template
   */
  static async updateTaskTemplate(
    companyId: string,
    templateId: string,
    updates: Partial<TaskTemplate>
  ): Promise<void> {
    const templateRef = doc(db, 'companies', companyId, 'taskTemplates', templateId)
    await updateDoc(templateRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  }
  
  /**
   * Delete a task template
   */
  static async deleteTaskTemplate(companyId: string, templateId: string): Promise<void> {
    const templateRef = doc(db, 'companies', companyId, 'taskTemplates', templateId)
    await deleteDoc(templateRef)
  }
  
  // ============================================================================
  // POSITION-TEMPLATE ASSIGNMENT OPERATIONS
  // ============================================================================
  
  /**
   * Assign a task template to a position
   */
  static async assignTemplateToPosition(
    companyId: string,
    positionId: string,
    templateId: string,
    assignmentConfig: {
      assignmentMode: 'immediate' | 'on_assignment' | 'scheduled' | 'conditional'
      assignmentDate?: string
      assignmentConditions?: TaskAssignmentCondition[]
      customDueDateOffset?: number
      customPriority?: 'low' | 'medium' | 'high' | 'urgent'
      customInstructions?: string
    }
  ): Promise<string> {
    const assignmentRef = collection(db, 'companies', companyId, 'positionTaskTemplates')
    const now = new Date().toISOString()
    
    const assignmentDataToSave: any = {
      companyId,
      positionId,
      templateId,
      assignmentMode: assignmentConfig.assignmentMode,
      customPriority: assignmentConfig.customPriority,
      isActive: true,
      assignmentCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    // Only include customInstructions if it's provided
    if (assignmentConfig.customInstructions) {
      assignmentDataToSave.customInstructions = assignmentConfig.customInstructions
    }

    // Only include assignmentDate if it's provided
    if (assignmentConfig.assignmentDate) {
      assignmentDataToSave.assignmentDate = assignmentConfig.assignmentDate
    }

    // Only include customDueDateOffset if it's provided
    if (assignmentConfig.customDueDateOffset !== undefined) {
      assignmentDataToSave.customDueDateOffset = assignmentConfig.customDueDateOffset
    }

    // Only include assignmentConditions if they're provided
    if (assignmentConfig.assignmentConditions) {
      assignmentDataToSave.assignmentConditions = assignmentConfig.assignmentConditions
    }
    
    const docRef = await addDoc(assignmentRef, assignmentDataToSave)
    return docRef.id
  }
  
  /**
   * Get task templates assigned to a position
   */
  static async getPositionTaskTemplates(
    companyId: string,
    positionId: string
  ): Promise<PositionTaskTemplate[]> {
    const q = query(
      collection(db, 'companies', companyId, 'positionTaskTemplates'),
      where('positionId', '==', positionId),
      where('isActive', '==', true)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PositionTaskTemplate))
  }
  
  /**
   * Get all position assignments for a template
   */
  static async getTemplatePositionAssignments(
    companyId: string,
    templateId: string
  ): Promise<PositionTaskTemplate[]> {
    const q = query(
      collection(db, 'companies', companyId, 'positionTaskTemplates'),
      where('templateId', '==', templateId),
      where('isActive', '==', true)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PositionTaskTemplate))
  }
  
  /**
   * Remove template assignment from position
   */
  static async removeTemplateFromPosition(
    companyId: string,
    positionId: string,
    templateId: string
  ): Promise<void> {
    const q = query(
      collection(db, 'companies', companyId, 'positionTaskTemplates'),
      where('positionId', '==', positionId),
      where('templateId', '==', templateId)
    )
    
    const snapshot = await getDocs(q)
    const batch = snapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(batch)
  }
  
  // ============================================================================
  // TASK GENERATION OPERATIONS
  // ============================================================================
  
  /**
   * Generate tasks from templates for a user's position
   */
  static async generateTasksForUser(
    companyId: string,
    userId: string,
    positionId: string,
    triggerType: 'login' | 'assignment' | 'scheduled' | 'manual'
  ): Promise<GeneratedTask[]> {
    const generatedTasks: GeneratedTask[] = []
    
    // Get all active template assignments for this position
    const positionAssignments = await this.getPositionTaskTemplates(companyId, positionId)
    
    for (const assignment of positionAssignments) {
      // Check if task should be generated based on assignment mode
      const shouldGenerate = await this.shouldGenerateTask(assignment, triggerType)
      
      if (shouldGenerate) {
        const template = await this.getTaskTemplate(companyId, assignment.templateId)
        if (template) {
          const task = await this.createTaskFromTemplate(
            companyId,
            template,
            assignment,
            userId,
            positionId,
            triggerType
          )
          generatedTasks.push(task)
        }
      }
    }
    
    return generatedTasks
  }
  
  /**
   * Create a task from a template
   */
  private static async createTaskFromTemplate(
    companyId: string,
    template: TaskTemplate,
    assignment: PositionTaskTemplate,
    userId: string,
    positionId: string,
    triggerType: string
  ): Promise<GeneratedTask> {
    const taskRef = collection(db, 'companies', companyId, 'generatedTasks')
    const now = new Date().toISOString()
    
    // Calculate due date
    const dueDateOffset = assignment.customDueDateOffset || template.dueDateOffset
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + dueDateOffset)
    
    const task: GeneratedTask = {
      id: '',
      templateId: template.id,
      positionId,
      assignedUserId: userId,
      title: template.name,
      description: template.description,
      category: template.category,
      priority: assignment.customPriority || template.priority,
      estimatedHours: template.estimatedHours,
      dueDate: dueDate.toISOString(),
      assignmentType: 'template_generated',
      assignmentReason: `Generated from template: ${template.name}`,
      assignedBy: 'system', // TODO: Get actual user ID
      status: 'assigned',
      progress: 0,
      definitionOfDone: template.definitionOfDone.map(dod => ({
        doDItemId: dod.id,
        text: dod.text,
        isRequired: dod.isRequired,
        isCompleted: false,
        order: dod.order,
      })),
      createdAt: now,
      updatedAt: now,
    }
    
    const docRef = await addDoc(taskRef, task)
    task.id = docRef.id
    
    // Update template usage count
    await this.updateTaskTemplate(companyId, template.id, {
      usageCount: template.usageCount + 1,
      lastUsedAt: now,
    })
    
    // Update assignment count
    const assignmentRef = doc(db, 'companies', companyId, 'positionTaskTemplates', assignment.id)
    await updateDoc(assignmentRef, {
      assignmentCount: assignment.assignmentCount + 1,
      lastAssignedAt: now,
      updatedAt: now,
    })
    
    return task
  }
  
  /**
   * Check if a task should be generated based on assignment rules
   */
  private static async shouldGenerateTask(
    assignment: PositionTaskTemplate,
    triggerType: string
  ): Promise<boolean> {
    switch (assignment.assignmentMode) {
      case 'immediate':
        return triggerType === 'assignment'
      case 'on_assignment':
        return triggerType === 'assignment'
      case 'scheduled':
        return triggerType === 'scheduled' && !!assignment.assignmentDate
      case 'conditional':
        // TODO: Implement conditional logic based on assignmentConditions
        return true
      default:
        return false
    }
  }
  
  // ============================================================================
  // USER TASK OPERATIONS
  // ============================================================================
  
  /**
   * Get all tasks for a user
   */
  static async getUserTasks(
    companyId: string,
    userId: string,
    filters?: {
      status?: string
      priority?: string
      category?: string
    }
  ): Promise<GeneratedTask[]> {
    let q = query(
      collection(db, 'companies', companyId, 'generatedTasks'),
      where('assignedUserId', '==', userId)
    )
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status))
    }
    if (filters?.priority) {
      q = query(q, where('priority', '==', filters.priority))
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category))
    }
    
    q = query(q, orderBy('dueDate'))
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedTask))
  }
  
  /**
   * Update task status
   */
  static async updateTaskStatus(
    companyId: string,
    taskId: string,
    status: GeneratedTask['status'],
    updates?: Partial<GeneratedTask>
  ): Promise<void> {
    const taskRef = doc(db, 'companies', companyId, 'generatedTasks', taskId)
    const now = new Date().toISOString()
    
    const updateData: Partial<GeneratedTask> = {
      status,
      updatedAt: now,
      ...updates,
    }
    
    // Set completion timestamp if task is completed
    if (status === 'completed' && !updates?.completedAt) {
      updateData.completedAt = now
    }
    
    // Set start timestamp if task is started
    if (status === 'in_progress' && !updates?.startedAt) {
      updateData.startedAt = now
    }
    
    await updateDoc(taskRef, updateData)
  }
  
  /**
   * Update task progress
   */
  static async updateTaskProgress(
    companyId: string,
    taskId: string,
    progress: number,
    notes?: string
  ): Promise<void> {
    const taskRef = doc(db, 'companies', companyId, 'generatedTasks', taskId)
    await updateDoc(taskRef, {
      progress,
      completionNotes: notes,
      updatedAt: new Date().toISOString(),
    })
  }
  
  // ============================================================================
  // STATISTICS AND ANALYTICS
  // ============================================================================
  
  /**
   * Get task library statistics
   */
  static async getTaskLibraryStats(companyId: string): Promise<TaskLibraryStats> {
    const templates = await this.getTaskTemplates(companyId)
    const activeTemplates = templates.filter(t => t.isActive)
    const systemTemplates = templates.filter(t => t.isSystemTemplate)
    const userTemplates = templates.filter(t => !t.isSystemTemplate)
    
    // Get task statistics
    const tasksQuery = query(collection(db, 'companies', companyId, 'generatedTasks'))
    const tasksSnapshot = await getDocs(tasksQuery)
    const allTasks = tasksSnapshot.docs.map(doc => doc.data())
    
    const completedTasks = allTasks.filter(t => t.status === 'completed').length
    const overdueTasks = allTasks.filter(t => {
      const dueDate = new Date(t.dueDate)
      const now = new Date()
      return dueDate < now && t.status !== 'completed'
    }).length
    
    const totalAssignments = allTasks.length
    
    // Calculate average completion time
    const completedTasksWithTime = allTasks.filter(t => 
      t.status === 'completed' && t.startedAt && t.completedAt
    )
    const averageCompletionTime = completedTasksWithTime.length > 0
      ? completedTasksWithTime.reduce((sum, task) => {
          const start = new Date(task.startedAt)
          const end = new Date(task.completedAt)
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60) // hours
        }, 0) / completedTasksWithTime.length
      : 0
    
    // Get most used templates
    const templateUsage = templates.map(template => ({
      templateId: template.id,
      templateName: template.name,
      usageCount: template.usageCount,
    })).sort((a, b) => b.usageCount - a.usageCount).slice(0, 5)
    
    return {
      totalTemplates: templates.length,
      activeTemplates: activeTemplates.length,
      systemTemplates: systemTemplates.length,
      userTemplates: userTemplates.length,
      totalAssignments,
      completedTasks,
      overdueTasks,
      averageCompletionTime,
      mostUsedTemplates: templateUsage,
    }
  }
}
