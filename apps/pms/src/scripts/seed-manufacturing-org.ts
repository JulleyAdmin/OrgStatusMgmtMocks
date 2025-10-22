// Comprehensive seed script for Manufacturing Org Structure
// Based on the complete organizational chart

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import {
  createDepartment,
  createPosition,
  assignUserToPosition,
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

// Storage for created IDs
const positionIds: Record<string, string> = {}
const departmentIds: Record<string, string> = {}
const userIds: Record<string, string> = {}

// Ensure company document exists
async function ensureCompanyExists() {
  const companyRef = doc(db, 'companies', COMPANY_ID)
  await setDoc(companyRef, {
    id: COMPANY_ID,
    name: 'Autocracy Manufacturing & Technology',
    domain: 'autocracy.com',
    status: 'active',
    plan: 'enterprise',
    settings: {
      industry: 'Manufacturing',
      employeeCount: '500-1000',
      timezone: 'America/New_York'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, { merge: true })
  console.log('✓ Company document ensured')
}

// Create sample users for different positions
async function seedUsers() {
  console.log('\n👥 Creating sample users...')
  
  const users = [
    { id: 'user-ceo', name: 'John Anderson', email: 'john.anderson@autocracy.com', role: 'CEO' },
    { id: 'user-spoc', name: 'Sarah Mitchell', email: 'sarah.mitchell@autocracy.com', role: 'SPOC' },
    
    // C-Suite
    { id: 'user-cmo', name: 'Michael Roberts', email: 'michael.roberts@autocracy.com', role: 'CMO' },
    { id: 'user-cso', name: 'Jennifer Lee', email: 'jennifer.lee@autocracy.com', role: 'CSO' },
    { id: 'user-coo', name: 'David Chen', email: 'david.chen@autocracy.com', role: 'COO' },
    { id: 'user-cfo', name: 'Lisa Thompson', email: 'lisa.thompson@autocracy.com', role: 'CFO' },
    { id: 'user-cto', name: 'Robert Kumar', email: 'robert.kumar@autocracy.com', role: 'CTO' },
    
    // Vice Presidents
    { id: 'user-vp-marketing', name: 'Amy Watson', email: 'amy.watson@autocracy.com', role: 'VP Marketing' },
    { id: 'user-vp-sales', name: 'Tom Wilson', email: 'tom.wilson@autocracy.com', role: 'VP Sales' },
    { id: 'user-vp-scm', name: 'Carlos Rodriguez', email: 'carlos.rodriguez@autocracy.com', role: 'VP SCM' },
    { id: 'user-vp-production', name: 'James Park', email: 'james.park@autocracy.com', role: 'VP Production' },
    { id: 'user-vp-product', name: 'Emma Davis', email: 'emma.davis@autocracy.com', role: 'VP Product' },
    
    // General Managers
    { id: 'user-gm-hr', name: 'Patricia Brown', email: 'patricia.brown@autocracy.com', role: 'GM HR & Admin' },
    { id: 'user-gm-sales', name: 'Kevin Martinez', email: 'kevin.martinez@autocracy.com', role: 'GM Sales' },
    { id: 'user-gm-aftersales', name: 'Nancy Taylor', email: 'nancy.taylor@autocracy.com', role: 'GM After Sales' },
    { id: 'user-gm-qc', name: 'George Anderson', email: 'george.anderson@autocracy.com', role: 'GM Quality Control' },
    { id: 'user-gm-service', name: 'Maria Garcia', email: 'maria.garcia@autocracy.com', role: 'GM Service' },
    { id: 'user-gm-scm', name: 'Richard Lee', email: 'richard.lee@autocracy.com', role: 'GM SCM' },
    { id: 'user-gm-production', name: 'William Chen', email: 'william.chen@autocracy.com', role: 'GM Production' },
    { id: 'user-gm-finance', name: 'Sandra White', email: 'sandra.white@autocracy.com', role: 'GM Finance & Accounts' },
    
    // Department Managers
    { id: 'user-mgr-procurement', name: 'Daniel Kim', email: 'daniel.kim@autocracy.com', role: 'Procurement Manager' },
    { id: 'user-mgr-logistics', name: 'Laura Johnson', email: 'laura.johnson@autocracy.com', role: 'Logistics Manager' },
    { id: 'user-mgr-inventory', name: 'Chris Martin', email: 'chris.martin@autocracy.com', role: 'Inventory Manager' },
    { id: 'user-mgr-planning', name: 'Jessica Moore', email: 'jessica.moore@autocracy.com', role: 'Planning Manager' },
    { id: 'user-mgr-production-dept', name: 'Andrew Wilson', email: 'andrew.wilson@autocracy.com', role: 'Production Manager' },
    { id: 'user-mgr-machining', name: 'Michelle Davis', email: 'michelle.davis@autocracy.com', role: 'Machining Manager' },
    { id: 'user-mgr-finance', name: 'Steven Brown', email: 'steven.brown@autocracy.com', role: 'Finance Manager' },
    { id: 'user-mgr-accounts', name: 'Rachel Green', email: 'rachel.green@autocracy.com', role: 'Accounts Manager' },
    { id: 'user-mgr-product-dev', name: 'Brian Taylor', email: 'brian.taylor@autocracy.com', role: 'Product Development Manager' },
    { id: 'user-mgr-product-mgmt', name: 'Nicole Anderson', email: 'nicole.anderson@autocracy.com', role: 'Product Management Manager' },
    { id: 'user-mgr-product-monitoring', name: 'Eric Thomas', email: 'eric.thomas@autocracy.com', role: 'Product Monitoring Manager' },
    
    // Senior Managers & Specialists
    { id: 'user-senior-hr', name: 'Amanda Clark', email: 'amanda.clark@autocracy.com', role: 'Senior Manager HR' },
    { id: 'user-senior-sales', name: 'Mark Johnson', email: 'mark.johnson@autocracy.com', role: 'Senior Sales Manager' },
    { id: 'user-eng-prod', name: 'Timothy Lee', email: 'timothy.lee@autocracy.com', role: 'Production Engineer' },
    { id: 'user-eng-qc', name: 'Angela White', email: 'angela.white@autocracy.com', role: 'QC Engineer' },
    { id: 'user-eng-design', name: 'Kevin Zhang', email: 'kevin.zhang@autocracy.com', role: 'Design Engineer' },
    
    // Staff & Associates
    { id: 'user-exec-hr', name: 'Julie Martinez', email: 'julie.martinez@autocracy.com', role: 'HR Executive' },
    { id: 'user-exec-sales', name: 'Ryan Cooper', email: 'ryan.cooper@autocracy.com', role: 'Sales Executive' },
    { id: 'user-assistant-finance', name: 'Sophia Adams', email: 'sophia.adams@autocracy.com', role: 'Finance Assistant' },
    { id: 'user-analyst-product', name: 'Oliver Scott', email: 'oliver.scott@autocracy.com', role: 'Product Analyst' },
    
    // Trainees & Interns
    { id: 'user-get-1', name: 'Alex Johnson', email: 'alex.johnson@autocracy.com', role: 'Graduate Engineer Trainee' },
    { id: 'user-get-2', name: 'Emily Wilson', email: 'emily.wilson@autocracy.com', role: 'Graduate Engineer Trainee' },
    { id: 'user-intern-1', name: 'Sam Brown', email: 'sam.brown@autocracy.com', role: 'Intern' },
    { id: 'user-intern-2', name: 'Maya Patel', email: 'maya.patel@autocracy.com', role: 'Intern' },
  ]

  for (const user of users) {
    const userRef = doc(db, 'users', user.id)
    await setDoc(userRef, {
      id: user.id,
      companyId: COMPANY_ID,
      name: user.name,
      email: user.email,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true })
    userIds[user.role] = user.id
    console.log(`  ✓ Created user: ${user.name} (${user.role})`)
  }
  
  console.log(`✓ Created ${users.length} users`)
}

// Create departments
async function seedDepartments() {
  console.log('\n🏢 Creating departments...')
  
  const departments = [
    // Top Level
    { key: 'EXECUTIVE', name: 'Executive Office', code: 'EXEC', parent: null },
    
    // C-Suite Departments
    { key: 'CMO_DEPT', name: 'Chief Marketing Office', code: 'CMO', parent: 'EXECUTIVE' },
    { key: 'CSO_DEPT', name: 'Chief Sales Office', code: 'CSO', parent: 'EXECUTIVE' },
    { key: 'COO_DEPT', name: 'Chief Operating Office', code: 'COO', parent: 'EXECUTIVE' },
    { key: 'CFO_DEPT', name: 'Chief Finance Office', code: 'CFO', parent: 'EXECUTIVE' },
    { key: 'CTO_DEPT', name: 'Chief Technology Office', code: 'CTO', parent: 'EXECUTIVE' },
    
    // Under CMO
    { key: 'MARKETING', name: 'Marketing', code: 'MKT', parent: 'CMO_DEPT' },
    { key: 'DIGITAL_MKT', name: 'Digital Marketing', code: 'DMKT', parent: 'MARKETING' },
    
    // Under CSO
    { key: 'SALES', name: 'Sales', code: 'SALES', parent: 'CSO_DEPT' },
    { key: 'AFTER_SALES', name: 'After Sales', code: 'AFTERSALES', parent: 'CSO_DEPT' },
    
    // Under COO
    { key: 'SCM', name: 'Supply Chain Management', code: 'SCM', parent: 'COO_DEPT' },
    { key: 'PROCUREMENT', name: 'Procurement', code: 'PROC', parent: 'SCM' },
    { key: 'LOGISTICS', name: 'Logistics', code: 'LOG', parent: 'SCM' },
    { key: 'INVENTORY', name: 'Inventory', code: 'INV', parent: 'SCM' },
    
    { key: 'PRODUCTION', name: 'Production', code: 'PROD', parent: 'COO_DEPT' },
    { key: 'PLANNING', name: 'Planning', code: 'PLAN', parent: 'PRODUCTION' },
    { key: 'MANUFACTURING', name: 'Manufacturing', code: 'MFG', parent: 'PRODUCTION' },
    { key: 'MACHINING', name: 'Machining', code: 'MACH', parent: 'PRODUCTION' },
    
    // Under CFO
    { key: 'FINANCE', name: 'Finance', code: 'FIN', parent: 'CFO_DEPT' },
    { key: 'ACCOUNTS', name: 'Accounts', code: 'ACC', parent: 'CFO_DEPT' },
    
    // Under CTO
    { key: 'PRODUCT_DEV', name: 'Product Development', code: 'PDEV', parent: 'CTO_DEPT' },
    { key: 'PRODUCT_MGMT', name: 'Product Management', code: 'PMGMT', parent: 'CTO_DEPT' },
    { key: 'PRODUCT_MONITORING', name: 'Product Monitoring', code: 'PMON', parent: 'CTO_DEPT' },
    
    // Support Departments
    { key: 'HR_ADMIN', name: 'HR & Administration', code: 'HR', parent: 'CMO_DEPT' },
    { key: 'QUALITY_CONTROL', name: 'Quality Control', code: 'QC', parent: 'COO_DEPT' },
    { key: 'SERVICE', name: 'Service', code: 'SRV', parent: 'CSO_DEPT' },
  ]

  for (const dept of departments) {
    const parentId = dept.parent ? (departmentIds[dept.parent] || null) : null
    const deptData = await createDepartment(
      COMPANY_ID,
      {
        companyId: COMPANY_ID,
        name: dept.name,
        code: dept.code,
        description: `${dept.name} department`,
        parentDepartmentId: parentId,
        status: 'active',
        location: 'Main Facility',
        createdBy: ADMIN_USER_ID,
        updatedBy: ADMIN_USER_ID,
      },
      ADMIN_USER_ID
    )
    departmentIds[dept.key] = deptData.id
    console.log(`  ✓ Created department: ${dept.name} (${dept.code})`)
  }
  
  console.log(`✓ Created ${departments.length} departments`)
}

// Create positions with hierarchy
async function seedPositions() {
  console.log('\n👔 Creating positions...')
  
  const positions = [
    // === TOP LEVEL ===
    { key: 'CEO', dept: 'EXECUTIVE', title: 'Chief Executive Officer', code: 'CEO-001', level: 1, reportsTo: null, user: 'CEO' },
    { key: 'SPOC', dept: 'EXECUTIVE', title: 'Single Point of Contact', code: 'SPOC-001', level: 2, reportsTo: 'CEO', user: 'SPOC' },
    
    // === C-SUITE ===
    { key: 'CMO', dept: 'CMO_DEPT', title: 'Chief Marketing Officer', code: 'CMO-001', level: 2, reportsTo: 'CEO', user: 'CMO' },
    { key: 'CSO', dept: 'CSO_DEPT', title: 'Chief Sales Officer', code: 'CSO-001', level: 2, reportsTo: 'CEO', user: 'CSO' },
    { key: 'COO', dept: 'COO_DEPT', title: 'Chief Operating Officer', code: 'COO-001', level: 2, reportsTo: 'CEO', user: 'COO' },
    { key: 'CFO', dept: 'CFO_DEPT', title: 'Chief Finance Officer', code: 'CFO-001', level: 2, reportsTo: 'CEO', user: 'CFO' },
    { key: 'CTO', dept: 'CTO_DEPT', title: 'Chief Technical Officer', code: 'CTO-001', level: 2, reportsTo: 'CEO', user: 'CTO' },
    
    // === VICE PRESIDENTS ===
    { key: 'VP_MARKETING', dept: 'MARKETING', title: 'Vice President - Marketing', code: 'VP-MKT-001', level: 3, reportsTo: 'CMO', user: 'VP Marketing' },
    { key: 'VP_SALES', dept: 'SALES', title: 'Vice President - Sales', code: 'VP-SALES-001', level: 3, reportsTo: 'CSO', user: 'VP Sales' },
    { key: 'VP_SCM', dept: 'SCM', title: 'Vice President - SCM', code: 'VP-SCM-001', level: 3, reportsTo: 'COO', user: 'VP SCM' },
    { key: 'VP_PRODUCTION', dept: 'PRODUCTION', title: 'Vice President - Production', code: 'VP-PROD-001', level: 3, reportsTo: 'COO', user: 'VP Production' },
    { key: 'VP_PRODUCT', dept: 'PRODUCT_DEV', title: 'Vice President - Product', code: 'VP-PDEV-001', level: 3, reportsTo: 'CTO', user: 'VP Product' },
    
    // === GENERAL MANAGERS ===
    { key: 'GM_HR', dept: 'HR_ADMIN', title: 'General Manager - HR & Admin', code: 'GM-HR-001', level: 4, reportsTo: 'VP_MARKETING', user: 'GM HR & Admin' },
    { key: 'GM_SALES', dept: 'SALES', title: 'General Manager - Sales', code: 'GM-SALES-001', level: 4, reportsTo: 'VP_SALES', user: 'GM Sales' },
    { key: 'GM_AFTERSALES', dept: 'AFTER_SALES', title: 'General Manager - After Sales', code: 'GM-AS-001', level: 4, reportsTo: 'VP_SALES', user: 'GM After Sales' },
    { key: 'GM_QC', dept: 'QUALITY_CONTROL', title: 'General Manager - QC', code: 'GM-QC-001', level: 4, reportsTo: 'VP_PRODUCTION', user: 'GM Quality Control' },
    { key: 'GM_SERVICE', dept: 'SERVICE', title: 'General Manager - Service', code: 'GM-SRV-001', level: 4, reportsTo: 'VP_SALES', user: 'GM Service' },
    { key: 'GM_SCM', dept: 'SCM', title: 'General Manager - SCM', code: 'GM-SCM-001', level: 4, reportsTo: 'VP_SCM', user: 'GM SCM' },
    { key: 'GM_PRODUCTION', dept: 'PRODUCTION', title: 'General Manager - Production', code: 'GM-PROD-001', level: 4, reportsTo: 'VP_PRODUCTION', user: 'GM Production' },
    { key: 'GM_FINANCE', dept: 'FINANCE', title: 'General Manager - Finance & Accounts', code: 'GM-FIN-001', level: 4, reportsTo: 'CFO', user: 'GM Finance & Accounts' },
    
    // === DEPARTMENT MANAGERS ===
    // SCM Managers
    { key: 'MGR_PROCUREMENT', dept: 'PROCUREMENT', title: 'Manager - Procurement', code: 'MGR-PROC-001', level: 5, reportsTo: 'GM_SCM', user: 'Procurement Manager' },
    { key: 'MGR_LOGISTICS', dept: 'LOGISTICS', title: 'Manager - Logistics', code: 'MGR-LOG-001', level: 5, reportsTo: 'GM_SCM', user: 'Logistics Manager' },
    { key: 'MGR_INVENTORY', dept: 'INVENTORY', title: 'Manager - Inventory', code: 'MGR-INV-001', level: 5, reportsTo: 'GM_SCM', user: 'Inventory Manager' },
    
    // Production Managers
    { key: 'MGR_PLANNING', dept: 'PLANNING', title: 'Manager - Planning', code: 'MGR-PLAN-001', level: 5, reportsTo: 'GM_PRODUCTION', user: 'Planning Manager' },
    { key: 'MGR_MANUFACTURING', dept: 'MANUFACTURING', title: 'Manager - Production', code: 'MGR-MFG-001', level: 5, reportsTo: 'GM_PRODUCTION', user: 'Production Manager' },
    { key: 'MGR_MACHINING', dept: 'MACHINING', title: 'Manager - Machining', code: 'MGR-MACH-001', level: 5, reportsTo: 'GM_PRODUCTION', user: 'Machining Manager' },
    
    // Finance Managers
    { key: 'MGR_FINANCE', dept: 'FINANCE', title: 'Manager - Finance', code: 'MGR-FIN-001', level: 5, reportsTo: 'GM_FINANCE', user: 'Finance Manager' },
    { key: 'MGR_ACCOUNTS', dept: 'ACCOUNTS', title: 'Manager - Accounts', code: 'MGR-ACC-001', level: 5, reportsTo: 'GM_FINANCE', user: 'Accounts Manager' },
    
    // Product Managers
    { key: 'MGR_PRODUCT_DEV', dept: 'PRODUCT_DEV', title: 'Manager - Product Development', code: 'MGR-PDEV-001', level: 5, reportsTo: 'VP_PRODUCT', user: 'Product Development Manager' },
    { key: 'MGR_PRODUCT_MGMT', dept: 'PRODUCT_MGMT', title: 'Manager - Product Management', code: 'MGR-PMGMT-001', level: 5, reportsTo: 'VP_PRODUCT', user: 'Product Management Manager' },
    { key: 'MGR_PRODUCT_MON', dept: 'PRODUCT_MONITORING', title: 'Manager - Product Monitoring', code: 'MGR-PMON-001', level: 5, reportsTo: 'VP_PRODUCT', user: 'Product Monitoring Manager' },
    
    // === SENIOR MANAGERS ===
    { key: 'SR_MGR_HR', dept: 'HR_ADMIN', title: 'Senior Manager - HR', code: 'SRMGR-HR-001', level: 6, reportsTo: 'GM_HR', user: 'Senior Manager HR' },
    { key: 'SR_MGR_SALES', dept: 'SALES', title: 'Senior Manager - Sales', code: 'SRMGR-SALES-001', level: 6, reportsTo: 'GM_SALES', user: 'Senior Sales Manager' },
    
    // === ENGINEERS ===
    { key: 'ENG_PRODUCTION', dept: 'MANUFACTURING', title: 'Production Engineer', code: 'ENG-PROD-001', level: 6, reportsTo: 'MGR_MANUFACTURING', user: 'Production Engineer' },
    { key: 'ENG_QC', dept: 'QUALITY_CONTROL', title: 'QC Engineer', code: 'ENG-QC-001', level: 6, reportsTo: 'GM_QC', user: 'QC Engineer' },
    { key: 'ENG_DESIGN', dept: 'PRODUCT_DEV', title: 'Design Engineer', code: 'ENG-DES-001', level: 6, reportsTo: 'MGR_PRODUCT_DEV', user: 'Design Engineer' },
    
    // === EXECUTIVES ===
    { key: 'EXEC_HR', dept: 'HR_ADMIN', title: 'HR Executive', code: 'EXEC-HR-001', level: 7, reportsTo: 'SR_MGR_HR', user: 'HR Executive' },
    { key: 'EXEC_SALES', dept: 'SALES', title: 'Sales Executive', code: 'EXEC-SALES-001', level: 7, reportsTo: 'SR_MGR_SALES', user: 'Sales Executive' },
    
    // === ASSISTANTS & ANALYSTS ===
    { key: 'ASST_FINANCE', dept: 'FINANCE', title: 'Assistant Manager - Finance', code: 'ASST-FIN-001', level: 7, reportsTo: 'MGR_FINANCE', user: 'Finance Assistant' },
    { key: 'ANALYST_PRODUCT', dept: 'PRODUCT_MONITORING', title: 'Product Analyst', code: 'ANLST-PMON-001', level: 7, reportsTo: 'MGR_PRODUCT_MON', user: 'Product Analyst' },
    
    // === TRAINEES & INTERNS ===
    { key: 'GET_1', dept: 'MANUFACTURING', title: 'Graduate Engineer Trainee', code: 'GET-001', level: 8, reportsTo: 'ENG_PRODUCTION', user: 'Graduate Engineer Trainee' },
    { key: 'GET_2', dept: 'PRODUCT_DEV', title: 'Graduate Engineer Trainee', code: 'GET-002', level: 8, reportsTo: 'ENG_DESIGN', user: 'Graduate Engineer Trainee' },
    { key: 'INTERN_1', dept: 'HR_ADMIN', title: 'HR Intern', code: 'INTERN-001', level: 9, reportsTo: 'EXEC_HR', user: 'Intern' },
    { key: 'INTERN_2', dept: 'SALES', title: 'Sales Intern', code: 'INTERN-002', level: 9, reportsTo: 'EXEC_SALES', user: 'Intern' },
  ]

  for (const pos of positions) {
    if (!departmentIds[pos.dept]) {
      throw new Error(`Department ${pos.dept} not found for position ${pos.title}`)
    }
    
    const posData = await createPosition(
      COMPANY_ID,
      {
        companyId: COMPANY_ID,
        departmentId: departmentIds[pos.dept],
        title: pos.title,
        code: pos.code,
        description: `${pos.title} position`,
        level: pos.level,
        scope: {
          type: 'all',
          departments: [],
          locations: [],
          productLines: [],
          projectTypes: [],
          functions: [],
        },
        responsibilities: [`Manage ${pos.title.toLowerCase()} tasks and team`],
        requiredSkills: ['Leadership', 'Communication'],
        optionalSkills: ['Project Management'],
        certifications: [],
        reportsToPositionId: pos.reportsTo ? (positionIds[pos.reportsTo] || null) : null,
        employmentType: 'full_time',
        headcount: 1,
        approvalAuthority: {
          canApproveExpenses: pos.level <= 5,
          maxExpenseAmount: pos.level <= 3 ? 100000 : 10000,
          canApproveTimeOff: pos.level <= 5,
          canApproveProjects: pos.level <= 4,
        },
        status: 'active',
        createdBy: ADMIN_USER_ID,
        updatedBy: ADMIN_USER_ID,
      },
      ADMIN_USER_ID
    )
    positionIds[pos.key] = posData.id
    console.log(`  ✓ Created position: ${pos.title} (Level ${pos.level})`)
  }
  
  console.log(`✓ Created ${positions.length} positions`)
}

// Assign users to positions
async function seedAssignments() {
  console.log('\n📝 Creating position assignments...')
  
  const assignments = [
    { position: 'CEO', user: 'CEO' },
    { position: 'SPOC', user: 'SPOC' },
    { position: 'CMO', user: 'CMO' },
    { position: 'CSO', user: 'CSO' },
    { position: 'COO', user: 'COO' },
    { position: 'CFO', user: 'CFO' },
    { position: 'CTO', user: 'CTO' },
    { position: 'VP_MARKETING', user: 'VP Marketing' },
    { position: 'VP_SALES', user: 'VP Sales' },
    { position: 'VP_SCM', user: 'VP SCM' },
    { position: 'VP_PRODUCTION', user: 'VP Production' },
    { position: 'VP_PRODUCT', user: 'VP Product' },
    { position: 'GM_HR', user: 'GM HR & Admin' },
    { position: 'GM_SALES', user: 'GM Sales' },
    { position: 'GM_AFTERSALES', user: 'GM After Sales' },
    { position: 'GM_QC', user: 'GM Quality Control' },
    { position: 'GM_SERVICE', user: 'GM Service' },
    { position: 'GM_SCM', user: 'GM SCM' },
    { position: 'GM_PRODUCTION', user: 'GM Production' },
    { position: 'GM_FINANCE', user: 'GM Finance & Accounts' },
    { position: 'MGR_PROCUREMENT', user: 'Procurement Manager' },
    { position: 'MGR_LOGISTICS', user: 'Logistics Manager' },
    { position: 'MGR_INVENTORY', user: 'Inventory Manager' },
    { position: 'MGR_PLANNING', user: 'Planning Manager' },
    { position: 'MGR_MANUFACTURING', user: 'Production Manager' },
    { position: 'MGR_MACHINING', user: 'Machining Manager' },
    { position: 'MGR_FINANCE', user: 'Finance Manager' },
    { position: 'MGR_ACCOUNTS', user: 'Accounts Manager' },
    { position: 'MGR_PRODUCT_DEV', user: 'Product Development Manager' },
    { position: 'MGR_PRODUCT_MGMT', user: 'Product Management Manager' },
    { position: 'MGR_PRODUCT_MON', user: 'Product Monitoring Manager' },
    { position: 'SR_MGR_HR', user: 'Senior Manager HR' },
    { position: 'SR_MGR_SALES', user: 'Senior Sales Manager' },
    { position: 'ENG_PRODUCTION', user: 'Production Engineer' },
    { position: 'ENG_QC', user: 'QC Engineer' },
    { position: 'ENG_DESIGN', user: 'Design Engineer' },
    { position: 'EXEC_HR', user: 'HR Executive' },
    { position: 'EXEC_SALES', user: 'Sales Executive' },
    { position: 'ASST_FINANCE', user: 'Finance Assistant' },
    { position: 'ANALYST_PRODUCT', user: 'Product Analyst' },
    { position: 'GET_1', user: 'Graduate Engineer Trainee' },
    { position: 'GET_2', user: 'Graduate Engineer Trainee' },
    { position: 'INTERN_1', user: 'Intern' },
    { position: 'INTERN_2', user: 'Intern' },
  ]

  for (const assignment of assignments) {
    await assignUserToPosition(
      COMPANY_ID,
      positionIds[assignment.position],
      userIds[assignment.user],
      {
        assignmentType: 'permanent',
        startAt: new Date().toISOString(),
        endAt: null,
        reason: 'Initial organization setup',
        notes: 'Assigned during org structure seeding',
      },
      ADMIN_USER_ID
    )
    console.log(`  ✓ Assigned ${assignment.user} to ${assignment.position}`)
  }
  
  console.log(`✓ Created ${assignments.length} assignments`)
}

// Main seed function
async function seedManufacturingOrg() {
  console.log('🚀 Starting Manufacturing Org Structure Seeding...')
  console.log(`📍 Company ID: ${COMPANY_ID}`)
  
  try {
    await ensureCompanyExists()
    await seedUsers()
    await seedDepartments()
    await seedPositions()
    await seedAssignments()
    
    console.log('\n✅ Manufacturing Org Structure seeding completed successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Departments: ${Object.keys(departmentIds).length}`)
    console.log(`   - Positions: ${Object.keys(positionIds).length}`)
    console.log(`   - Users: ${Object.keys(userIds).length}`)
    console.log(`\n🎯 Organization structure is ready for use!`)
    
  } catch (error) {
    console.error('❌ Error seeding org structure:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

// Run the seed function
seedManufacturingOrg()

