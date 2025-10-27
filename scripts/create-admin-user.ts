// Script to create admin@julley.com user
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { User } from '../types';

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

// Admin user data for admin@julley.com
const adminUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  email: 'admin@julley.com',
  name: 'Julley Admin',
  role: 'admin',
  department: 'Executive',
  position: 'System Administrator',
  companyId: 'default-company-id',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  skills: ['System Administration', 'Project Management', 'Team Leadership', 'Technical Architecture'],
  contact: { 
    phone: '555-0123', 
    slack: '@julley.admin' 
  }
};

async function createAdminUser() {
  console.log('🔐 Creating admin@julley.com user...');
  
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...adminUser,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    console.log(`✅ Created admin user: ${adminUser.name} (${docRef.id})`);
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: You'll need to create this user in Firebase Auth console`);
    console.log(`🌐 Firebase Console: https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/users`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
