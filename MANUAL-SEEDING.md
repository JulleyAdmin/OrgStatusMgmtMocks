# Manual Database Seeding Guide

Since we're having permission issues with automated seeding, here's how to manually seed the database through the Firebase Console.

## 🔥 Firebase Console Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select Project**: `julley-platform-dev`
3. **Navigate to Firestore Database**
4. **Update Security Rules** (if needed):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

## 📊 Manual Data Entry

### 1. Users Collection

Create the following documents in the `users` collection:

#### Document 1: `admin-user`
```json
{
  "email": "admin@julley.com",
  "name": "John Admin",
  "role": "admin",
  "department": "Executive",
  "position": "CEO",
  "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "createdAt": "2024-01-11T19:30:00.000Z",
  "updatedAt": "2024-01-11T19:30:00.000Z"
}
```

#### Document 2: `manager-user`
```json
{
  "email": "sarah.manager@julley.com",
  "name": "Sarah Johnson",
  "role": "manager",
  "department": "Engineering",
  "position": "Engineering Manager",
  "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  "createdAt": "2024-01-11T19:30:00.000Z",
  "updatedAt": "2024-01-11T19:30:00.000Z"
}
```

#### Document 3: `employee-user`
```json
{
  "email": "mike.dev@julley.com",
  "name": "Mike Chen",
  "role": "employee",
  "department": "Engineering",
  "position": "Senior Developer",
  "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "createdAt": "2024-01-11T19:30:00.000Z",
  "updatedAt": "2024-01-11T19:30:00.000Z"
}
```

### 2. Projects Collection

Create the following documents in the `projects` collection:

#### Document 1: `main-project`
```json
{
  "name": "Julley PMS Platform",
  "description": "Complete project management system with advanced features",
  "status": "active",
  "priority": "high",
  "manager": "manager-user",
  "team": ["employee-user"],
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-06-30T00:00:00.000Z",
  "budget": 500000,
  "progress": 75,
  "tags": ["development", "platform", "pms"],
  "createdAt": "2024-01-11T19:30:00.000Z",
  "updatedAt": "2024-01-11T19:30:00.000Z"
}
```

### 3. Tasks Collection

Create the following documents in the `tasks` collection:

#### Document 1: `dashboard-task`
```json
{
  "title": "Implement Dashboard Hub",
  "description": "Create the main dashboard with KPIs, charts, and activity feed",
  "status": "done",
  "priority": "high",
  "assignee": "employee-user",
  "reporter": "manager-user",
  "projectId": "main-project",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "estimatedHours": 40,
  "actualHours": 38,
  "tags": ["frontend", "dashboard", "charts"],
  "createdAt": "2024-01-11T19:30:00.000Z",
  "updatedAt": "2024-01-11T19:30:00.000Z"
}
```

#### Document 2: `org-chart-task`
```json
{
  "title": "Build Org Chart Visualization",
  "description": "Create interactive org chart using D3.js",
  "status": "in_progress",
  "priority": "high",
  "assignee": "employee-user",
  "reporter": "manager-user",
  "projectId": "main-project",
  "dueDate": "2024-01-25T00:00:00.000Z",
  "estimatedHours": 32,
  "actualHours": 20,
  "tags": ["frontend", "d3.js", "visualization"],
  "createdAt": "2024-01-11T19:30:00.000Z",
  "updatedAt": "2024-01-11T19:30:00.000Z"
}
```

### 4. Activities Collection

Create the following documents in the `activities` collection:

#### Document 1: `task-completed-activity`
```json
{
  "type": "task_completed",
  "title": "Task Completed",
  "description": "Mike Chen completed 'Implement Dashboard Hub'",
  "userId": "employee-user",
  "userName": "Mike Chen",
  "userAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "metadata": {
    "taskId": "dashboard-task"
  }
}
```

### 5. Org Chart Collection

Create the following documents in the `org_chart` collection:

#### Document 1: `ceo-node`
```json
{
  "name": "John Admin",
  "position": "CEO",
  "department": "Executive",
  "manager": null,
  "reports": ["manager-user"],
  "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "level": 0
}
```

#### Document 2: `manager-node`
```json
{
  "name": "Sarah Johnson",
  "position": "Engineering Manager",
  "department": "Engineering",
  "manager": "ceo-node",
  "reports": ["employee-user"],
  "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  "level": 1
}
```

## 🚀 Alternative: Use Firebase Admin SDK

If you have access to Firebase Admin SDK, you can run:

```bash
# Set up service account key
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"

# Run the seed script
npm run seed:firebase
```

## 🔧 Quick Test

After seeding, you can test the connection by:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to**: http://localhost:3000

3. **Login with demo credentials**:
   - Email: `admin@julley.com`
   - Password: `password123`

4. **Check the dashboard** to see if data loads correctly

## 📝 Notes

- The document IDs in the examples are just suggestions
- Firebase will auto-generate IDs if you don't specify them
- Make sure to use the correct document references when linking documents
- Timestamps should be in ISO format for Firestore
- Null values should be explicitly set to `null` (not `undefined`)

## 🆘 Troubleshooting

If you're still having issues:

1. **Check Firebase Console** for any error messages
2. **Verify Firestore is enabled** in your Firebase project
3. **Check security rules** are set to allow reads/writes
4. **Ensure you have the correct project selected**

Once the data is seeded, the application should work perfectly with all the features we've built!



