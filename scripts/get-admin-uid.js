// Script to get the admin user UID from Firebase Authentication
// Run this script to get the UID needed for Firestore rules

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "your_api_key_here",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Admin credentials
const adminEmail = "leticia@exemplo.com";
const adminPassword = "casei";

async function getAdminUID() {
  try {
    console.log('🔐 Signing in as admin...');
    
    // Sign in as admin
    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log('✅ Successfully signed in!');
    console.log('👤 Admin UID:', user.uid);
    console.log('📧 Admin Email:', user.email);
    
    console.log('\n📋 Next steps:');
    console.log('1. Copy the UID above');
    console.log('2. Go to Firebase Console > Firestore Database > Rules');
    console.log('3. Replace "ADMIN_UID_AQUI" with the UID above');
    console.log('4. Click "Publish" to deploy the rules');
    
    console.log('\n🔧 Updated Firestore rules should look like:');
    console.log(`allow create, update, delete: if request.auth != null && 
  request.auth.uid == "${user.uid}";`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n💡 Solution: Create the admin user first');
      console.log('1. Go to Firebase Console > Authentication > Users');
      console.log('2. Click "Add user"');
      console.log('3. Use email:', adminEmail);
      console.log('4. Use password:', adminPassword);
    } else if (error.code === 'auth/wrong-password') {
      console.log('\n💡 Solution: Check the admin password');
    } else if (error.code === 'auth/invalid-email') {
      console.log('\n💡 Solution: Check the admin email format');
    }
  }
}

// Run the script
getAdminUID();
