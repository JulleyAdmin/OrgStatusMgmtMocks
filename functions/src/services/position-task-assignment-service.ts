// Position Task Assignment Service for Firebase Functions
// This is a simplified version that works in the Functions environment

import * as admin from 'firebase-admin'

export class PositionTaskAssignmentService {
  
  /**
   * Generate tasks when a user is assigned to a position
   */
  static async generateTasksOnPositionAssignment(
    companyId: string,
    positionId: string,
    userId: string,
    assignmentType: 'permanent' | 'temporary' | 'acting' = 'permanent'
  ): Promise<any[]> {
    console.log(`Generating tasks for user ${userId} assigned to position ${positionId}`)
    
    try {
      // Get all active template assignments for this position
      const positionAssignmentsSnapshot = await admin.firestore()
        .collection(`companies/${companyId}/positionTaskTemplates`)
        .where('positionId', '==', positionId)
        .where('isActive', '==', true)
        .get()
      
      const generatedTasks: any[] = []
      
      for (const assignmentDoc of positionAssignmentsSnapshot.docs) {
        const assignment = assignmentDoc.data()
        
        // Check if task should be generated based on assignment mode
        const shouldGenerate = await this.shouldGenerateTaskForAssignment(
          assignment, 
          assignmentType
        )
        
        if (shouldGenerate) {
          const templateDoc = await admin.firestore()
            .doc(`companies/${companyId}/taskTemplates/${assignment.templateId}`)
            .get()
          
          if (templateDoc.exists) {
            const template = templateDoc.data()
            const task = await this.createTaskFromTemplate(
              companyId,
              template,
              assignment,
              userId,
              positionId,
              'assignment'
            )
            generatedTasks.push(task)
          }
        }
      }
      
      console.log(`Generated ${generatedTasks.length} tasks for position assignment`)
      return generatedTasks
      
    } catch (error) {
      console.error('Error generating tasks on position assignment:', error)
      throw error
    }
  }
  
  /**
   * Generate tasks when a user logs in (for immediate assignment mode)
   */
  static async generateTasksOnUserLogin(
    companyId: string,
    userId: string
  ): Promise<any[]> {
    console.log(`Generating tasks for user login: ${userId}`)
    
    try {
      // Get current position assignment for user
      const currentAssignmentSnapshot = await admin.firestore()
        .collection(`companies/${companyId}/positionAssignments`)
        .where('userId', '==', userId)
        .where('status', '==', 'active')
        .limit(1)
        .get()
      
      if (currentAssignmentSnapshot.empty) {
        console.log(`No current position assignment found for user ${userId}`)
        return []
      }
      
      const currentAssignment = currentAssignmentSnapshot.docs[0].data()
      
      // Generate tasks for the current position
      return await this.generateTasksOnPositionAssignment(
        companyId,
        currentAssignment.positionId,
        userId,
        currentAssignment.assignmentType
      )
      
    } catch (error) {
      console.error('Error generating tasks on user login:', error)
      throw error
    }
  }
  
  /**
   * Generate tasks for all users in a position (bulk operation)
   */
  static async generateTasksForAllPositionUsers(
    companyId: string,
    positionId: string
  ): Promise<any[]> {
    console.log(`Generating tasks for all users in position ${positionId}`)
    
    try {
      // Get all current assignments for this position
      const assignmentsSnapshot = await admin.firestore()
        .collection(`companies/${companyId}/positionAssignments`)
        .where('positionId', '==', positionId)
        .where('status', '==', 'active')
        .get()
      
      const allGeneratedTasks: any[] = []
      
      for (const assignmentDoc of assignmentsSnapshot.docs) {
        const assignment = assignmentDoc.data()
        const tasks = await this.generateTasksOnPositionAssignment(
          companyId,
          positionId,
          assignment.userId,
          assignment.assignmentType
        )
        allGeneratedTasks.push(...tasks)
      }
      
      console.log(`Generated ${allGeneratedTasks.length} tasks for all users in position`)
      return allGeneratedTasks
      
    } catch (error) {
      console.error('Error generating tasks for all position users:', error)
      throw error
    }
  }
  
  /**
   * Check if a task should be generated based on assignment rules
   */
  private static async shouldGenerateTaskForAssignment(
    assignment: any,
    assignmentType: string
  ): Promise<boolean> {
    switch (assignment.assignmentMode) {
      case 'immediate':
        // Generate immediately for any assignment type
        return true
        
      case 'on_assignment':
        // Generate only for permanent assignments
        return assignmentType === 'permanent'
        
      case 'scheduled':
        // Generate only if assignment date matches
        if (!assignment.assignmentDate) return false
        const assignmentDate = new Date(assignment.assignmentDate)
        const today = new Date()
        return assignmentDate.toDateString() === today.toDateString()
        
      case 'conditional':
        // TODO: Implement conditional logic based on assignmentConditions
        // For now, generate for permanent assignments only
        return assignmentType === 'permanent'
        
      default:
        return false
    }
  }
  
  /**
   * Create a task from a template with position-specific customization
   */
  private static async createTaskFromTemplate(
    companyId: string,
    template: any,
    assignment: any,
    userId: string,
    positionId: string,
    triggerType: string
  ): Promise<any> {
    const now = new Date().toISOString()
    
    // Calculate due date with position-specific offset
    const dueDateOffset = assignment.customDueDateOffset || template.dueDateOffset
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + dueDateOffset)
    
    // Use position-specific priority if set
    const priority = assignment.customPriority || template.priority
    
    const taskDataToSave = {
      templateId: template.id,
      positionId,
      assignedUserId: userId,
      title: template.name,
      description: template.description + (assignment.customInstructions ? `\n\n${assignment.customInstructions}` : ''),
      category: template.category,
      priority,
      estimatedHours: template.estimatedHours,
      dueDate: dueDate.toISOString(),
      assignmentType: 'template_generated',
      assignmentReason: `Generated from template: ${template.name} (${triggerType})`,
      assignedBy: 'system',
      status: 'assigned',
      progress: 0,
      definitionOfDone: template.definitionOfDone.map((dod: any) => ({
        doDItemId: dod.id,
        text: dod.text,
        isRequired: dod.isRequired,
        isCompleted: false,
        order: dod.order,
      })),
      createdAt: now,
      updatedAt: now,
    }
    
    // Save to Firestore
    const docRef = await admin.firestore()
      .collection(`companies/${companyId}/generatedTasks`)
      .add(taskDataToSave)
    
    const task = {
      ...taskDataToSave,
      id: docRef.id,
    }
    
    // Update template usage count
    await admin.firestore()
      .doc(`companies/${companyId}/taskTemplates/${template.id}`)
      .update({
        usageCount: admin.firestore.FieldValue.increment(1),
        lastUsedAt: now,
      })
    
    // Update assignment count
    await admin.firestore()
      .doc(`companies/${companyId}/positionTaskTemplates/${assignment.id}`)
      .update({
        assignmentCount: admin.firestore.FieldValue.increment(1),
        lastAssignedAt: now,
        updatedAt: now,
      })
    
    console.log(`Created task ${task.id} from template ${template.name}`)
    return task
  }
}
