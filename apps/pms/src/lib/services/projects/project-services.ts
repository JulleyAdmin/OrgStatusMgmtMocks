// Firebase Project Module Service
// Comprehensive service for managing all Project module collections

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
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
  EnhancedProject,
  ProjectPhase,
  ProjectDeliverable,
  ProjectResource,
  ProjectRisk,
  ProjectMilestone,
  ProjectFile,
  ProjectComment,
  ProjectTemplate,
  ProjectBudget,
  ProjectTimeTracking
} from '../../../types/project-schema';

// Helper to convert Firestore timestamps to ISO strings
const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate().toISOString();
    } else if (typeof converted[key] === 'object' && converted[key] !== null) {
      converted[key] = convertTimestamps(converted[key]);
    }
  });
  
  return converted;
};

// Project Service
export class ProjectService {
  // Get all projects for a company
  static async getProjects(companyId: string, filters?: {
    status?: string;
    manager?: string;
    equipmentType?: string;
    manufacturingPhase?: string;
  }): Promise<EnhancedProject[]> {
    try {
      let q = query(collection(db, `companies/${companyId}/projects`));
      
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.manager) {
        q = query(q, where('manager', '==', filters.manager));
      }
      if (filters?.equipmentType) {
        q = query(q, where('equipmentType', '==', filters.equipmentType));
      }
      if (filters?.manufacturingPhase) {
        q = query(q, where('manufacturingPhase', '==', filters.manufacturingPhase));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as EnhancedProject));
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  // Get project by ID for a company
  static async getProject(companyId: string, projectId: string): Promise<EnhancedProject | null> {
    try {
      const docRef = doc(db, `companies/${companyId}/projects`, projectId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...convertTimestamps(docSnap.data())
        } as EnhancedProject;
      }
      return null;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }

  // Create new project for a company
  static async createProject(companyId: string, project: Omit<EnhancedProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, `companies/${companyId}/projects`), {
        ...project,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update project for a company
  static async updateProject(companyId: string, projectId: string, updates: Partial<EnhancedProject>): Promise<void> {
    try {
      const docRef = doc(db, `companies/${companyId}/projects`, projectId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Delete project for a company
  static async deleteProject(companyId: string, projectId: string): Promise<void> {
    try {
      const docRef = doc(db, `companies/${companyId}/projects`, projectId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}

// Project Phase Service
export class ProjectPhaseService {
  static async getProjectPhases(companyId: string, projectId: string): Promise<ProjectPhase[]> {
    try {
      const q = query(
        collection(db, `companies/${companyId}/projectPhases`),
        where('projectId', '==', projectId),
        orderBy('startDate', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as ProjectPhase));
    } catch (error) {
      console.error('Error getting project phases:', error);
      throw error;
    }
  }

  static async createPhase(companyId: string, phase: Omit<ProjectPhase, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, `companies/${companyId}/projectPhases`), {
        ...phase,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating phase:', error);
      throw error;
    }
  }

  static async updatePhase(companyId: string, phaseId: string, updates: Partial<ProjectPhase>): Promise<void> {
    try {
      const docRef = doc(db, `companies/${companyId}/projectPhases`, phaseId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating phase:', error);
      throw error;
    }
  }
}

// Project Deliverable Service
export class ProjectDeliverableService {
  static async getPhaseDeliverables(phaseId: string): Promise<ProjectDeliverable[]> {
    try {
      const q = query(
        collection(db, 'projectDeliverables'),
        where('phaseId', '==', phaseId),
        orderBy('dueDate', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as ProjectDeliverable));
    } catch (error) {
      console.error('Error getting deliverables:', error);
      throw error;
    }
  }

  static async getUserDeliverables(userId: string): Promise<ProjectDeliverable[]> {
    try {
      const q = query(
        collection(db, 'projectDeliverables'),
        where('assignee', '==', userId),
        orderBy('dueDate', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as ProjectDeliverable));
    } catch (error) {
      console.error('Error getting user deliverables:', error);
      throw error;
    }
  }

  static async createDeliverable(deliverable: Omit<ProjectDeliverable, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'projectDeliverables'), {
        ...deliverable,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating deliverable:', error);
      throw error;
    }
  }

  static async updateDeliverable(deliverableId: string, updates: Partial<ProjectDeliverable>): Promise<void> {
    try {
      const docRef = doc(db, 'projectDeliverables', deliverableId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating deliverable:', error);
      throw error;
    }
  }
}

// Project Resource Service
export class ProjectResourceService {
  static async getProjectResources(projectId: string): Promise<ProjectResource[]> {
    try {
      const q = query(
        collection(db, 'projectResources'),
        where('projectId', '==', projectId),
        orderBy('type', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as ProjectResource));
    } catch (error) {
      console.error('Error getting project resources:', error);
      throw error;
    }
  }

  static async createResource(resource: Omit<ProjectResource, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'projectResources'), {
        ...resource,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  }

  static async updateResource(resourceId: string, updates: Partial<ProjectResource>): Promise<void> {
    try {
      const docRef = doc(db, 'projectResources', resourceId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  }
}

// Project Risk Service
export class ProjectRiskService {
  static async getProjectRisks(projectId: string): Promise<ProjectRisk[]> {
    try {
      const q = query(
        collection(db, 'projectRisks'),
        where('projectId', '==', projectId),
        orderBy('probability', 'desc'),
        orderBy('impact', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as ProjectRisk));
    } catch (error) {
      console.error('Error getting project risks:', error);
      throw error;
    }
  }

  static async createRisk(risk: Omit<ProjectRisk, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'projectRisks'), {
        ...risk,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating risk:', error);
      throw error;
    }
  }

  static async updateRisk(riskId: string, updates: Partial<ProjectRisk>): Promise<void> {
    try {
      const docRef = doc(db, 'projectRisks', riskId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating risk:', error);
      throw error;
    }
  }
}

// Project Milestone Service
export class ProjectMilestoneService {
  static async getProjectMilestones(projectId: string): Promise<ProjectMilestone[]> {
    try {
      const q = query(
        collection(db, 'projectMilestones'),
        where('projectId', '==', projectId),
        orderBy('targetDate', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as ProjectMilestone));
    } catch (error) {
      console.error('Error getting project milestones:', error);
      throw error;
    }
  }

  static async createMilestone(milestone: Omit<ProjectMilestone, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'projectMilestones'), {
        ...milestone,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating milestone:', error);
      throw error;
    }
  }

  static async updateMilestone(milestoneId: string, updates: Partial<ProjectMilestone>): Promise<void> {
    try {
      const docRef = doc(db, 'projectMilestones', milestoneId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  }
}

// Project Budget Service
export class ProjectBudgetService {
  static async getProjectBudgets(projectId: string): Promise<ProjectBudget[]> {
    try {
      const q = query(
        collection(db, 'projectBudgets'),
        where('projectId', '==', projectId),
        orderBy('category', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as ProjectBudget));
    } catch (error) {
      console.error('Error getting project budgets:', error);
      throw error;
    }
  }

  static async createBudget(budget: Omit<ProjectBudget, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'projectBudgets'), {
        ...budget,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  static async updateBudget(budgetId: string, updates: Partial<ProjectBudget>): Promise<void> {
    try {
      const docRef = doc(db, 'projectBudgets', budgetId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }
}

// Project Time Tracking Service
export class ProjectTimeTrackingService {
  static async getUserTimeEntries(userId: string, startDate?: string, endDate?: string): Promise<ProjectTimeTracking[]> {
    try {
      let q = query(
        collection(db, 'projectTimeTracking'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      if (startDate) {
        q = query(q, where('date', '>=', startDate));
      }
      if (endDate) {
        q = query(q, where('date', '<=', endDate));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as ProjectTimeTracking));
    } catch (error) {
      console.error('Error getting user time entries:', error);
      throw error;
    }
  }

  static async getProjectTimeEntries(projectId: string): Promise<ProjectTimeTracking[]> {
    try {
      const q = query(
        collection(db, 'projectTimeTracking'),
        where('projectId', '==', projectId),
        orderBy('date', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as ProjectTimeTracking));
    } catch (error) {
      console.error('Error getting project time entries:', error);
      throw error;
    }
  }

  static async createTimeEntry(timeEntry: Omit<ProjectTimeTracking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'projectTimeTracking'), {
        ...timeEntry,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating time entry:', error);
      throw error;
    }
  }

  static async updateTimeEntry(timeEntryId: string, updates: Partial<ProjectTimeTracking>): Promise<void> {
    try {
      const docRef = doc(db, 'projectTimeTracking', timeEntryId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating time entry:', error);
      throw error;
    }
  }
}

// Project Template Service
export class ProjectTemplateService {
  static async getTemplates(equipmentType?: string): Promise<ProjectTemplate[]> {
    try {
      let q = query(
        collection(db, 'projectTemplates'),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      
      if (equipmentType) {
        q = query(q, where('equipmentType', '==', equipmentType));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as ProjectTemplate));
    } catch (error) {
      console.error('Error getting templates:', error);
      throw error;
    }
  }

  static async createTemplate(template: Omit<ProjectTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'projectTemplates'), {
        ...template,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }
}

// Export all services
export const projectServices = {
  ProjectService,
  ProjectPhaseService,
  ProjectDeliverableService,
  ProjectResourceService,
  ProjectRiskService,
  ProjectMilestoneService,
  ProjectBudgetService,
  ProjectTimeTrackingService,
  ProjectTemplateService
};
