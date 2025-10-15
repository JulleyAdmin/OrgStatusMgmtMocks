// Comprehensive PMS seeding script for Autocracy Manufacturing & Technology
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp, writeBatch, doc } from "firebase/firestore";
import { User, Project, Task, Activity, OrgChartNode, Workflow } from '../types';

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

const createProjects = (userIds: string[]): Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[] => [
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
    progress: 65,
    tags: ['robotics', 'automation', 'ai', 'assembly'],
    equipmentType: 'Industrial Robots',
    manufacturingPhase: 'Manufacturing',
    qualityStandards: ['ISO 9001', 'ISO 14001', 'Six Sigma'],
    complianceRequirements: ['OSHA', 'CE Marking', 'FDA']
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
    progress: 45,
    tags: ['iot', 'smart-factory', 'monitoring', 'predictive'],
    equipmentType: 'Automation Systems',
    manufacturingPhase: 'Production Planning',
    qualityStandards: ['ISO 9001', 'Six Sigma'],
    complianceRequirements: ['OSHA', 'FDA']
  },
  {
    name: 'Quality Control Automation',
    description: 'Development of automated quality control systems with machine learning and computer vision integration.',
    status: 'planning',
    priority: 'medium',
    manager: userIds[1], // Sarah Johnson
    team: [userIds[3]], // Lisa Rodriguez
    startDate: '2024-08-01',
    endDate: '2024-12-31',
    budget: 2200000,
    progress: 15,
    tags: ['quality-control', 'machine-learning', 'computer-vision'],
    equipmentType: 'Quality Control Systems',
    manufacturingPhase: 'Design & Engineering',
    qualityStandards: ['ISO 9001', 'IATF 16949'],
    complianceRequirements: ['OSHA', 'FDA', 'CE Marking']
  },
  {
    name: 'Smart Sensor Network',
    description: 'Implementation of comprehensive smart sensor network for real-time manufacturing monitoring and optimization.',
    status: 'completed',
    priority: 'medium',
    manager: userIds[1], // Sarah Johnson
    team: [userIds[2], userIds[4]], // Mike Chen, David Kim
    startDate: '2023-09-01',
    endDate: '2024-01-31',
    budget: 2000000,
    progress: 100,
    tags: ['sensors', 'monitoring', 'optimization', 'network'],
    equipmentType: 'Smart Sensors',
    manufacturingPhase: 'Packaging & Delivery',
    qualityStandards: ['ISO 9001', 'AS9100'],
    complianceRequirements: ['OSHA', 'FDA', 'CE Marking']
  }
];

const createTasks = (userIds: string[], projectIds: string[]): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    title: 'Design Robot Control System',
    description: 'Design and engineer the control system for industrial robot assembly line with AI integration.',
    status: 'done',
    priority: 'high',
    assignee: userIds[2], // Mike Chen
    reporter: userIds[1], // Sarah Johnson
    projectId: projectIds[0], // Industrial Robot Assembly Line
    dueDate: '2024-01-30',
    estimatedHours: 80,
    actualHours: 75,
    tags: ['design', 'robotics', 'ai', 'control'],
    comments: [{ userId: userIds[1], text: 'Excellent work on the robot control design!', timestamp: '2024-01-30T10:00:00Z' }],
    manufacturingStep: 'Design & Engineering',
    qualityCheckpoints: ['Design Review', 'Safety Analysis'],
    safetyRequirements: ['OSHA Robotics Standards', 'Safety Testing']
  },
  {
    title: 'IoT Sensor Integration',
    description: 'Integrate IoT sensors into smart manufacturing system for real-time monitoring capabilities.',
    status: 'in_progress',
    priority: 'high',
    assignee: userIds[4], // David Kim
    reporter: userIds[1], // Sarah Johnson
    projectId: projectIds[1], // Smart Manufacturing System
    dueDate: '2024-03-20',
    estimatedHours: 40,
    actualHours: 25,
    tags: ['iot', 'sensors', 'monitoring'],
    comments: [],
    manufacturingStep: 'Production Planning',
    qualityCheckpoints: ['Sensor Testing', 'Integration Check'],
    safetyRequirements: ['Electrical Safety', 'Data Security']
  },
  {
    title: 'Machine Learning Model Development',
    description: 'Develop machine learning models for predictive maintenance and quality control automation.',
    status: 'todo',
    priority: 'medium',
    assignee: userIds[2], // Mike Chen
    reporter: userIds[1], // Sarah Johnson
    projectId: projectIds[2], // Quality Control Automation
    dueDate: '2024-04-15',
    estimatedHours: 60,
    actualHours: 0,
    tags: ['machine-learning', 'predictive', 'automation'],
    comments: [],
    manufacturingStep: 'Design & Engineering',
    qualityCheckpoints: ['Model Testing', 'Accuracy Validation'],
    safetyRequirements: ['Data Privacy', 'Model Validation']
  },
  {
    title: 'Automation System Review',
    description: 'Review and finalize automation system specifications for smart sensor network.',
    status: 'todo',
    priority: 'medium',
    assignee: userIds[3], // Lisa Rodriguez
    reporter: userIds[1], // Sarah Johnson
    projectId: projectIds[3], // Smart Sensor Network
    dueDate: '2024-08-15',
    estimatedHours: 50,
    actualHours: 0,
    tags: ['automation', 'review', 'specifications'],
    comments: [],
    manufacturingStep: 'Design & Engineering',
    qualityCheckpoints: ['System Review', 'Specification Check'],
    safetyRequirements: ['Automation Safety Standards', 'Compliance Review']
  }
];

const createActivities = (userIds: string[], projectIds: string[]): Omit<Activity, 'id'>[] => [
  {
    type: 'task_completed',
    title: 'Task Completed',
    description: 'Mike Chen completed "Design Robot Control System" for Industrial Robot Assembly Line',
    userId: userIds[2],
    userName: 'Mike Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    timestamp: '2024-01-30T10:30:00Z',
    metadata: { taskId: 'robot-control-task', projectId: projectIds[0] }
  },
  {
    type: 'project_created',
    title: 'Project Created',
    description: 'Sarah Johnson created "Smart Manufacturing System" automation project',
    userId: userIds[1],
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    timestamp: '2024-02-01T14:00:00Z',
    metadata: { projectId: projectIds[1] }
  },
  {
    type: 'quality_check',
    title: 'Quality Check Completed',
    description: 'David Kim completed quality control inspection on Smart Sensor Network components',
    userId: userIds[4],
    userName: 'David Kim',
    userAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face',
    timestamp: '2024-01-15T09:00:00Z',
    metadata: { projectId: projectIds[3], qualityScore: 98 }
  },
  {
    type: 'task_assigned',
    title: 'Task Assigned',
    description: 'Machine Learning Model Development assigned to Mike Chen for Quality Control Automation',
    userId: userIds[1],
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    timestamp: '2024-03-01T11:00:00Z',
    metadata: { taskId: 'ml-model-task', assigneeId: userIds[2] }
  }
];

const createOrgChartNodes = (userIds: string[]): Omit<OrgChartNode, 'id'>[] => [
  {
    name: 'John Admin',
    position: 'CEO',
    department: 'Executive',
    manager: null,
    reports: [userIds[1], userIds[4]], // Sarah Johnson, David Kim
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    level: 0,
    userId: userIds[0]
  },
  {
    name: 'Sarah Johnson',
    position: 'Manufacturing Manager',
    department: 'Manufacturing',
    manager: userIds[0], // John Admin
    reports: [userIds[2], userIds[3]], // Mike Chen, Lisa Rodriguez
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    level: 1,
    userId: userIds[1]
  },
  {
    name: 'David Kim',
    position: 'Quality Manager',
    department: 'Quality Assurance',
    manager: userIds[0], // John Admin
    reports: [],
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face',
    level: 1,
    userId: userIds[4]
  },
  {
    name: 'Mike Chen',
    position: 'Senior Manufacturing Engineer',
    department: 'Engineering',
    manager: userIds[1], // Sarah Johnson
    reports: [],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 2,
    userId: userIds[2]
  },
  {
    name: 'Lisa Rodriguez',
    position: 'Equipment Design Engineer',
    department: 'Design',
    manager: userIds[1], // Sarah Johnson
    reports: [],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    level: 2,
    userId: userIds[3]
  }
];

async function main() {
  console.log('🏭 Starting Autocracy Manufacturing & Technology PMS database seeding...');
  console.log(`📋 Project: ${firebaseConfig.projectId}`);
  console.log(`🌐 Domain: ${firebaseConfig.authDomain}`);

  try {
    const userIds: string[] = [];
    const projectIds: string[] = [];

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

    // Seed projects
    console.log('🏗️ Seeding Autocracy manufacturing projects...');
    const projectsToCreate = createProjects(userIds);
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

    // Seed tasks
    console.log('📋 Seeding Autocracy manufacturing tasks...');
    const tasksToCreate = createTasks(userIds, projectIds);
    for (const task of tasksToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'tasks'), removeUndefined({
          ...task,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }));
        console.log(`✅ Created task: ${task.title} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating task ${task.title}:`, error.message);
      }
    }

    // Seed activities
    console.log('📊 Seeding activities...');
    const activitiesToCreate = createActivities(userIds, projectIds);
    for (const activity of activitiesToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'activities'), removeUndefined({
          ...activity,
          timestamp: Timestamp.now(),
        }));
        console.log(`✅ Created activity: ${activity.title} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating activity ${activity.title}:`, error.message);
      }
    }

    // Seed org chart
    console.log('🌳 Seeding organizational chart...');
    const orgChartNodesToCreate = createOrgChartNodes(userIds);
    for (const node of orgChartNodesToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'org_chart'), removeUndefined(node));
        console.log(`✅ Created org node: ${node.name} (${docRef.id})`);
      } catch (error: any) {
        console.error(`❌ Error creating org node ${node.name}:`, error.message);
      }
    }

    console.log('✅ Autocracy Manufacturing & Technology PMS database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${userIds.length}`);
    console.log(`   🏗️ Projects: ${projectIds.length}`);
    console.log(`   📋 Tasks: ${tasksToCreate.length}`);
    console.log(`   📊 Activities: ${activitiesToCreate.length}`);
    console.log(`   🌳 Org Chart Nodes: ${orgChartNodesToCreate.length}`);

    console.log('🎉 PMS seeding completed!');
    console.log('\n🔐 Autocracy Login Credentials:');
    demoUsers.forEach(user => {
      console.log(`   ${user.name}: ${user.email} / password123`);
    });
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding PMS database:', error);
    process.exit(1);
  }
}

main();
