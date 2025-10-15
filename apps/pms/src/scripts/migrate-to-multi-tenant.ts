// Multi-Tenant Migration Script
// This script migrates all existing data from root level to companies/{companyId} structure

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, writeBatch, Timestamp } from "firebase/firestore";
import { CompanyService } from '../lib/company-services';
import { Company, CompanySettings, CompanySubscription, CompanyBranding, CompanyLimits, CompanyFeatures } from '../types/company-schema';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATFR7e2t1aaP7OJlMODFn7vnya1e8tQdc",
  authDomain: "julley-platform-dev.firebaseapp.com",
  projectId: "julley-platform-dev",
  storageBucket: "julley-platform-dev.firebasestorage.app",
  messagingSenderId: "46276910499",
  appId: "1:46276910499:web:433453e451cd33aea84e16",
  measurementId: "G-NCSHHHZ9QF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collections to migrate
const COLLECTIONS_TO_MIGRATE = [
  'users',
  'projects',
  'projectPhases',
  'projectDeliverables',
  'projectResources',
  'projectRisks',
  'projectMilestones',
  'projectFiles',
  'projectComments',
  'projectTemplates',
  'projectBudgets',
  'projectTimeTracking',
  'tasks',
  'activities',
  'org_chart'
];

// Create Autocracy company
async function createAutocracyCompany(): Promise<string> {
  console.log('🏢 Creating Autocracy company...');
  
  const companySettings: CompanySettings = {
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    language: 'en',
    defaultProjectStatus: 'planning',
    defaultProjectPriority: 'medium',
    autoAssignProjects: false,
    allowSelfRegistration: false,
    requireEmailVerification: true,
    defaultUserRole: 'employee',
    emailNotifications: true,
    slackIntegration: false,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    },
    dataRetentionDays: 2555, // 7 years
    autoArchiveCompletedProjects: true,
    archiveAfterDays: 90
  };

  const companySubscription: CompanySubscription = {
    plan: 'enterprise',
    status: 'active',
    billingCycle: 'yearly',
    maxUsers: 1000,
    maxProjects: 10000,
    maxStorageGB: 1000,
    pricePerMonth: 999,
    pricePerYear: 9999,
    trialDays: 30,
    trialUsed: false
  };

  const companyBranding: CompanyBranding = {
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    emailSignature: 'Autocracy Manufacturing & Technology'
  };

  const companyLimits: CompanyLimits = {
    maxUsers: 1000,
    maxProjects: 10000,
    maxTasksPerProject: 1000,
    maxFileSizeMB: 100,
    maxStorageGB: 1000,
    maxApiCallsPerMonth: 1000000,
    currentUsers: 0,
    currentProjects: 0,
    currentStorageGB: 0,
    currentApiCalls: 0
  };

  const companyFeatures: CompanyFeatures = {
    projectManagement: true,
    taskManagement: true,
    timeTracking: true,
    fileManagement: true,
    advancedReporting: true,
    customFields: true,
    workflowAutomation: true,
    apiAccess: true,
    slackIntegration: true,
    googleWorkspace: true,
    microsoft365: true,
    webhookSupport: true,
    sso: true,
    twoFactorAuth: true,
    auditLogs: true,
    dataEncryption: true
  };

  const autocracyCompany: Omit<Company, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Autocracy Manufacturing & Technology',
    domain: 'autocracy.com',
    description: 'Leading manufacturer of industrial automation and robotics solutions',
    settings: companySettings,
    subscription: companySubscription,
    branding: companyBranding,
    status: 'active',
    plan: 'enterprise',
    createdBy: 'system',
    adminUsers: [],
    limits: companyLimits,
    features: companyFeatures
  };

  const companyId = await CompanyService.createCompany(autocracyCompany);
  console.log(`✅ Created Autocracy company with ID: ${companyId}`);
  
  return companyId;
}

// Migrate collection data
async function migrateCollection(companyId: string, collectionName: string): Promise<number> {
  console.log(`📦 Migrating ${collectionName}...`);
  
  try {
    // Get all documents from root collection
    const sourceCollection = collection(db, collectionName);
    const snapshot = await getDocs(sourceCollection);
    
    if (snapshot.empty) {
      console.log(`   ℹ️  No documents found in ${collectionName}`);
      return 0;
    }

    console.log(`   📄 Found ${snapshot.docs.length} documents in ${collectionName}`);

    // Use batch writes for better performance
    const batch = writeBatch(db);
    let batchCount = 0;
    const BATCH_SIZE = 500; // Firestore batch limit

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // Add companyId to the document data
      const migratedData = {
        ...data,
        companyId: companyId,
        migratedAt: Timestamp.now()
      };

      // Add to new company-scoped collection
      const newDocRef = doc(db, `companies/${companyId}/${collectionName}`, docSnapshot.id);
      batch.set(newDocRef, migratedData);
      
      batchCount++;
      
      // Commit batch when it reaches the limit
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        console.log(`   ✅ Migrated ${batchCount} documents to companies/${companyId}/${collectionName}`);
        batchCount = 0;
      }
    }

    // Commit remaining documents
    if (batchCount > 0) {
      await batch.commit();
      console.log(`   ✅ Migrated ${batchCount} documents to companies/${companyId}/${collectionName}`);
    }

    console.log(`✅ Successfully migrated ${collectionName} (${snapshot.docs.length} documents)`);
    return snapshot.docs.length;

  } catch (error) {
    console.error(`❌ Error migrating ${collectionName}:`, error);
    throw error;
  }
}

// Delete original collection (optional - for cleanup)
async function deleteOriginalCollection(collectionName: string): Promise<void> {
  console.log(`🗑️  Deleting original ${collectionName} collection...`);
  
  try {
    const sourceCollection = collection(db, collectionName);
    const snapshot = await getDocs(sourceCollection);
    
    if (snapshot.empty) {
      console.log(`   ℹ️  No documents to delete in ${collectionName}`);
      return;
    }

    // Use batch deletes
    const batch = writeBatch(db);
    let batchCount = 0;
    const BATCH_SIZE = 500;

    for (const docSnapshot of snapshot.docs) {
      batch.delete(docSnapshot.ref);
      batchCount++;
      
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        console.log(`   🗑️  Deleted ${batchCount} documents from ${collectionName}`);
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
      console.log(`   🗑️  Deleted ${batchCount} documents from ${collectionName}`);
    }

    console.log(`✅ Successfully deleted original ${collectionName} collection`);
  } catch (error) {
    console.error(`❌ Error deleting ${collectionName}:`, error);
    throw error;
  }
}

// Main migration function
async function migrateToMultiTenant() {
  console.log('🚀 Starting Multi-Tenant Migration...');
  console.log(`📋 Project: ${firebaseConfig.projectId}`);
  console.log(`🌐 Domain: ${firebaseConfig.authDomain}`);
  
  try {
    // Step 1: Create Autocracy company
    const companyId = await createAutocracyCompany();
    
    // Step 2: Migrate all collections
    let totalMigrated = 0;
    const migrationResults: { [key: string]: number } = {};
    
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      const count = await migrateCollection(companyId, collectionName);
      migrationResults[collectionName] = count;
      totalMigrated += count;
    }
    
    // Step 3: Summary
    console.log('\n📊 Migration Summary:');
    console.log(`   🏢 Company ID: ${companyId}`);
    console.log(`   📦 Collections migrated: ${COLLECTIONS_TO_MIGRATE.length}`);
    console.log(`   📄 Total documents migrated: ${totalMigrated}`);
    
    console.log('\n📋 Collection Details:');
    Object.entries(migrationResults).forEach(([collection, count]) => {
      console.log(`   ${collection}: ${count} documents`);
    });
    
    // Step 4: Optional cleanup (uncomment to delete original collections)
    // console.log('\n🧹 Cleaning up original collections...');
    // for (const collectionName of COLLECTIONS_TO_MIGRATE) {
    //   await deleteOriginalCollection(collectionName);
    // }
    
    console.log('\n✅ Multi-Tenant Migration Completed Successfully!');
    console.log('\n🔐 Next Steps:');
    console.log('   1. Update all components to use company-scoped services');
    console.log('   2. Add CompanyProvider to your app');
    console.log('   3. Update all service calls to include companyId');
    console.log('   4. Test the multi-tenant functionality');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateToMultiTenant();
