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
          userData = {
            id: user.uid,
            ...userDoc.data(),
            createdAt: userDoc.data().createdAt.toDate().toISOString(),
            updatedAt: userDoc.data().updatedAt.toDate().toISOString()
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
              userData = {
                id: firebaseUser.uid,
                ...userDoc.data(),
                createdAt: userDoc.data().createdAt.toDate().toISOString(),
                updatedAt: userDoc.data().updatedAt.toDate().toISOString()
              } as User
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
