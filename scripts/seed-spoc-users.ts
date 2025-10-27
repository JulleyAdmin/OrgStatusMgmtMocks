// Seed script to create SPOC users with Firebase Authentication
// Based on the SPOC list for Autocracy Machinery

// Load environment variables from .env.local
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import * as admin from 'firebase-admin'

// Firebase config (client SDK for Firestore)
const firebaseConfig = {
  apiKey: "AIzaSyATFR7e2t1aaP7OJlMODFn7vnya1e8tQdc",
  authDomain: "julley-platform-dev.firebaseapp.com",
  projectId: "julley-platform-dev",
  storageBucket: "julley-platform-dev.firebasestorage.app",
  messagingSenderId: "46276910499",
  appId: "1:46276910499:web:433453e451cd33aea84e16",
  measurementId: "G-NCSHHHZ9QF"
}

// Initialize Firebase Admin SDK (for Auth)
// Using environment variables: FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY
if (!admin.apps.length) {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  
  if (!clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Please set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables.'
    )
  }

  // Replace escaped newlines in private key
  const formattedPrivateKey = privateKey.replace(/\\n/g, '\n')

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "julley-platform-dev",
      clientEmail: clientEmail,
      privateKey: formattedPrivateKey,
    }),
    projectId: "julley-platform-dev"
  })
  
  console.log('✓ Firebase Admin SDK initialized with environment credentials')
}

const adminAuth = admin.auth()

// Initialize Firebase Client SDK (for Firestore)
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const COMPANY_ID = 'SU6Svsf6iVGdopeWKFqQ'
const DEFAULT_PASSWORD = 'autocracy@2025' // Strong default password
const REQUIRE_PASSWORD_CHANGE = true // Force password change on first login

// SPOC Users from the provided list
const spocUsers = [
  {
    name: 'Praneeth Divya',
    email: 'praneeth@autocracymachinery.com',
    phone: '9010617403',
    departments: ['ADMINISTRATION', 'SALES & MARKETING', 'INVESTORS'],
    teams: ['Management', 'Sales', 'Marketing', 'Investors'],
    role: 'spoc',
    displayName: 'Praneeth'
  },
  {
    name: 'Divya',
    email: 'divya@autocracymachinery.com',
    phone: '6309534939',
    departments: ['ADMINISTRATION', 'SUPPORT CENTER', 'R&D LINE', 'SALES & MARKETING'],
    teams: ['HR & Admin', 'Logistics', 'Service', 'PMT', 'PDT', 'PMG', 'After Sales'],
    role: 'spoc',
    displayName: 'Divya'
  },
  {
    name: 'Swathi',
    email: 'swathi@autocracymachinery.com',
    phone: '9502604695',
    departments: ['ADMINISTRATION', 'OPERATIONAL-OUTLAY'],
    teams: ['Finance', 'Accounts', 'Legal', 'Operations', 'LAXSUS'],
    role: 'spoc',
    displayName: 'Swathi'
  },
  {
    name: 'RajGopal',
    email: 'raj@autocracymachinery.com',
    phone: '8919286433',
    departments: ['SUPPORT CENTER', 'PRODUCTION LINE-1', 'PRODUCTION LINE-2'],
    teams: ['QC', 'Inventory', 'Procurement', 'Production', 'Machining'],
    role: 'spoc',
    displayName: 'RajGopal'
  }
]

interface CreateUserResult {
  uid: string
  email: string
  success: boolean
  error?: string
}

async function createFirebaseAuthUser(
  email: string,
  password: string,
  displayName: string,
  phoneNumber: string
): Promise<CreateUserResult> {
  try {
    // Check if user already exists
    let userRecord
    try {
      userRecord = await adminAuth.getUserByEmail(email)
      console.log(`  ℹ️  User ${email} already exists in Firebase Auth (UID: ${userRecord.uid})`)
      return { uid: userRecord.uid, email, success: true }
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        throw error
      }
    }

    // Create new user
    userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      phoneNumber: phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`,
      emailVerified: false, // Set to false, users will verify on first login
    })

    console.log(`  ✓ Created Firebase Auth user: ${email} (UID: ${userRecord.uid})`)

    // Optional: Send password reset email so users can set their own password
    if (REQUIRE_PASSWORD_CHANGE) {
      try {
        const resetLink = await adminAuth.generatePasswordResetLink(email)
        console.log(`  📧 Password reset link for ${email}:`)
        console.log(`     ${resetLink}`)
      } catch (error) {
        console.warn(`  ⚠️  Could not generate password reset link for ${email}`)
      }
    }

    return { uid: userRecord.uid, email, success: true }
  } catch (error: any) {
    console.error(`  ❌ Error creating Firebase Auth user ${email}:`, error.message)
    return { uid: '', email, success: false, error: error.message }
  }
}

async function createFirestoreUser(
  uid: string,
  userData: typeof spocUsers[0]
): Promise<void> {
  try {
    // Create user under companies/{companyId}/users/{uid}
    const userRef = doc(db, 'companies', COMPANY_ID, 'users', uid)
    await setDoc(userRef, {
      id: uid,
      companyId: COMPANY_ID,
      name: userData.name,
      displayName: userData.displayName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: 'active',
      emailVerified: false,
      
      // SPOC-specific fields
      spocDepartments: userData.departments,
      spocTeams: userData.teams,
      
      // Metadata
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
      
      // Permissions
      permissions: {
        canViewAllDepartments: true,
        canManageTeams: true,
        canViewReports: true,
        canApproveRequests: true,
        isSpoc: true,
      }
    }, { merge: true })

    console.log(`  ✓ Created Firestore user document at companies/${COMPANY_ID}/users/${uid}`)
  } catch (error: any) {
    console.error(`  ❌ Error creating Firestore user ${userData.email}:`, error.message)
    throw error
  }
}

async function addToCompanyUsers(
  uid: string,
  userData: typeof spocUsers[0]
): Promise<void> {
  try {
    const companyUserRef = doc(db, 'companies', COMPANY_ID, 'companyUsers', uid)
    await setDoc(companyUserRef, {
      id: uid,
      userId: uid,
      companyId: COMPANY_ID,
      email: userData.email,
      role: 'admin', // SPOCs are typically admins
      status: 'active',
      
      // Permissions specific to this company
      permissions: {
        canManageUsers: true,
        canManageProjects: true,
        canManageDepartments: true,
        canViewReports: true,
        canManageSettings: false, // Reserved for super admin
        canApproveExpenses: true,
        canManageWorkflows: true,
      },
      
      // SPOC information
      spocDepartments: userData.departments,
      spocTeams: userData.teams,
      
      invitedAt: new Date().toISOString(),
      joinedAt: new Date().toISOString(),
      invitedBy: 'system',
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true })

    console.log(`  ✓ Added ${userData.email} to company users`)
  } catch (error: any) {
    console.error(`  ❌ Error adding to company users ${userData.email}:`, error.message)
    throw error
  }
}

async function seedSPOCUsers() {
  console.log('🚀 Starting SPOC Users Seeding...')
  console.log(`📍 Company ID: ${COMPANY_ID}`)
  console.log(`🔑 Default Password: ${DEFAULT_PASSWORD}`)
  console.log(`⚠️  Users should change password on first login\n`)

  const results = {
    total: spocUsers.length,
    authSuccess: 0,
    authFailed: 0,
    firestoreSuccess: 0,
    firestoreFailed: 0,
  }

  for (const userData of spocUsers) {
    console.log(`\n👤 Processing: ${userData.name} (${userData.email})`)
    
    try {
      // Step 1: Create Firebase Auth user
      const authResult = await createFirebaseAuthUser(
        userData.email,
        DEFAULT_PASSWORD,
        userData.displayName,
        userData.phone
      )

      if (!authResult.success) {
        results.authFailed++
        continue
      }

      results.authSuccess++
      const uid = authResult.uid

      // Step 2: Create Firestore user document
      await createFirestoreUser(uid, userData)
      results.firestoreSuccess++

      // Step 3: Add to company users
      await addToCompanyUsers(uid, userData)

      console.log(`  ✅ Successfully created complete user profile for ${userData.email}`)

    } catch (error: any) {
      console.error(`  ❌ Failed to create user ${userData.email}:`, error.message)
      results.firestoreFailed++
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Seeding Summary')
  console.log('='.repeat(60))
  console.log(`Total Users: ${results.total}`)
  console.log(`✅ Firebase Auth Created: ${results.authSuccess}`)
  console.log(`❌ Firebase Auth Failed: ${results.authFailed}`)
  console.log(`✅ Firestore Documents Created: ${results.firestoreSuccess}`)
  console.log(`❌ Firestore Documents Failed: ${results.firestoreFailed}`)
  console.log('='.repeat(60))

  if (REQUIRE_PASSWORD_CHANGE) {
    console.log('\n📧 Password Reset Links:')
    console.log('Password reset links have been generated above.')
    console.log('Share these links with users so they can set their own passwords.')
  }

  console.log('\n✨ SPOC Users seeding completed!')
  console.log(`\n🔐 Default Password: ${DEFAULT_PASSWORD}`)
  console.log('⚠️  Remember to share password reset links with users!')
}

// Run the seed function
seedSPOCUsers()
  .then(() => {
    console.log('\n✅ All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })

