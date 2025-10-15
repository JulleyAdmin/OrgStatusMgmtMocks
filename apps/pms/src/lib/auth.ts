import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User } from '../types'

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        return {
          id: user.uid,
          ...userDoc.data(),
          createdAt: userDoc.data().createdAt.toDate(),
          updatedAt: userDoc.data().updatedAt.toDate()
        } as User
      }
      
      return null
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
        ...userDoc
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
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = {
              id: firebaseUser.uid,
              ...userDoc.data(),
              createdAt: userDoc.data().createdAt.toDate(),
              updatedAt: userDoc.data().updatedAt.toDate()
            } as User
            callback(userData)
          } else {
            callback(null)
          }
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
