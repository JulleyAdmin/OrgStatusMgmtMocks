# SPOC User Seeding - Ready to Execute

## ✅ What's Been Prepared

I've updated the seed script to use environment variables (`FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`) instead of requiring a service account file. This is more secure and convenient.

## 📋 Files Created/Updated

1. **`apps/pms/src/scripts/seed-spoc-users.ts`** ✅
   - Uses environment variables for Firebase Admin credentials
   - Creates 4 SPOC users with Firebase Auth
   - Creates Firestore user documents
   - Adds users to company users table
   - Default password: `autocracy@2025`

2. **`apps/pms/FIREBASE_AUTH_SETUP.md`** ✅
   - Complete setup instructions
   - Updated for environment variable approach

3. **`apps/pms/ENV_TEMPLATE.md`** ✅
   - Shows exact format for `.env.local` file
   - Instructions to get credentials from Firebase Console

## 🔧 Required Steps (Not Executed Yet)

### Step 1: Install Firebase Admin SDK

```bash
cd apps/pms
npm install firebase-admin
```

### Step 2: Update package.json

Add this script to `apps/pms/package.json`:

```json
"scripts": {
  ...existing scripts...
  "seed:spocs": "tsx src/scripts/seed-spoc-users.ts"
}
```

### Step 3: Create .env.local File

Create `apps/pms/.env.local` with your Firebase credentials:

```env
FIREBASE_CLIENT_EMAIL=your-firebase-admin@julley-platform-dev.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

**To get these values:**
1. Go to Firebase Console
2. Project Settings → Service Accounts
3. Generate New Private Key
4. Open the JSON file
5. Copy `client_email` and `private_key`

### Step 4: Run the Seed Script

```bash
cd apps/pms
npm run seed:spocs
```

## 👥 Users That Will Be Created

| Name | Email | Password | Departments |
|------|-------|----------|-------------|
| **Praneeth** | praneeth@autocracymachinery.com | `autocracy@2025` | Administration, Sales & Marketing, Investors |
| **Divya** | divya@autocracymachinery.com | `autocracy@2025` | Administration, Support Center, R&D, Sales |
| **Swathi** | swathi@autocracymachinery.com | `autocracy@2025` | Administration, Operational |
| **RajGopal** | raj@autocracymachinery.com | `autocracy@2025` | Support Center, Production Lines |

## 🎯 What the Script Will Do

1. ✅ Create Firebase Authentication accounts
2. ✅ Create user documents in `users` collection
3. ✅ Add users to `companies/{id}/companyUsers` with admin role
4. ✅ Assign departments and teams as SPOCs
5. ✅ Generate password reset links (displayed in console)
6. ✅ Set status to 'active'

## 🔐 Security Features

- ✅ Default password: `autocracy@2025`
- ✅ Password reset links generated automatically
- ✅ Email verification required on first login
- ✅ Environment variables (not committed to git)
- ✅ Users get admin permissions with appropriate scopes

## 📊 Expected Output

```
🚀 Starting SPOC Users Seeding...
📍 Company ID: SU6Svsf6iVGdopeWKFqQ
🔑 Default Password: autocracy@2025
⚠️  Users should change password on first login

✓ Firebase Admin SDK initialized with environment credentials

👤 Processing: Praneeth Divya (praneeth@autocracymachinery.com)
  ✓ Created Firebase Auth user: praneeth@autocracymachinery.com (UID: xxx)
  📧 Password reset link for praneeth@autocracymachinery.com:
     https://julley-platform-dev.firebaseapp.com/__/auth/action?...
  ✓ Created Firestore user document for praneeth@autocracymachinery.com
  ✓ Added praneeth@autocracymachinery.com to company users
  ✅ Successfully created complete user profile

[... same for other 3 users ...]

============================================================
📊 Seeding Summary
============================================================
Total Users: 4
✅ Firebase Auth Created: 4
❌ Firebase Auth Failed: 0
✅ Firestore Documents Created: 4
❌ Firestore Documents Failed: 0
============================================================

✨ SPOC Users seeding completed!
🔐 Default Password: autocracy@2025
⚠️  Remember to share password reset links with users!
```

## ⚠️ Important Notes

1. **If users already exist** in Firebase Auth, the script will reuse their UID and update Firestore records
2. **Password reset links** are temporary - share them immediately with users
3. **Email verification** is required on first login
4. **Admin permissions** are granted to all SPOC users

## 🚀 Ready to Execute?

When you're ready:

1. ✅ Install firebase-admin
2. ✅ Update package.json with seed:spocs script
3. ✅ Create .env.local with your credentials
4. ✅ Run `npm run seed:spocs`

**Let me know when you want to proceed with any of these steps!**

