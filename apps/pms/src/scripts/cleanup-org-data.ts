// Cleanup script to remove all org data from a company
// This is useful when you need to re-seed the data

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore'

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

async function deleteCollection(collectionPath: string) {
  const collectionRef = collection(db, 'companies', COMPANY_ID, collectionPath)
  const snapshot = await getDocs(collectionRef)
  
  if (snapshot.empty) {
    console.log(`  No documents in ${collectionPath}`)
    return 0
  }

  // Delete in batches of 500 (Firestore limit)
  const batches = []
  let batch = writeBatch(db)
  let count = 0

  snapshot.docs.forEach((document, index) => {
    batch.delete(document.ref)
    count++

    if ((index + 1) % 500 === 0) {
      batches.push(batch)
      batch = writeBatch(db)
    }
  })

  // Push the last batch if it has operations
  if (count % 500 !== 0) {
    batches.push(batch)
  }

  // Commit all batches
  await Promise.all(batches.map(b => b.commit()))

  return count
}

async function cleanupOrgData() {
  console.log('🧹 Starting cleanup of org data...')
  console.log(`📍 Company ID: ${COMPANY_ID}`)
  
  try {
    console.log('\n🗑️  Deleting position assignments...')
    const assignmentsCount = await deleteCollection('positionAssignments')
    console.log(`  ✓ Deleted ${assignmentsCount} position assignments`)

    console.log('\n🗑️  Deleting positions...')
    const positionsCount = await deleteCollection('positions')
    console.log(`  ✓ Deleted ${positionsCount} positions`)

    console.log('\n🗑️  Deleting departments...')
    const departmentsCount = await deleteCollection('departments')
    console.log(`  ✓ Deleted ${departmentsCount} departments`)

    console.log('\n🗑️  Deleting delegations...')
    const delegationsCount = await deleteCollection('delegations')
    console.log(`  ✓ Deleted ${delegationsCount} delegations`)

    console.log('\n🗑️  Deleting org audit logs...')
    const auditLogsCount = await deleteCollection('orgAuditLogs')
    console.log(`  ✓ Deleted ${auditLogsCount} org audit logs`)

    // Also clean up users that were created by the seed script
    console.log('\n🗑️  Deleting seeded users...')
    const usersRef = collection(db, 'users')
    const usersSnapshot = await getDocs(usersRef)
    
    let usersCount = 0
    const userBatch = writeBatch(db)
    
    usersSnapshot.docs.forEach((userDoc) => {
      const userData = userDoc.data()
      // Only delete users that were created by seed script (those with companyId = COMPANY_ID)
      if (userData.companyId === COMPANY_ID) {
        userBatch.delete(userDoc.ref)
        usersCount++
      }
    })

    if (usersCount > 0) {
      await userBatch.commit()
      console.log(`  ✓ Deleted ${usersCount} users`)
    } else {
      console.log(`  No users to delete`)
    }

    console.log('\n✅ Cleanup completed successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Position Assignments: ${assignmentsCount}`)
    console.log(`   - Positions: ${positionsCount}`)
    console.log(`   - Departments: ${departmentsCount}`)
    console.log(`   - Delegations: ${delegationsCount}`)
    console.log(`   - Audit Logs: ${auditLogsCount}`)
    console.log(`   - Users: ${usersCount}`)
    console.log(`\n🎯 Ready for fresh seeding!`)
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

// Run the cleanup
cleanupOrgData()

