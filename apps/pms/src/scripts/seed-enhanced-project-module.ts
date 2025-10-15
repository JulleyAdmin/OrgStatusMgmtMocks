// Enhanced Project Module Seeding Script for Autocracy Manufacturing & Technology
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp, writeBatch, doc } from "firebase/firestore";
import { 
  User, 
  Project, 
  Task, 
  Activity, 
  OrgChartNode, 
  Workflow,
  ProjectPhase,
  ProjectDeliverable,
  ProjectResource,
  ProjectRisk,
  ProjectMilestone,
  ProjectFile,
  ProjectComment,
  ProjectTemplate,
  ProjectBudget,
  ProjectTimeTracking,
  Equipment,
  QualityCheck,
  SafetyInspection
} from '../types/project-schema';

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

// Demo Users Data for Autocracy Manufacturing & Technology
const demoUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    email: 'admin@autocracy.com',
    name: 'John Admin',
    role: 'admin',
    department: 'Executive',
    position: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    skills: ['Leadership', 'Strategy', 'Manufacturing Operations'],
    contact: { phone: '111-222-3333', slack: '@john.admin' }
  },
  {
    email: 'sarah.manager@autocracy.com',
    name: 'Sarah Johnson',
    role: 'manager',
    department: 'Manufacturing',
    position: 'Manufacturing Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    skills: ['Project Management', 'Team Leadership', 'Quality Control'],
    contact: { phone: '444-555-6666', slack: '@sarah.j' }
  },
  {
    email: 'mike.dev@autocracy.com',
    name: 'Mike Chen',
    role: 'employee',
    department: 'Engineering',
    position: 'Senior Manufacturing Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    skills: ['CAD Design', 'Manufacturing Processes', 'Quality Assurance'],
    contact: { phone: '777-888-9999', slack: '@mike.c' }
  },
  {
    email: 'lisa.designer@autocracy.com',
    name: 'Lisa Rodriguez',
    role: 'employee',
    department: 'Design',
    position: 'Automation Design Engineer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    skills: ['CAD Design', 'Automation Design', 'Prototyping'],
    contact: { phone: '123-456-7890', slack: '@lisa.r' }
  },
  {
    email: 'david.marketing@autocracy.com',
    name: 'David Kim',
    role: 'manager',
    department: 'Quality Assurance',
    position: 'Quality Manager',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face',
    skills: ['Quality Control', 'ISO Standards', 'Compliance'],
    contact: { phone: '987-654-3210', slack: '@david.k' }
  }
];

const createEnhancedProjects = (userIds: string[]): Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    name: 'Industrial Robot Assembly Line',
    description: 'Development of automated assembly line with advanced robotics and AI integration for manufacturing efficiency.',
    status: 'active',
    priority: 'high',
    manager: userIds[1], // Sarah Johnson
    team: [userIds[2], userIds[3]], // Mike Chen, Lisa Rodriguez
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    budget: 2500000,
    actualCost: 1650000,
    progress: 65,
    tags: ['robotics', 'automation', 'ai', 'assembly'],
    equipmentType: 'Industrial Robots',
    manufacturingPhase: 'Manufacturing',
    qualityStandards: ['ISO 9001', 'ISO 14001', 'Six Sigma'],
    complianceRequirements: ['OSHA', 'CE Marking', 'FDA'],
    projectCode: 'IRAL-2024-001',
    department: 'Manufacturing',
    location: 'Factory Floor A',
    totalTasks: 45,
    completedTasks: 29,
    overdueTasks: 2,
    teamUtilization: 85,
    qualityScore: 92,
    safetyScore: 95,
    riskLevel: 'medium',
    issuesCount: 3,
    resolvedIssuesCount: 2,
    lastActivityDate: '2024-03-15T14:30:00Z',
    requiresApproval: true,
    approvedBy: userIds[0],
    approvedAt: '2024-01-10T09:00:00Z',
    approvalNotes: 'Approved for Phase 2 manufacturing'
  },
  {
    name: 'Smart Manufacturing System',
    description: 'Implementation of IoT-enabled smart manufacturing system with real-time monitoring and predictive maintenance.',
    status: 'active',
    priority: 'high',
    manager: userIds[1], // Sarah Johnson
    team: [userIds[2], userIds[4]], // Mike Chen, David Kim
    startDate: '2024-02-01',
    endDate: '2024-07-15',
    budget: 1800000,
    actualCost: 810000,
    progress: 45,
    tags: ['iot', 'smart-factory', 'monitoring', 'predictive'],
    equipmentType: 'Automation Systems',
    manufacturingPhase: 'Production Planning',
    qualityStandards: ['ISO 9001', 'Six Sigma'],
    complianceRequirements: ['OSHA', 'FDA'],
    projectCode: 'SMS-2024-002',
    department: 'Manufacturing',
    location: 'Factory Floor B',
    totalTasks: 38,
    completedTasks: 17,
    overdueTasks: 1,
    teamUtilization: 78,
    qualityScore: 88,
    safetyScore: 92,
    riskLevel: 'low',
    issuesCount: 1,
    resolvedIssuesCount: 1,
    lastActivityDate: '2024-03-14T16:45:00Z',
    requiresApproval: true,
    approvedBy: userIds[0],
    approvedAt: '2024-01-25T11:30:00Z',
    approvalNotes: 'Approved for IoT integration phase'
  }
];

const createProjectPhases = (projectIds: string[], userIds: string[]): Omit<ProjectPhase, 'id' | 'createdAt' | 'updatedAt'>[] => [
  // Industrial Robot Assembly Line phases
  {
    projectId: projectIds[0],
    name: 'Design & Engineering Phase',
    description: 'Initial design and engineering of the robot assembly line system',
    phase: 'Design & Engineering',
    status: 'completed',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    progress: 100,
    dependencies: [],
    deliverables: [],
    resources: [],
    risks: []
  },
  {
    projectId: projectIds[0],
    name: 'Prototyping Phase',
    description: 'Building and testing prototype components',
    phase: 'Prototyping',
    status: 'completed',
    startDate: '2024-02-16',
    endDate: '2024-03-15',
    progress: 100,
    dependencies: ['phase-1'],
    deliverables: [],
    resources: [],
    risks: []
  },
  {
    projectId: projectIds[0],
    name: 'Manufacturing Phase',
    description: 'Full-scale manufacturing and assembly',
    phase: 'Manufacturing',
    status: 'in_progress',
    startDate: '2024-03-16',
    endDate: '2024-05-31',
    progress: 65,
    dependencies: ['phase-2'],
    deliverables: [],
    resources: [],
    risks: []
  },
  // Smart Manufacturing System phases
  {
    projectId: projectIds[1],
    name: 'Production Planning Phase',
    description: 'Planning and preparation for IoT system implementation',
    phase: 'Production Planning',
    status: 'in_progress',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    progress: 45,
    dependencies: [],
    deliverables: [],
    resources: [],
    risks: []
  }
];

const createProjectDeliverables = (phaseIds: string[], userIds: string[]): Omit<ProjectDeliverable, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    phaseId: phaseIds[0], // Design & Engineering Phase
    name: 'System Architecture Document',
    description: 'Complete system architecture and design specifications',
    type: 'document',
    status: 'completed',
    assignee: userIds[2], // Mike Chen
    dueDate: '2024-02-10',
    completedDate: '2024-02-08',
    files: [],
    approvalRequired: true,
    approvedBy: userIds[1],
    approvedAt: '2024-02-09T10:00:00Z'
  },
  {
    phaseId: phaseIds[0],
    name: 'Robot Control System Design',
    description: 'Detailed design of the robot control system with AI integration',
    type: 'system',
    status: 'completed',
    assignee: userIds[3], // Lisa Rodriguez
    dueDate: '2024-02-15',
    completedDate: '2024-02-14',
    files: [],
    approvalRequired: true,
    approvedBy: userIds[1],
    approvedAt: '2024-02-15T14:30:00Z'
  },
  {
    phaseId: phaseIds[2], // Manufacturing Phase
    name: 'Assembly Line Prototype',
    description: 'Working prototype of the complete assembly line',
    type: 'prototype',
    status: 'in_progress',
    assignee: userIds[2], // Mike Chen
    dueDate: '2024-05-15',
    files: [],
    approvalRequired: true
  }
];

const createProjectResources = (projectIds: string[], phaseIds: string[], userIds: string[]): Omit<ProjectResource, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    projectId: projectIds[0],
    phaseId: phaseIds[2], // Manufacturing Phase
    name: 'Industrial Robot Arm - Model XR-2000',
    type: 'equipment',
    category: 'Robotics',
    description: 'High-precision industrial robot arm for assembly operations',
    quantity: 4,
    unit: 'units',
    cost: 150000,
    supplier: 'RoboTech Industries',
    status: 'allocated',
    allocatedTo: userIds[2],
    allocationDate: '2024-03-20',
    specifications: {
      payload: '50kg',
      reach: '2.5m',
      precision: '±0.1mm',
      power: '3kW'
    }
  },
  {
    projectId: projectIds[0],
    name: 'Steel Components - Grade A36',
    type: 'material',
    category: 'Raw Materials',
    description: 'High-grade steel components for robot mounting and assembly',
    quantity: 500,
    unit: 'kg',
    cost: 25000,
    supplier: 'SteelCorp Manufacturing',
    status: 'received',
    specifications: {
      grade: 'A36',
      thickness: '10mm',
      finish: 'galvanized'
    }
  },
  {
    projectId: projectIds[1],
    name: 'IoT Sensors Package',
    type: 'equipment',
    category: 'Sensors',
    description: 'Complete IoT sensor package for manufacturing monitoring',
    quantity: 50,
    unit: 'units',
    cost: 75000,
    supplier: 'SensorTech Solutions',
    status: 'ordered',
    specifications: {
      type: 'multi-sensor',
      connectivity: 'WiFi/Bluetooth',
      battery: '2 years'
    }
  }
];

const createProjectRisks = (projectIds: string[], phaseIds: string[], userIds: string[]): Omit<ProjectRisk, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    projectId: projectIds[0],
    phaseId: phaseIds[2], // Manufacturing Phase
    title: 'Supply Chain Delay',
    description: 'Potential delay in receiving critical robot components due to supply chain issues',
    category: 'schedule',
    probability: 'medium',
    impact: 'high',
    status: 'monitoring',
    owner: userIds[1], // Sarah Johnson
    mitigationPlan: 'Identify alternative suppliers and maintain buffer inventory',
    contingencyPlan: 'Extend project timeline by 2 weeks if needed',
    identifiedDate: '2024-03-01'
  },
  {
    projectId: projectIds[0],
    title: 'Technical Integration Challenge',
    description: 'Complex integration between AI system and existing manufacturing equipment',
    category: 'technical',
    probability: 'high',
    impact: 'medium',
    status: 'mitigating',
    owner: userIds[2], // Mike Chen
    mitigationPlan: 'Conduct thorough testing and have backup integration approach',
    contingencyPlan: 'Use simplified integration approach if needed',
    identifiedDate: '2024-02-15'
  },
  {
    projectId: projectIds[1],
    title: 'Budget Overrun Risk',
    description: 'IoT sensor costs may exceed budget due to market price fluctuations',
    category: 'budget',
    probability: 'low',
    impact: 'medium',
    status: 'monitoring',
    owner: userIds[1], // Sarah Johnson
    mitigationPlan: 'Monitor market prices and negotiate bulk discounts',
    contingencyPlan: 'Reduce sensor count or use alternative suppliers',
    identifiedDate: '2024-02-20'
  }
];

const createProjectMilestones = (projectIds: string[], userIds: string[]): Omit<ProjectMilestone, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    projectId: projectIds[0],
    name: 'Design Phase Complete',
    description: 'All design deliverables completed and approved',
    type: 'phase_gate',
    targetDate: '2024-02-15',
    actualDate: '2024-02-15',
    status: 'completed',
    dependencies: [],
    deliverables: [],
    reviewers: [userIds[1], userIds[0]],
    approvedBy: userIds[0],
    approvedAt: '2024-02-15T16:00:00Z',
    notes: 'All design specifications approved and ready for prototyping'
  },
  {
    projectId: projectIds[0],
    name: 'Prototype Testing Complete',
    description: 'Prototype testing and validation completed',
    type: 'review',
    targetDate: '2024-03-15',
    actualDate: '2024-03-15',
    status: 'completed',
    dependencies: ['milestone-1'],
    deliverables: [],
    reviewers: [userIds[1], userIds[4]],
    approvedBy: userIds[1],
    approvedAt: '2024-03-15T14:30:00Z',
    notes: 'Prototype meets all specifications and quality standards'
  },
  {
    projectId: projectIds[0],
    name: 'Manufacturing Phase Complete',
    description: 'Full-scale manufacturing and assembly completed',
    type: 'phase_gate',
    targetDate: '2024-05-31',
    status: 'upcoming',
    dependencies: ['milestone-2'],
    deliverables: [],
    reviewers: [userIds[1], userIds[0], userIds[4]],
    notes: 'Target completion of manufacturing phase'
  },
  {
    projectId: projectIds[1],
    name: 'IoT System Integration',
    description: 'IoT sensors and monitoring system integration complete',
    type: 'deliverable',
    targetDate: '2024-04-30',
    status: 'upcoming',
    dependencies: [],
    deliverables: [],
    reviewers: [userIds[1], userIds[4]],
    notes: 'Complete integration of IoT monitoring system'
  }
];

const createProjectTemplates = (userIds: string[]): Omit<ProjectTemplate, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    name: 'Industrial Robot Project Template',
    description: 'Standard template for industrial robot manufacturing projects',
    equipmentType: 'Industrial Robots',
    manufacturingPhase: 'Design & Engineering',
    phases: [],
    milestones: [],
    defaultResources: [],
    qualityStandards: ['ISO 9001', 'ISO 14001', 'Six Sigma'],
    complianceRequirements: ['OSHA', 'CE Marking', 'FDA'],
    estimatedDuration: 180,
    estimatedBudget: 2000000,
    isActive: true,
    createdBy: userIds[1]
  },
  {
    name: 'Smart Manufacturing System Template',
    description: 'Template for IoT-enabled smart manufacturing system projects',
    equipmentType: 'Automation Systems',
    manufacturingPhase: 'Production Planning',
    phases: [],
    milestones: [],
    defaultResources: [],
    qualityStandards: ['ISO 9001', 'Six Sigma'],
    complianceRequirements: ['OSHA', 'FDA'],
    estimatedDuration: 150,
    estimatedBudget: 1500000,
    isActive: true,
    createdBy: userIds[1]
  }
];

const createProjectBudgets = (projectIds: string[]): Omit<ProjectBudget, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    projectId: projectIds[0],
    category: 'equipment',
    name: 'Robot Equipment',
    description: 'Industrial robot arms and control systems',
    budgetedAmount: 600000,
    actualAmount: 450000,
    committedAmount: 500000,
    remainingAmount: 100000,
    currency: 'USD',
    status: 'on_track',
    lastUpdated: '2024-03-15T10:00:00Z'
  },
  {
    projectId: projectIds[0],
    category: 'materials',
    name: 'Raw Materials',
    description: 'Steel, aluminum, and other raw materials',
    budgetedAmount: 150000,
    actualAmount: 120000,
    committedAmount: 140000,
    remainingAmount: 10000,
    currency: 'USD',
    status: 'on_track',
    lastUpdated: '2024-03-15T10:00:00Z'
  },
  {
    projectId: projectIds[0],
    category: 'personnel',
    name: 'Engineering Team',
    description: 'Engineering and design team costs',
    budgetedAmount: 400000,
    actualAmount: 280000,
    committedAmount: 350000,
    remainingAmount: 50000,
    currency: 'USD',
    status: 'on_track',
    lastUpdated: '2024-03-15T10:00:00Z'
  },
  {
    projectId: projectIds[1],
    category: 'equipment',
    name: 'IoT Sensors',
    description: 'IoT sensors and monitoring equipment',
    budgetedAmount: 200000,
    actualAmount: 75000,
    committedAmount: 150000,
    remainingAmount: 50000,
    currency: 'USD',
    status: 'on_track',
    lastUpdated: '2024-03-15T10:00:00Z'
  }
];

const createProjectTimeTracking = (projectIds: string[], userIds: string[]): Omit<ProjectTimeTracking, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    projectId: projectIds[0],
    userId: userIds[2], // Mike Chen
    userName: 'Mike Chen',
    date: '2024-03-15',
    hoursWorked: 8,
    description: 'Robot control system integration and testing',
    billable: true,
    hourlyRate: 75,
    approvedBy: userIds[1],
    approvedAt: '2024-03-15T17:00:00Z'
  },
  {
    projectId: projectIds[0],
    userId: userIds[3], // Lisa Rodriguez
    userName: 'Lisa Rodriguez',
    date: '2024-03-15',
    hoursWorked: 7.5,
    description: 'Design review and documentation updates',
    billable: true,
    hourlyRate: 70,
    approvedBy: userIds[1],
    approvedAt: '2024-03-15T17:00:00Z'
  },
  {
    projectId: projectIds[1],
    userId: userIds[4], // David Kim
    userName: 'David Kim',
    date: '2024-03-15',
    hoursWorked: 6,
    description: 'IoT sensor testing and quality validation',
    billable: true,
    hourlyRate: 80,
    approvedBy: userIds[1],
    approvedAt: '2024-03-15T17:00:00Z'
  }
];

async function main() {
  console.log('🏭 Starting Enhanced Project Module database seeding...');
  console.log(`📋 Project: ${firebaseConfig.projectId}`);
  console.log(`🌐 Domain: ${firebaseConfig.authDomain}`);

  try {
    const userIds: string[] = [];
    const projectIds: string[] = [];
    const phaseIds: string[] = [];

    // Seed users
    console.log('👥 Seeding users...');
    for (const user of demoUsers) {
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

    // Seed enhanced projects
    console.log('🏗️ Seeding enhanced projects...');
    const projectsToCreate = createEnhancedProjects(userIds);
    for (const project of projectsToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'projects'), removeUndefined({
          ...project,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        projectIds.push(docRef.id);
        console.log(`✅ Created project: ${project.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating project ${project.name}:`, error.message);
      }
    }

    // Seed project phases
    console.log('📋 Seeding project phases...');
    const phasesToCreate = createProjectPhases(projectIds, userIds);
    for (const phase of phasesToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'projectPhases'), removeUndefined({
          ...phase,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        phaseIds.push(docRef.id);
        console.log(`✅ Created phase: ${phase.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating phase ${phase.name}:`, error.message);
      }
    }

    // Seed project deliverables
    console.log('📦 Seeding project deliverables...');
    const deliverablesToCreate = createProjectDeliverables(phaseIds, userIds);
    for (const deliverable of deliverablesToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'projectDeliverables'), removeUndefined({
          ...deliverable,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        console.log(`✅ Created deliverable: ${deliverable.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating deliverable ${deliverable.name}:`, error.message);
      }
    }

    // Seed project resources
    console.log('🔧 Seeding project resources...');
    const resourcesToCreate = createProjectResources(projectIds, phaseIds, userIds);
    for (const resource of resourcesToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'projectResources'), removeUndefined({
          ...resource,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        console.log(`✅ Created resource: ${resource.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating resource ${resource.name}:`, error.message);
      }
    }

    // Seed project risks
    console.log('⚠️ Seeding project risks...');
    const risksToCreate = createProjectRisks(projectIds, phaseIds, userIds);
    for (const risk of risksToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'projectRisks'), removeUndefined({
          ...risk,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        console.log(`✅ Created risk: ${risk.title} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating risk ${risk.title}:`, error.message);
      }
    }

    // Seed project milestones
    console.log('🎯 Seeding project milestones...');
    const milestonesToCreate = createProjectMilestones(projectIds, userIds);
    for (const milestone of milestonesToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'projectMilestones'), removeUndefined({
          ...milestone,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        console.log(`✅ Created milestone: ${milestone.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating milestone ${milestone.name}:`, error.message);
      }
    }

    // Seed project templates
    console.log('📋 Seeding project templates...');
    const templatesToCreate = createProjectTemplates(userIds);
    for (const template of templatesToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'projectTemplates'), removeUndefined({
          ...template,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        console.log(`✅ Created template: ${template.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating template ${template.name}:`, error.message);
      }
    }

    // Seed project budgets
    console.log('💰 Seeding project budgets...');
    const budgetsToCreate = createProjectBudgets(projectIds);
    for (const budget of budgetsToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'projectBudgets'), removeUndefined({
          ...budget,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        console.log(`✅ Created budget: ${budget.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating budget ${budget.name}:`, error.message);
      }
    }

    // Seed project time tracking
    console.log('⏰ Seeding project time tracking...');
    const timeTrackingToCreate = createProjectTimeTracking(projectIds, userIds);
    for (const timeEntry of timeTrackingToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'projectTimeTracking'), removeUndefined({
          ...timeEntry,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        console.log(`✅ Created time entry: ${timeEntry.userName} - ${timeEntry.hoursWorked}h (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating time entry for ${timeEntry.userName}:`, error.message);
      }
    }

    console.log('✅ Enhanced Project Module database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${userIds.length}`);
    console.log(`   🏗️ Projects: ${projectIds.length}`);
    console.log(`   📋 Phases: ${phaseIds.length}`);
    console.log(`   📦 Deliverables: ${deliverablesToCreate.length}`);
    console.log(`   🔧 Resources: ${resourcesToCreate.length}`);
    console.log(`   ⚠️ Risks: ${risksToCreate.length}`);
    console.log(`   🎯 Milestones: ${milestonesToCreate.length}`);
    console.log(`   📋 Templates: ${templatesToCreate.length}`);
    console.log(`   💰 Budgets: ${budgetsToCreate.length}`);
    console.log(`   ⏰ Time Entries: ${timeTrackingToCreate.length}`);

    console.log('🎉 Enhanced Project Module seeding completed!');
    console.log('\n🔐 Autocracy Login Credentials:');
    demoUsers.forEach(user => {
      console.log(`   ${user.name}: ${user.email} / password123`);
    });
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Enhanced Project Module database:', error);
    process.exit(1);
  }
}

main();
