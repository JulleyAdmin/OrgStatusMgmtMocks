import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User } from '../types'

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Get user data from Firestore - check in companies collection
      // First, try to find the user in any company
      const companiesSnapshot = await getDocs(collection(db, 'companies'))
      let userData = null
      
      for (const companyDoc of companiesSnapshot.docs) {
        const userDoc = await getDoc(doc(db, `companies/${companyDoc.id}/users`, user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          
          // Handle both Timestamp and string formats for dates
          const createdAt = typeof data.createdAt === 'string' 
            ? data.createdAt 
            : data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
          
          const updatedAt = typeof data.updatedAt === 'string'
            ? data.updatedAt
            : data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
          
          userData = {
            id: user.uid,
            ...data,
            createdAt,
            updatedAt
          } as User
          break
        }
      }
      
      return userData
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  async signUp(email: string, password: string, userData: Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Create user document in Firestore
      const now = new Date()
      const userDoc = {
        ...userData,
        email,
        createdAt: now,
        updatedAt: now
      }
      
      await setDoc(doc(db, 'users', user.uid), userDoc)
      
      return {
        id: user.uid,
        ...userDoc,
        createdAt: userDoc.createdAt.toISOString(),
        updatedAt: userDoc.updatedAt.toISOString()
      } as User
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },

  async signOut() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore - check in companies collection
          const companiesSnapshot = await getDocs(collection(db, 'companies'))
          let userData = null
          
          for (const companyDoc of companiesSnapshot.docs) {
            const userDoc = await getDoc(doc(db, `companies/${companyDoc.id}/users`, firebaseUser.uid))
            if (userDoc.exists()) {
              const data = userDoc.data()
              
              // Handle both Timestamp and string formats for dates
              const createdAt = typeof data.createdAt === 'string' 
                ? data.createdAt 
                : data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
              
              const updatedAt = typeof data.updatedAt === 'string'
                ? data.updatedAt
                : data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
              
              userData = {
                id: firebaseUser.uid,
                ...data,
                createdAt,
                updatedAt
              } as User
              
              // Generate tasks for the user on login (for immediate assignment mode)
              try {
                const { PositionTaskAssignmentService } = await import('./position-task-assignment-service')
                await PositionTaskAssignmentService.generateTasksOnUserLogin(
                  userData.companyId,
                  userData.id
                )
                console.log(`Generated tasks for user ${userData.id} on login`)
              } catch (error) {
                console.error('Error generating tasks on login:', error)
                // Don't block login if task generation fails
              }
              
              break
            }
          }
          
          callback(userData)
        } catch (error) {
          console.error('Error fetching user data:', error)
          callback(null)
        }
      } else {
        callback(null)
      }
    })
  }
}
