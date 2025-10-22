# Environment Variables Template

## Required for SPOC User Seeding (Firebase Admin)

Create a `.env.local` file in the `apps/pms/` directory with the following variables:

```env
# Firebase Admin SDK Credentials
# Get these from Firebase Console > Project Settings > Service Accounts > Generate New Private Key

# The client_email from the service account JSON
FIREBASE_CLIENT_EMAIL=your-firebase-admin@your-project.iam.gserviceaccount.com

# The private_key from the service account JSON (keep as single line with \n for newlines)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

## How to Get These Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `julley-platform-dev`
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **"Generate New Private Key"**
5. Open the downloaded JSON file
6. Find and copy:
   - `"client_email"` → Use as `FIREBASE_CLIENT_EMAIL`
   - `"private_key"` → Use as `FIREBASE_PRIVATE_KEY`

## Important Notes

⚠️ **Security:**
- Never commit `.env.local` to git (already in .gitignore)
- The private key should be kept as a single line with `\n` characters
- Keep these credentials secure
- Rotate keys regularly

✅ **Format Example:**

```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@julley-platform-dev.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

## After Setting Up

Once you have `.env.local` configured, you can run:

```bash
cd apps/pms
npm run seed:spocs
```

The script will automatically load the environment variables.

