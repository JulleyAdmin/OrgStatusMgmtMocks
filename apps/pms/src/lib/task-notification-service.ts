// Task Notification and Assignment System
// Handles real-time notifications for task assignments and updates

import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  addDoc,
  updateDoc,
  onSnapshot,
  orderBy,
  limit,
  getDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { TaskTemplateService } from './task-template-service'
import { PositionTaskAssignmentService } from './position-task-assignment-service'
import type { GeneratedTask } from '@/types/task-template-schema'

export interface TaskNotification {
  id: string
  companyId: string
  userId: string
  type: 'task_assigned' | 'task_due_soon' | 'task_overdue' | 'task_completed' | 'task_updated' | 'approval_required' | 'approval_approved' | 'approval_rejected'
  title: string
  message: string
  taskId?: string
  templateId?: string
  positionId?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRead: boolean
  actionRequired: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: string
  expiresAt?: string
}

export interface NotificationPreferences {
  id: string
  companyId: string
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  taskAssigned: boolean
  taskDueSoon: boolean
  taskOverdue: boolean
  taskCompleted: boolean
  approvalRequired: boolean
  dueSoonHours: number // Hours before due date to notify
  digestFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
  quietHours: {
    enabled: boolean
    startTime: string // HH:MM format
    endTime: string // HH:MM format
    timezone: string
  }
  createdAt: string
  updatedAt: string
}

export class TaskNotificationService {
  
  // ============================================================================
  // NOTIFICATION CREATION
  // ============================================================================
  
  /**
   * Create a task notification
   */
  static async createNotification(
    companyId: string,
    userId: string,
    notification: Omit<TaskNotification, 'id' | 'createdAt'>
  ): Promise<string> {
    const notificationRef = collection(db, 'companies', companyId, 'notifications')
    const now = new Date().toISOString()
    
    const notificationDataToSave = {
      ...notification,
      createdAt: now,
    }
    
    const docRef = await addDoc(notificationRef, notificationDataToSave)
    return docRef.id
  }
  
  /**
   * Notify user of new task assignment
   */
  static async notifyTaskAssigned(
    companyId: string,
    userId: string,
    task: GeneratedTask
  ): Promise<void> {
    console.log(`Notifying user ${userId} of new task assignment: ${task.title}`)
    
    try {
      const template = await TaskTemplateService.getTaskTemplate(companyId, task.templateId)
      const templateName = template?.name || 'Unknown Template'
      
      await this.createNotification(companyId, userId, {
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned a new task: "${task.title}" from template "${templateName}"`,
        userId,
        companyId,
        taskId: task.id,
        templateId: task.templateId,
        positionId: task.positionId,
        priority: task.priority,
        isRead: false,
        actionRequired: true,
        actionUrl: `/my-tasks?task=${task.id}`,
        metadata: {
          dueDate: task.dueDate,
          estimatedHours: task.estimatedHours,
          category: task.category,
        },
      })
      
      // Send email notification if enabled
      await this.sendEmailNotification(companyId, userId, 'task_assigned', {
        taskTitle: task.title,
        templateName,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours,
      })
      
    } catch (error) {
      console.error('Error creating task assignment notification:', error)
    }
  }
  
  /**
   * Notify user of upcoming task due date
   */
  static async notifyTaskDueSoon(
    companyId: string,
    userId: string,
    task: GeneratedTask,
    hoursUntilDue: number
  ): Promise<void> {
    console.log(`Notifying user ${userId} that task ${task.title} is due in ${hoursUntilDue} hours`)
    
    try {
      await this.createNotification(companyId, userId, {
        type: 'task_due_soon',
        title: 'Task Due Soon',
        message: `Task "${task.title}" is due in ${hoursUntilDue} hours`,
        userId,
        companyId,
        taskId: task.id,
        templateId: task.templateId,
        positionId: task.positionId,
        priority: hoursUntilDue <= 2 ? 'urgent' : 'high',
        isRead: false,
        actionRequired: true,
        actionUrl: `/my-tasks?task=${task.id}`,
        metadata: {
          hoursUntilDue,
          dueDate: task.dueDate,
        },
      })
      
    } catch (error) {
      console.error('Error creating task due soon notification:', error)
    }
  }
  
  /**
   * Notify user of overdue task
   */
  static async notifyTaskOverdue(
    companyId: string,
    userId: string,
    task: GeneratedTask,
    daysOverdue: number
  ): Promise<void> {
    console.log(`Notifying user ${userId} that task ${task.title} is ${daysOverdue} days overdue`)
    
    try {
      await this.createNotification(companyId, userId, {
        type: 'task_overdue',
        title: 'Task Overdue',
        message: `Task "${task.title}" is ${daysOverdue} days overdue`,
        userId,
        companyId,
        taskId: task.id,
        templateId: task.templateId,
        positionId: task.positionId,
        priority: 'urgent',
        isRead: false,
        actionRequired: true,
        actionUrl: `/my-tasks?task=${task.id}`,
        metadata: {
          daysOverdue,
          dueDate: task.dueDate,
        },
      })
      
      // Send email notification for overdue tasks
      await this.sendEmailNotification(companyId, userId, 'task_overdue', {
        taskTitle: task.title,
        daysOverdue,
        dueDate: task.dueDate,
      })
      
    } catch (error) {
      console.error('Error creating task overdue notification:', error)
    }
  }
  
  /**
   * Notify user of task completion
   */
  static async notifyTaskCompleted(
    companyId: string,
    userId: string,
    task: GeneratedTask
  ): Promise<void> {
    console.log(`Notifying user ${userId} that task ${task.title} has been completed`)
    
    try {
      await this.createNotification(companyId, userId, {
        type: 'task_completed',
        title: 'Task Completed',
        message: `Task "${task.title}" has been marked as completed`,
        userId,
        companyId,
        taskId: task.id,
        templateId: task.templateId,
        positionId: task.positionId,
        priority: 'low',
        isRead: false,
        actionRequired: false,
        actionUrl: `/my-tasks?task=${task.id}`,
        metadata: {
          completedAt: task.completedAt,
          actualHours: task.actualHours,
        },
      })
      
    } catch (error) {
      console.error('Error creating task completion notification:', error)
    }
  }
  
  /**
   * Notify user of approval requirement
   */
  static async notifyApprovalRequired(
    companyId: string,
    userId: string,
    task: GeneratedTask,
    approverId: string
  ): Promise<void> {
    console.log(`Notifying approver ${approverId} that task ${task.title} requires approval`)
    
    try {
      await this.createNotification(companyId, approverId, {
        type: 'approval_required',
        title: 'Approval Required',
        message: `Task "${task.title}" requires your approval`,
        userId: approverId,
        companyId,
        taskId: task.id,
        templateId: task.templateId,
        positionId: task.positionId,
        priority: 'high',
        isRead: false,
        actionRequired: true,
        actionUrl: `/my-tasks?task=${task.id}&action=approve`,
        metadata: {
          requestedBy: userId,
          taskTitle: task.title,
        },
      })
      
    } catch (error) {
      console.error('Error creating approval required notification:', error)
    }
  }
  
  // ============================================================================
  // NOTIFICATION MANAGEMENT
  // ============================================================================
  
  /**
   * Get notifications for a user
   */
  static async getUserNotifications(
    companyId: string,
    userId: string,
    filters?: {
      isRead?: boolean
      type?: string
      limit?: number
    }
  ): Promise<TaskNotification[]> {
    let q = query(
      collection(db, 'companies', companyId, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    if (filters?.isRead !== undefined) {
      q = query(q, where('isRead', '==', filters.isRead))
    }
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type))
    }
    if (filters?.limit) {
      q = query(q, limit(filters.limit))
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaskNotification))
  }
  
  /**
   * Mark notification as read
   */
  static async markNotificationAsRead(
    companyId: string,
    notificationId: string
  ): Promise<void> {
    const notificationRef = doc(db, 'companies', companyId, 'notifications', notificationId)
    await updateDoc(notificationRef, {
      isRead: true,
      updatedAt: new Date().toISOString(),
    })
  }
  
  /**
   * Mark all notifications as read for a user
   */
  static async markAllNotificationsAsRead(
    companyId: string,
    userId: string
  ): Promise<void> {
    const notifications = await this.getUserNotifications(companyId, userId, { isRead: false })
    
    const updatePromises = notifications.map(notification =>
      this.markNotificationAsRead(companyId, notification.id)
    )
    
    await Promise.all(updatePromises)
  }
  
  /**
   * Get unread notification count for a user
   */
  static async getUnreadNotificationCount(
    companyId: string,
    userId: string
  ): Promise<number> {
    const unreadNotifications = await this.getUserNotifications(companyId, userId, { 
      isRead: false 
    })
    return unreadNotifications.length
  }
  
  // ============================================================================
  // NOTIFICATION PREFERENCES
  // ============================================================================
  
  /**
   * Get user notification preferences
   */
  static async getNotificationPreferences(
    companyId: string,
    userId: string
  ): Promise<NotificationPreferences | null> {
    const preferencesRef = doc(db, 'companies', companyId, 'notificationPreferences', userId)
    const preferencesSnap = await getDoc(preferencesRef)
    
    if (!preferencesSnap.exists()) {
      return null
    }
    
    return { id: preferencesSnap.id, ...preferencesSnap.data() } as NotificationPreferences
  }
  
  /**
   * Update user notification preferences
   */
  static async updateNotificationPreferences(
    companyId: string,
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    const preferencesRef = doc(db, 'companies', companyId, 'notificationPreferences', userId)
    await updateDoc(preferencesRef, {
      ...preferences,
      updatedAt: new Date().toISOString(),
    })
  }
  
  /**
   * Create default notification preferences for a user
   */
  static async createDefaultNotificationPreferences(
    companyId: string,
    userId: string
  ): Promise<void> {
    const preferencesRef = collection(db, 'companies', companyId, 'notificationPreferences')
    const now = new Date().toISOString()
    
    const defaultPreferences = {
      companyId,
      userId,
      emailNotifications: true,
      pushNotifications: true,
      taskAssigned: true,
      taskDueSoon: true,
      taskOverdue: true,
      taskCompleted: false,
      approvalRequired: true,
      dueSoonHours: 24,
      digestFrequency: 'daily',
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00',
        timezone: 'UTC',
      },
      createdAt: now,
      updatedAt: now,
    }
    
    await addDoc(preferencesRef, defaultPreferences)
  }
  
  // ============================================================================
  // AUTOMATED NOTIFICATION TRIGGERS
  // ============================================================================
  
  /**
   * Set up automated notification monitoring
   * This should be called when the app starts
   */
  static setupNotificationMonitoring(companyId: string): () => void {
    console.log('Setting up notification monitoring')
    
    // Monitor task assignments
    const tasksQuery = query(
      collection(db, 'companies', companyId, 'generatedTasks'),
      where('status', '==', 'assigned')
    )
    
    const unsubscribeTasks = onSnapshot(tasksQuery, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const task = change.doc.data() as GeneratedTask
          await this.notifyTaskAssigned(companyId, task.assignedUserId, task)
        }
      })
    })
    
    // Monitor task status changes
    const statusQuery = query(
      collection(db, 'companies', companyId, 'generatedTasks'),
      where('status', 'in', ['in_progress', 'completed'])
    )
    
    const unsubscribeStatus = onSnapshot(statusQuery, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'modified') {
          const task = change.doc.data() as GeneratedTask
          const previousTask = change.doc.metadata.fromCache ? null : change.doc.data()
          
          if (previousTask && previousTask.status !== task.status) {
            if (task.status === 'completed') {
              await this.notifyTaskCompleted(companyId, task.assignedUserId, task)
            }
          }
        }
      })
    })
    
    // Return cleanup function
    return () => {
      unsubscribeTasks()
      unsubscribeStatus()
    }
  }
  
  /**
   * Check for overdue tasks and send notifications
   * This should be called periodically (e.g., every hour)
   */
  static async checkOverdueTasks(companyId: string): Promise<void> {
    console.log('Checking for overdue tasks')
    
    try {
      const now = new Date()
      const tasksQuery = query(
        collection(db, 'companies', companyId, 'generatedTasks'),
        where('status', 'in', ['assigned', 'in_progress'])
      )
      
      const tasksSnapshot = await getDocs(tasksQuery)
      
      for (const taskDoc of tasksSnapshot.docs) {
        const task = taskDoc.data() as GeneratedTask
        const dueDate = new Date(task.dueDate)
        const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysOverdue > 0) {
          await this.notifyTaskOverdue(companyId, task.assignedUserId, task, daysOverdue)
        } else if (daysOverdue === 0) {
          // Task is due today, check if it's due soon
          const hoursUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60))
          if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
            await this.notifyTaskDueSoon(companyId, task.assignedUserId, task, hoursUntilDue)
          }
        }
      }
      
    } catch (error) {
      console.error('Error checking overdue tasks:', error)
    }
  }
  
  // ============================================================================
  // EMAIL NOTIFICATIONS
  // ============================================================================
  
  /**
   * Send email notification (placeholder for email service integration)
   */
  private static async sendEmailNotification(
    companyId: string,
    userId: string,
    type: string,
    data: Record<string, any>
  ): Promise<void> {
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`Sending email notification to user ${userId} for ${type}:`, data)
  }
}
