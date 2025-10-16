// Comprehensive Platform seeding script for companies and tenants
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp, writeBatch, doc } from "firebase/firestore";
import { Company, Subscription, User, OnboardingProgress, PlatformMetrics } from '../types';

// Your web app's Firebase configuration
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

// Helper to remove undefined values (Firestore doesn't allow undefined)
const removeUndefined = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
};

// Demo Companies Data
const demoCompanies: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Caterpillar Manufacturing',
    domain: 'caterpillar.com',
    industry: 'Heavy Equipment Manufacturing',
    size: 'enterprise',
    status: 'active',
    subscription: {
      id: 'sub-cat-001',
      companyId: 'cat-001',
      plan: 'enterprise',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      maxUsers: 1000,
      maxProjects: 500,
      features: ['advanced_analytics', 'custom_integrations', 'priority_support', 'white_label'],
      billingCycle: 'yearly',
      price: 50000,
      currency: 'USD'
    },
    settings: {
      timezone: 'America/Chicago',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true,
        weeklyReports: true,
        monthlyReports: true,
        alerts: true
      },
      integrations: {
        slack: true,
        microsoftTeams: true,
        googleWorkspace: true,
        salesforce: true,
        customApi: true
      },
      customFields: {
        safetyCompliance: true,
        qualityStandards: 'ISO 9001',
        manufacturingType: 'Heavy Machinery'
      }
    }
  },
  {
    name: 'John Deere Construction',
    domain: 'johndeere.com',
    industry: 'Agricultural & Construction Equipment',
    size: 'large',
    status: 'active',
    subscription: {
      id: 'sub-jd-001',
      companyId: 'jd-001',
      plan: 'professional',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      maxUsers: 500,
      maxProjects: 200,
      features: ['advanced_analytics', 'custom_integrations', 'priority_support'],
      billingCycle: 'yearly',
      price: 25000,
      currency: 'USD'
    },
    settings: {
      timezone: 'America/Chicago',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'en',
      notifications: {
        email: true,
        sms: true,
        push: true,
        weeklyReports: true,
        monthlyReports: true,
        alerts: true
      },
      integrations: {
        slack: true,
        microsoftTeams: false,
        googleWorkspace: true,
        salesforce: false,
        customApi: true
      },
      customFields: {
        safetyCompliance: true,
        qualityStandards: 'ISO 14001',
        manufacturingType: 'Agricultural Equipment'
      }
    }
  },
  {
    name: 'Komatsu Heavy Industries',
    domain: 'komatsu.com',
    industry: 'Construction & Mining Equipment',
    size: 'large',
    status: 'active',
    subscription: {
      id: 'sub-kom-001',
      companyId: 'kom-001',
      plan: 'professional',
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      maxUsers: 300,
      maxProjects: 150,
      features: ['advanced_analytics', 'priority_support'],
      billingCycle: 'monthly',
      price: 2500,
      currency: 'USD'
    },
    settings: {
      timezone: 'Asia/Tokyo',
      dateFormat: 'YYYY/MM/DD',
      currency: 'JPY',
      language: 'ja',
      notifications: {
        email: true,
        sms: false,
        push: true,
        weeklyReports: false,
        monthlyReports: true,
        alerts: true
      },
      integrations: {
        slack: false,
        microsoftTeams: true,
        googleWorkspace: false,
        salesforce: true,
        customApi: false
      },
      customFields: {
        safetyCompliance: true,
        qualityStandards: 'ISO 9001',
        manufacturingType: 'Mining Equipment'
      }
    }
  },
  {
    name: 'Volvo Construction Equipment',
    domain: 'volvoce.com',
    industry: 'Construction Equipment',
    size: 'medium',
    status: 'active',
    subscription: {
      id: 'sub-vol-001',
      companyId: 'vol-001',
      plan: 'starter',
      status: 'active',
      startDate: '2024-04-01',
      endDate: '2024-10-01',
      maxUsers: 50,
      maxProjects: 25,
      features: ['basic_analytics'],
      billingCycle: 'monthly',
      price: 500,
      currency: 'EUR'
    },
    settings: {
      timezone: 'Europe/Stockholm',
      dateFormat: 'DD/MM/YYYY',
      currency: 'EUR',
      language: 'sv',
      notifications: {
        email: true,
        sms: false,
        push: false,
        weeklyReports: false,
        monthlyReports: true,
        alerts: false
      },
      integrations: {
        slack: false,
        microsoftTeams: false,
        googleWorkspace: true,
        salesforce: false,
        customApi: false
      },
      customFields: {
        safetyCompliance: true,
        qualityStandards: 'ISO 9001',
        manufacturingType: 'Construction Equipment'
      }
    }
  },
  {
    name: 'Liebherr Group',
    domain: 'liebherr.com',
    industry: 'Construction & Mining Equipment',
    size: 'large',
    status: 'pending',
    subscription: {
      id: 'sub-lie-001',
      companyId: 'lie-001',
      plan: 'professional',
      status: 'trial',
      startDate: '2024-05-01',
      endDate: '2024-08-01',
      maxUsers: 200,
      maxProjects: 100,
      features: ['advanced_analytics', 'priority_support'],
      billingCycle: 'monthly',
      price: 0,
      currency: 'EUR'
    },
    settings: {
      timezone: 'Europe/Berlin',
      dateFormat: 'DD.MM.YYYY',
      currency: 'EUR',
      language: 'de',
      notifications: {
        email: true,
        sms: false,
        push: true,
        weeklyReports: true,
        monthlyReports: true,
        alerts: true
      },
      integrations: {
        slack: false,
        microsoftTeams: true,
        googleWorkspace: false,
        salesforce: false,
        customApi: true
      },
      customFields: {
        safetyCompliance: true,
        qualityStandards: 'ISO 9001',
        manufacturingType: 'Crane Equipment'
      }
    }
  }
];

// Demo Users Data
const createUsers = (companyIds: string[]): Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const users: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  
  // Super Admin
  users.push({
    email: 'admin@platform.com',
    name: 'Platform Admin',
    role: 'super_admin',
    companyId: 'platform',
    department: 'Platform',
    position: 'Super Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'active',
    lastLogin: new Date().toISOString()
  });

  // Company users
  companyIds.forEach((companyId, index) => {
    const company = demoCompanies[index];
    
    if (!company) return;
    
    // CEO/Admin
    users.push({
      email: `ceo@${company.domain}`,
      name: `${company.name} CEO`,
      role: 'admin',
      companyId,
      department: 'Executive',
      position: 'Chief Executive Officer',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + index}?w=150&h=150&fit=crop&crop=face`,
      status: 'active',
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Operations Manager
    users.push({
      email: `ops@${company.domain}`,
      name: `${company.name} Operations Manager`,
      role: 'manager',
      companyId,
      department: 'Operations',
      position: 'Operations Manager',
      avatar: `https://images.unsplash.com/photo-${1500000000001 + index}?w=150&h=150&fit=crop&crop=face`,
      status: 'active',
      lastLogin: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Project Manager
    users.push({
      email: `pm@${company.domain}`,
      name: `${company.name} Project Manager`,
      role: 'manager',
      companyId,
      department: 'Project Management',
      position: 'Senior Project Manager',
      avatar: `https://images.unsplash.com/photo-${1500000000002 + index}?w=150&h=150&fit=crop&crop=face`,
      status: 'active',
      lastLogin: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Engineers
    for (let i = 0; i < 3; i++) {
      users.push({
        email: `engineer${i + 1}@${company.domain}`,
        name: `${company.name} Engineer ${i + 1}`,
        role: 'user',
        companyId,
        department: 'Engineering',
        position: 'Senior Engineer',
        avatar: `https://images.unsplash.com/photo-${1500000000003 + index * 10 + i}?w=150&h=150&fit=crop&crop=face`,
        status: 'active',
        lastLogin: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  });

  return users;
};

// Platform Metrics
const platformMetrics: PlatformMetrics = {
  totalCompanies: 5,
  activeCompanies: 4,
  totalUsers: 25,
  activeUsers: 23,
  totalRevenue: 85000,
  monthlyRecurringRevenue: 7083,
  churnRate: 0.05,
  averageRevenuePerUser: 3400
};

async function main() {
  console.log('🏢 Starting Platform database seeding...');
  console.log(`📋 Project: ${firebaseConfig.projectId}`);
  console.log(`🌐 Domain: ${firebaseConfig.authDomain}`);

  try {
    const companyIds: string[] = [];
    const userIds: string[] = [];

    // Seed companies
    console.log('🏭 Seeding companies...');
    for (const company of demoCompanies) {
      try {
        const docRef = await addDoc(collection(db, 'companies'), removeUndefined({
          ...company,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        companyIds.push(docRef.id);
        console.log(`✅ Created company: ${company.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating company ${company.name}:`, error.message);
      }
    }

    // Seed subscriptions
    console.log('💳 Seeding subscriptions...');
    for (let i = 0; i < demoCompanies.length; i++) {
      const company = demoCompanies[i];
      const companyId = companyIds[i];
      
      if (!company) continue;
      
      try {
        const subscription = {
          ...company.subscription,
          companyId,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        
        const docRef = await addDoc(collection(db, 'subscriptions'), removeUndefined(subscription));
        console.log(`✅ Created subscription for ${company.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating subscription for ${company.name}:`, error.message);
      }
    }

    // Seed users
    console.log('👥 Seeding users...');
    const usersToCreate = createUsers(companyIds);
    for (const user of usersToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'users'), removeUndefined({
          ...user,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        userIds.push(docRef.id);
        console.log(`✅ Created user: ${user.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating user ${user.name}:`, error.message);
      }
    }

    // Seed platform metrics
    console.log('📊 Seeding platform metrics...');
    try {
      const docRef = await addDoc(collection(db, 'platform_metrics'), removeUndefined({
        ...platformMetrics,
        timestamp: Timestamp.now(),
        createdAt: Timestamp.now(),
      }));
      console.log(`✅ Created platform metrics (${docRef.id})`);
    } catch (error: any) {
      console.error(`❌ Error creating platform metrics:`, error.message);
    }

    console.log('✅ Platform database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   🏭 Companies: ${companyIds.length}`);
    console.log(`   💳 Subscriptions: ${demoCompanies.length}`);
    console.log(`   👥 Users: ${userIds.length}`);
    console.log(`   📊 Platform Metrics: 1`);

    console.log('🎉 Platform seeding completed!');
    console.log('\n🔐 Platform Admin Credentials:');
    console.log('   Platform Admin: admin@platform.com / password123');
    console.log('\n🏢 Company Admin Credentials:');
    demoCompanies.forEach((company, index) => {
      console.log(`   ${company.name}: ceo@${company.domain} / password123`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding platform database:', error);
    process.exit(1);
  }
}

main();
