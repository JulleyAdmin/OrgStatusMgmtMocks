import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { db, auth } from './firebase'
import { User } from '../types'

const convertTimestamps = (data: any): any => {
  if (!data) return data
  const converted = { ...data }
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate().toISOString()
    } else if (typeof converted[key] === 'object' && converted[key] !== null) {
      converted[key] = convertTimestamps(converted[key])
    }
  })
  return converted
}

export class UserService {
  static async getUsers(companyId: string): Promise<User[]> {
    try {
      const usersRef = collection(db, `companies/${companyId}/users`)
      const usersQuery = query(usersRef, orderBy('name', 'asc'))
      const querySnapshot = await getDocs(usersQuery)
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          email: data.email || '',
          name: data.name || 'Unknown User',
          role: data.role || 'employee',
          department: data.department || 'Unknown Department',
          position: data.position || 'Unknown Position',
          avatar: data.avatar || null,
          skills: Array.isArray(data.skills) ? data.skills : [],
          contact: {
            phone: data.contact?.phone || 'Not provided',
            slack: data.contact?.slack || 'Not provided'
          },
          ...convertTimestamps(data)
        } as User
      })
    } catch (error) {
      console.error('Error getting users:', error)
      throw error
    }
  }

  static async getUser(companyId: string, userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, `companies/${companyId}/users`, userId)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        const data = userSnap.data()
        return {
          id: userSnap.id,
          email: data.email || '',
          name: data.name || 'Unknown User',
          role: data.role || 'employee',
          department: data.department || 'Unknown Department',
          position: data.position || 'Unknown Position',
          avatar: data.avatar || null,
          skills: Array.isArray(data.skills) ? data.skills : [],
          contact: {
            phone: data.contact?.phone || 'Not provided',
            slack: data.contact?.slack || 'Not provided'
          },
          ...convertTimestamps(data)
        } as User
      }
      return null
    } catch (error) {
      console.error('Error getting user:', error)
      throw error
    }
  }

  static async createUser(companyId: string, userData: Omit<User, 'id'> & { password: string }): Promise<User> {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const firebaseUser = userCredential.user
      
      // Create user document in Firestore
      const usersRef = collection(db, `companies/${companyId}/users`)
      const userDocData = {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        department: userData.department,
        position: userData.position,
        avatar: userData.avatar,
        skills: userData.skills,
        contact: userData.contact,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
      
      const docRef = await addDoc(usersRef, userDocData)
      
      // Return the created user object
      return {
        id: docRef.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        department: userData.department,
        position: userData.position,
        avatar: userData.avatar,
        skills: userData.skills,
        contact: userData.contact,
        createdAt: userDocData.createdAt.toDate().toISOString(),
        updatedAt: userDocData.updatedAt.toDate().toISOString()
      } as User
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  static async updateUser(companyId: string, userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, `companies/${companyId}/users`, userId)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  static async deleteUser(companyId: string, userId: string): Promise<void> {
    try {
      const userRef = doc(db, `companies/${companyId}/users`, userId)
      await deleteDoc(userRef)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }
}
