import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { PositionTaskAssignmentService } from './services/position-task-assignment-service'

admin.initializeApp()

// ============================================================================
// FIRESTORE TRIGGERS FOR AUTOMATIC TASK GENERATION
// ============================================================================

/**
 * Trigger: When a user is assigned to a position
 * Automatically generates tasks based on position templates
 */
export const onPositionAssignmentCreated = functions.firestore
  .document('companies/{companyId}/positionAssignments/{assignmentId}')
  .onCreate(async (snap, context) => {
    const assignment = snap.data()
    const { companyId } = context.params
    
    console.log(`Position assignment created: ${assignment.userId} -> ${assignment.positionId}`)
    
    try {
      // Generate tasks for the newly assigned user
      const generatedTasks = await PositionTaskAssignmentService.generateTasksOnPositionAssignment(
        companyId,
        assignment.positionId,
        assignment.userId,
        assignment.assignmentType || 'permanent'
      )
      
      console.log(`Generated ${generatedTasks.length} tasks for position assignment`)
      
      // Optional: Send notification to user
      if (generatedTasks.length > 0) {
        await sendTaskNotification(companyId, assignment.userId, generatedTasks)
      }
      
    } catch (error) {
      console.error('Error generating tasks on position assignment:', error)
      // Don't throw - we don't want to fail the assignment creation
    }
  })

/**
 * Trigger: When a task template is assigned to a position
 * Generates tasks for all current users in that position
 */
export const onPositionTaskTemplateCreated = functions.firestore
  .document('companies/{companyId}/positionTaskTemplates/{templateId}')
  .onCreate(async (snap, context) => {
    const templateAssignment = snap.data()
    const { companyId } = context.params
    
    console.log(`Task template assigned to position: ${templateAssignment.templateId} -> ${templateAssignment.positionId}`)
    
    try {
      // Generate tasks for all current users in this position
      const generatedTasks = await PositionTaskAssignmentService.generateTasksForAllPositionUsers(
        companyId,
        templateAssignment.positionId
      )
      
      console.log(`Generated ${generatedTasks.length} tasks for all position users`)
      
    } catch (error) {
      console.error('Error generating tasks for position users:', error)
    }
  })

/**
 * Trigger: When a user logs in (using Firebase Auth trigger)
 * Generates tasks for immediate assignment mode templates
 */
export const onUserLogin = functions.auth.user().onCreate(async (user) => {
  console.log(`User logged in: ${user.uid}`)
  
  try {
    // Find which company this user belongs to
    const companiesSnapshot = await admin.firestore()
      .collection('companies')
      .get()
    
    for (const companyDoc of companiesSnapshot.docs) {
      const userDoc = await admin.firestore()
        .doc(`companies/${companyDoc.id}/users/${user.uid}`)
        .get()
      
      if (userDoc.exists) {
        // Generate tasks for this user
        const generatedTasks = await PositionTaskAssignmentService.generateTasksOnUserLogin(
          companyDoc.id,
          user.uid
        )
        
        console.log(`Generated ${generatedTasks.length} tasks for user login`)
        
        if (generatedTasks.length > 0) {
          await sendTaskNotification(companyDoc.id, user.uid, generatedTasks)
        }
        break
      }
    }
    
  } catch (error) {
    console.error('Error generating tasks on user login:', error)
  }
})

// ============================================================================
// SCHEDULED FUNCTIONS FOR RECURRING TASKS
// ============================================================================

/**
 * Scheduled function: Generate tasks for scheduled assignments
 * Runs every hour to check for scheduled task generation
 */
export const generateScheduledTasks = functions.pubsub
  .schedule('0 * * * *') // Every hour
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Running scheduled task generation...')
    
    try {
      const companiesSnapshot = await admin.firestore()
        .collection('companies')
        .get()
      
      for (const companyDoc of companiesSnapshot.docs) {
        const companyId = companyDoc.id
        
        // Get all scheduled position task templates
        const scheduledTemplatesSnapshot = await admin.firestore()
          .collection(`companies/${companyId}/positionTaskTemplates`)
          .where('assignmentMode', '==', 'scheduled')
          .where('assignmentDate', '<=', new Date().toISOString())
          .get()
        
        for (const templateDoc of scheduledTemplatesSnapshot.docs) {
          const template = templateDoc.data()
          
          // Generate tasks for all users in this position
          await PositionTaskAssignmentService.generateTasksForAllPositionUsers(
            companyId,
            template.positionId
          )
          
          console.log(`Generated scheduled tasks for position ${template.positionId}`)
        }
      }
      
    } catch (error) {
      console.error('Error in scheduled task generation:', error)
    }
  })

// ============================================================================
// HTTP FUNCTIONS FOR MANUAL TRIGGERS
// ============================================================================

/**
 * HTTP function: Manually generate tasks for a user
 * POST /generateTasksForUser
 */
export const generateTasksForUser = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }
  
  const { companyId, userId } = req.body
  
  if (!companyId || !userId) {
    res.status(400).send('Missing companyId or userId')
    return
  }
  
  try {
    const generatedTasks = await PositionTaskAssignmentService.generateTasksOnUserLogin(
      companyId,
      userId
    )
    
    res.json({
      success: true,
      generatedTasks: generatedTasks.length,
      tasks: generatedTasks
    })
    
  } catch (error) {
    console.error('Error generating tasks for user:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * HTTP function: Generate tasks for all users in a position
 * POST /generateTasksForPosition
 */
export const generateTasksForPosition = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }
  
  const { companyId, positionId } = req.body
  
  if (!companyId || !positionId) {
    res.status(400).send('Missing companyId or positionId')
    return
  }
  
  try {
    const generatedTasks = await PositionTaskAssignmentService.generateTasksForAllPositionUsers(
      companyId,
      positionId
    )
    
    res.json({
      success: true,
      generatedTasks: generatedTasks.length,
      tasks: generatedTasks
    })
    
  } catch (error) {
    console.error('Error generating tasks for position:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Send notification to user about new tasks
 */
async function sendTaskNotification(
  companyId: string,
  userId: string,
  tasks: any[]
): Promise<void> {
  try {
    // Get user's notification preferences
    const userDoc = await admin.firestore()
      .doc(`companies/${companyId}/users/${userId}`)
      .get()
    
    if (!userDoc.exists) return
    
    const userData = userDoc.data()
    
    // Create notification document
    await admin.firestore()
      .collection(`companies/${companyId}/notifications`)
      .add({
        userId,
        companyId,
        type: 'task_assigned',
        title: 'New Tasks Assigned',
        message: `You have been assigned ${tasks.length} new task${tasks.length > 1 ? 's' : ''}`,
        taskIds: tasks.map(task => task.id),
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/my-tasks'
      })
    
    console.log(`Sent notification to user ${userId} about ${tasks.length} tasks`)
    
  } catch (error) {
    console.error('Error sending task notification:', error)
  }
}
