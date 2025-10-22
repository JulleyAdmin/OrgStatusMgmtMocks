// Seed script for Org & Identity structure
// Creates sample departments, positions, and assignments for testing

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import {
  createDepartment,
  createPosition,
  assignUserToPosition,
  createDelegation,
} from '../lib/org-services'

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyATFR7e2t1aaP7OJlMODFn7vnya1e8tQdc",
  authDomain: "julley-platform-dev.firebaseapp.com",
  projectId: "julley-platform-dev",
  storageBucket: "julley-platform-dev.firebasestorage.app",
  messagingSenderId: "46276910499",
  appId: "1:46276910499:web:433453e451cd33aea84e16",
  measurementId: "G-NCSHHHZ9QF"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const COMPANY_ID = 'SU6Svsf6iVGdopeWKFqQ'
const ADMIN_USER_ID = 'admin-user-id'

// Ensure company document exists
async function ensureCompanyExists() {
  const companyRef = doc(db, 'companies', COMPANY_ID)
  await setDoc(companyRef, {
    id: COMPANY_ID,
    name: 'Autocracy Manufacturing & Technology',
    domain: 'autocracy.com',
    status: 'active',
    plan: 'enterprise',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, { merge: true })
  console.log('✓ Company document ensured')
}

// Create sample users
async function seedUsers() {
  console.log('\n👥 Creating sample users...')
  
  const sampleUsers = [
    {
      id: 'user-john-smith',
      name: 'John Smith',
      email: 'john.smith@autocracy.com',
      role: 'manager',
      companyId: COMPANY_ID,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-sarah-johnson',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@autocracy.com',
      role: 'supervisor',
      companyId: COMPANY_ID,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-michael-chen',
      name: 'Michael Chen',
      email: 'michael.chen@autocracy.com',
      role: 'engineer',
      companyId: COMPANY_ID,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-emily-davis',
      name: 'Emily Davis',
      email: 'emily.davis@autocracy.com',
      role: 'qa-manager',
      companyId: COMPANY_ID,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-robert-wilson',
      name: 'Robert Wilson',
      email: 'robert.wilson@autocracy.com',
      role: 'operator',
      companyId: COMPANY_ID,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  for (const user of sampleUsers) {
    const userRef = doc(db, 'users', user.id)
    await setDoc(userRef, user, { merge: true })
    console.log(`✓ Created user ${user.name} (${user.id})`)
  }
}

async function seedOrgStructure() {
  console.log('🌱 Seeding Org & Identity structure...')

  try {
    // Ensure company exists first
    await ensureCompanyExists()
    
    // Create sample users
    await seedUsers()
    
    // Create Departments
    console.log('\n📁 Creating departments...')
    
    const manufacturingDept = await createDepartment(
      COMPANY_ID,
      {
        name: 'Manufacturing',
        code: 'MFG',
        description: 'Core manufacturing operations and production',
        parentDepartmentId: null,
        location: 'Building A - Production Floor',
        costCenter: 'CC-1001',
        budget: 5000000,
        status: 'active',
        companyId: COMPANY_ID,
        createdBy: ADMIN_USER_ID,
        updatedBy: ADMIN_USER_ID,
      },
      ADMIN_USER_ID
    )
    console.log(`✓ Created Manufacturing Department (${manufacturingDept.id})`)

    const qualityDept = await createDepartment(
      COMPANY_ID,
      {
        name: 'Quality Assurance',
        code: 'QA',
        description: 'Quality control and assurance',
        parentDepartmentId: null,
        location: 'Building B - QA Lab',
        costCenter: 'CC-1002',
        budget: 1000000,
        status: 'active',
        companyId: COMPANY_ID,
        createdBy: ADMIN_USER_ID,
        updatedBy: ADMIN_USER_ID,
      },
      ADMIN_USER_ID
    )
    console.log(`✓ Created Quality Assurance Department (${qualityDept.id})`)

    const engineeringDept = await createDepartment(
      COMPANY_ID,
      {
        name: 'Engineering',
        code: 'ENG',
        description: 'Product design and engineering',
        parentDepartmentId: null,
        location: 'Building C - R&D Center',
        costCenter: 'CC-1003',
        budget: 3000000,
        status: 'active',
        companyId: COMPANY_ID,
        createdBy: ADMIN_USER_ID,
        updatedBy: ADMIN_USER_ID,
      },
      ADMIN_USER_ID
    )
    console.log(`✓ Created Engineering Department (${engineeringDept.id})`)

    const productionLineDept = await createDepartment(
      COMPANY_ID,
      {
        name: 'Production Line 1',
        code: 'PL1',
        description: 'Primary production line for industrial robots',
        parentDepartmentId: manufacturingDept.id,
        location: 'Building A - Line 1',
        costCenter: 'CC-1001-01',
        budget: 2000000,
        status: 'active',
        companyId: COMPANY_ID,
        createdBy: ADMIN_USER_ID,
        updatedBy: ADMIN_USER_ID,
      },
      ADMIN_USER_ID
    )
    console.log(`✓ Created Production Line 1 Sub-Department (${productionLineDept.id})`)

    // Create Positions
    console.log('\n💼 Creating positions...')

    const vpManufacturing = await createPosition(
      COMPANY_ID,
      {
        title: 'VP of Manufacturing',
        code: 'VP-MFG',
        description: 'Oversees all manufacturing operations',
        departmentId: manufacturingDept.id,
        level: 2,
        scope: {
          departments: [manufacturingDept.id, productionLineDept.id],
          locations: ['Building A'],
          productLines: ['Industrial Robots', 'Automation Systems'],
          processes: ['Production', 'Quality Control', 'Safety'],
          equipmentTypes: ['Industrial Robots', 'Automation Systems'],
        },
        responsibilities: [
          'Oversee manufacturing operations',
          'Budget management',
          'Team leadership',
          'Strategic planning',
        ],
        requiredSkills: ['Manufacturing Management', 'Leadership', 'Budget Management', 'Six Sigma'],
        optionalSkills: ['Lean Manufacturing', 'ISO Certification'],
        certifications: ['Six Sigma Black Belt', 'Manufacturing Leadership Certificate'],
        reportsToPositionId: null,
        employmentType: 'full_time',
        headcount: 1,
        approvalAuthority: {
          canApproveProjects: true,
          canApproveBudgets: true,
          canApproveQuality: true,
          canApproveSafety: true,
          canApproveTimeOff: true,
          budgetLimit: 500000,
          customApprovals: ['Equipment Purchase', 'Vendor Selection'],
        },
        status: 'active',
        companyId: COMPANY_ID,
        createdBy: ADMIN_USER_ID,
        updatedBy: ADMIN_USER_ID,
      },
      ADMIN_USER_ID
    )
    console.log(`✓ Created VP of Manufacturing position (${vpManufacturing.id})`)

    const productionSupervisor = await createPosition(
      COMPANY_ID,
      {
        title: 'Production Line Supervisor',
        code: 'PLS-001',
        description: 'Supervises daily production line operations',
        departmentId: productionLineDept.id,
        level: 3,
        scope: {
          departments: [productionLineDept.id],
          locations: ['Building A - Line 1'],
          productLines: ['Industrial Robots'],
          processes: ['Production', 'Safety'],
          equipmentTypes: ['Industrial Robots'],
        },
        responsibilities: [
          'Supervise production line operations',
          'Manage line workers',
          'Ensure safety compliance',
          'Monitor production metrics',
        ],
        requiredSkills: ['Production Management', 'Team Leadership', 'Safety Management'],
        optionalSkills: ['Lean Manufacturing', 'Quality Control'],
        certifications: ['OSHA Safety Certification', 'Production Supervisor Certificate'],
        reportsToPositionId: vpManufacturing.id,
        employmentType: 'full_time',
        headcount: 3,
        approvalAuthority: {
          canApproveProjects: false,
          canApproveBudgets: false,
          canApproveQuality: false,
          canApproveSafety: true,
          canApproveTimeOff: true,
          budgetLimit: 10000,
          customApprovals: ['Line Stoppage', 'Overtime Approval'],
        },
        status: 'active',
        companyId: COMPANY_ID,
        createdBy: ADMIN_USER_ID,
        updatedBy: ADMIN_USER_ID,
      },
      ADMIN_USER_ID
    )
    console.log(`✓ Created Production Line Supervisor position (${productionSupervisor.id})`)

    const qaManager = await createPosition(
      COMPANY_ID,
      {
        title: 'QA Manager',
        code: 'QA-MGR',
        description: 'Manages quality assurance processes',
        departmentId: qualityDept.id,
        level: 3,
        scope: {
          departments: [qualityDept.id],
          locations: ['Building B'],
          productLines: ['Industrial Robots', 'Automation Systems'],
          processes: ['Quality Control', 'Quality Assurance', 'Testing'],
          equipmentTypes: ['Quality Control Systems'],
        },
        responsibilities: [
          'Manage QA team',
          'Develop quality standards',
          'Conduct quality audits',
          'Approve quality reports',
        ],
        requiredSkills: ['Quality Management', 'ISO Standards', 'Statistical Analysis'],
        optionalSkills: ['Six Sigma', 'Auditing'],
        certifications: ['ISO 9001 Lead Auditor', 'ASQ CQE'],
        reportsToPositionId: null,
        employmentType: 'full_time',
        headcount: 1,
        approvalAuthority: {
          canApproveProjects: false,
          canApproveBudgets: true,
          canApproveQuality: true,
          canApproveSafety: false,
          canApproveTimeOff: true,
          budgetLimit: 50000,
          customApprovals: ['Quality Certification', 'Product Release'],
        },
        status: 'active',
        companyId: COMPANY_ID,
        createdBy: ADMIN_USER_ID,
        updatedBy: ADMIN_USER_ID,
      },
      ADMIN_USER_ID
    )
    console.log(`✓ Created QA Manager position (${qaManager.id})`)

    const seniorEngineer = await createPosition(
      COMPANY_ID,
      {
        title: 'Senior Manufacturing Engineer',
        code: 'ENG-SR-001',
        description: 'Designs and optimizes manufacturing processes',
        departmentId: engineeringDept.id,
        level: 4,
        scope: {
          departments: [engineeringDept.id],
          locations: ['Building C'],
          productLines: ['Industrial Robots'],
          processes: ['Design', 'Process Engineering'],
          equipmentTypes: ['Industrial Robots', 'Automation Systems'],
        },
        responsibilities: [
          'Design manufacturing processes',
          'Optimize production efficiency',
          'Technical documentation',
          'Process improvement',
        ],
        requiredSkills: [
          'Mechanical Engineering',
          'CAD/CAM',
          'Process Engineering',
          'Problem Solving',
        ],
        optionalSkills: ['Robotics', 'Automation', 'PLC Programming'],
        certifications: ['Professional Engineer (PE)', 'Certified Manufacturing Engineer'],
        reportsToPositionId: null,
        employmentType: 'full_time',
        headcount: 5,
        approvalAuthority: {
          canApproveProjects: false,
          canApproveBudgets: false,
          canApproveQuality: false,
          canApproveSafety: false,
          canApproveTimeOff: false,
          customApprovals: ['Technical Specifications'],
        },
        status: 'active',
        companyId: COMPANY_ID,
        createdBy: ADMIN_USER_ID,
        updatedBy: ADMIN_USER_ID,
      },
      ADMIN_USER_ID
    )
    console.log(`✓ Created Senior Manufacturing Engineer position (${seniorEngineer.id})`)

    console.log('\n✅ Org structure seeded successfully!')
    console.log('\nCreated:')
    console.log(`  - 5 Sample Users`)
    console.log(`  - 4 Departments (3 top-level, 1 sub-department)`)
    console.log(`  - 4 Positions (VP, Supervisor, QA Manager, Engineer)`)
    console.log('\n📝 Next steps:')
    console.log('  1. Assign users to positions in the Organization → Assignments tab')
    console.log('  2. Test delegation workflows')
    console.log('  3. Test occupant swap functionality')
    console.log('  4. Generate audit reports')
    
    return {
      departments: {
        manufacturing: manufacturingDept,
        quality: qualityDept,
        engineering: engineeringDept,
        productionLine: productionLineDept,
      },
      positions: {
        vpManufacturing,
        productionSupervisor,
        qaManager,
        seniorEngineer,
      },
    }
  } catch (error) {
    console.error('❌ Error seeding org structure:', error)
    throw error
  }
}

export { seedOrgStructure }

// Run the seed script
seedOrgStructure()
  .then(() => {
    console.log('\n🎉 Seeding complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error)
    process.exit(1)
  })

