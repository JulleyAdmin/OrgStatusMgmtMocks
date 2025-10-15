// Company Service for Multi-Tenant Project Management System

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
  Timestamp,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Company,
  CompanyUser,
  CompanyInvitation,
  CompanyActivity,
  CompanyStats,
  CompanySettings,
  CompanySubscription,
  CompanyBranding,
  CompanyLimits,
  CompanyFeatures
} from '../types/company-schema';

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

// Company Service
export class CompanyService {
  // Get all companies (admin only)
  static async getCompanies(): Promise<Company[]> {
    try {
      const q = query(
        collection(db, 'companies'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as Company));
    } catch (error) {
      console.error('Error getting companies:', error);
      throw error;
    }
  }

  // Get company by ID
  static async getCompany(companyId: string): Promise<Company | null> {
    try {
      const docRef = doc(db, 'companies', companyId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...convertTimestamps(docSnap.data())
        } as Company;
      }
      return null;
    } catch (error) {
      console.error('Error getting company:', error);
      throw error;
    }
  }

  // Get company by domain
  static async getCompanyByDomain(domain: string): Promise<Company | null> {
    try {
      const q = query(
        collection(db, 'companies'),
        where('domain', '==', domain),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.docs.length > 0) {
        return {
          id: snapshot.docs[0].id,
          ...convertTimestamps(snapshot.docs[0].data())
        } as Company;
      }
      return null;
    } catch (error) {
      console.error('Error getting company by domain:', error);
      throw error;
    }
  }

  // Create new company
  static async createCompany(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'companies'), {
        ...company,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  // Update company
  static async updateCompany(companyId: string, updates: Partial<Company>): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  // Delete company (soft delete by setting status to inactive)
  static async deleteCompany(companyId: string): Promise<void> {
    try {
      await this.updateCompany(companyId, { status: 'inactive' });
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }

  // Update company settings
  static async updateCompanySettings(companyId: string, settings: Partial<CompanySettings>): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        'settings': settings,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating company settings:', error);
      throw error;
    }
  }

  // Update company subscription
  static async updateCompanySubscription(companyId: string, subscription: Partial<CompanySubscription>): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        'subscription': subscription,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating company subscription:', error);
      throw error;
    }
  }

  // Update company branding
  static async updateCompanyBranding(companyId: string, branding: Partial<CompanyBranding>): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        'branding': branding,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating company branding:', error);
      throw error;
    }
  }

  // Update company limits
  static async updateCompanyLimits(companyId: string, limits: Partial<CompanyLimits>): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        'limits': limits,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating company limits:', error);
      throw error;
    }
  }

  // Update company features
  static async updateCompanyFeatures(companyId: string, features: Partial<CompanyFeatures>): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        'features': features,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating company features:', error);
      throw error;
    }
  }
}

// Company User Service
export class CompanyUserService {
  // Get company users
  static async getCompanyUsers(companyId: string): Promise<CompanyUser[]> {
    try {
      const q = query(
        collection(db, `companies/${companyId}/users`),
        orderBy('joinedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as CompanyUser));
    } catch (error) {
      console.error('Error getting company users:', error);
      throw error;
    }
  }

  // Get user's companies
  static async getUserCompanies(userId: string): Promise<CompanyUser[]> {
    try {
      const q = query(
        collection(db, 'companies'),
        where('adminUsers', 'array-contains', userId)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as CompanyUser));
    } catch (error) {
      console.error('Error getting user companies:', error);
      throw error;
    }
  }

  // Add user to company
  static async addUserToCompany(companyId: string, user: Omit<CompanyUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, `companies/${companyId}/users`), {
        ...user,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding user to company:', error);
      throw error;
    }
  }

  // Update user role in company
  static async updateUserRole(companyId: string, userId: string, role: string, permissions: CompanyPermissions): Promise<void> {
    try {
      const docRef = doc(db, `companies/${companyId}/users`, userId);
      await updateDoc(docRef, {
        role,
        permissions,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Remove user from company
  static async removeUserFromCompany(companyId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, `companies/${companyId}/users`, userId);
      await updateDoc(docRef, {
        status: 'removed',
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error removing user from company:', error);
      throw error;
    }
  }
}

// Company Invitation Service
export class CompanyInvitationService {
  // Get company invitations
  static async getCompanyInvitations(companyId: string): Promise<CompanyInvitation[]> {
    try {
      const q = query(
        collection(db, `companies/${companyId}/invitations`),
        orderBy('invitedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as CompanyInvitation));
    } catch (error) {
      console.error('Error getting company invitations:', error);
      throw error;
    }
  }

  // Create invitation
  static async createInvitation(companyId: string, invitation: Omit<CompanyInvitation, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, `companies/${companyId}/invitations`), {
        ...invitation,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }
  }

  // Accept invitation
  static async acceptInvitation(companyId: string, invitationId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, `companies/${companyId}/invitations`, invitationId);
      await updateDoc(docRef, {
        status: 'accepted',
        acceptedAt: Timestamp.now(),
        acceptedBy: userId,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  // Cancel invitation
  static async cancelInvitation(companyId: string, invitationId: string): Promise<void> {
    try {
      const docRef = doc(db, `companies/${companyId}/invitations`, invitationId);
      await updateDoc(docRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      throw error;
    }
  }
}

// Company Activity Service
export class CompanyActivityService {
  // Get company activities
  static async getCompanyActivities(companyId: string, limitCount: number = 100): Promise<CompanyActivity[]> {
    try {
      const q = query(
        collection(db, `companies/${companyId}/activities`),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as CompanyActivity));
    } catch (error) {
      console.error('Error getting company activities:', error);
      throw error;
    }
  }

  // Log activity
  static async logActivity(companyId: string, activity: Omit<CompanyActivity, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, `companies/${companyId}/activities`), {
        ...activity,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }
}

// Export all services
export const companyServices = {
  CompanyService,
  CompanyUserService,
  CompanyInvitationService,
  CompanyActivityService
};
