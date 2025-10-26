# Firebase Functions Setup for Task Generation

## 🚀 **Overview**

This setup uses Firebase Functions to automatically generate tasks when:
- Users are assigned to positions
- Task templates are assigned to positions  
- Users log in (for immediate assignment mode)
- Scheduled tasks need to be generated

## 📋 **Prerequisites**

1. Firebase CLI installed: `npm install -g firebase-tools`
2. Firebase project configured
3. Node.js 18+ installed

## 🛠️ **Setup Steps**

### 1. Install Firebase Functions Dependencies

```bash
cd functions
npm install
```

### 2. Build the Functions

```bash
npm run build
```

### 3. Start Firebase Emulators (for local development)

```bash
# From project root
firebase emulators:start
```

This will start:
- Firestore emulator on port 8080
- Functions emulator on port 5001
- Auth emulator on port 9099
- Firebase UI on port 4000

### 4. Deploy to Production

```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:onPositionAssignmentCreated
```

## 🔧 **Available Functions**

### **Firestore Triggers**

1. **`onPositionAssignmentCreated`**
   - Triggers when a user is assigned to a position
   - Automatically generates tasks based on position templates
   - Path: `companies/{companyId}/positionAssignments/{assignmentId}`

2. **`onPositionTaskTemplateCreated`**
   - Triggers when a task template is assigned to a position
   - Generates tasks for all current users in that position
   - Path: `companies/{companyId}/positionTaskTemplates/{templateId}`

### **Auth Triggers**

3. **`onUserLogin`**
   - Triggers when a user logs in
   - Generates tasks for immediate assignment mode templates
   - Uses Firebase Auth user creation trigger

### **Scheduled Functions**

4. **`generateScheduledTasks`**
   - Runs every hour
   - Generates tasks for scheduled assignments
   - Checks for templates with `assignmentMode: 'scheduled'`

### **HTTP Functions**

5. **`generateTasksForUser`**
   - POST endpoint for manual task generation
   - URL: `https://your-region-your-project.cloudfunctions.net/generateTasksForUser`
   - Body: `{ "companyId": "...", "userId": "..." }`

6. **`generateTasksForPosition`**
   - POST endpoint for generating tasks for all users in a position
   - URL: `https://your-region-your-project.cloudfunctions.net/generateTasksForPosition`
   - Body: `{ "companyId": "...", "positionId": "..." }`

## 📊 **Benefits of Firebase Functions Approach**

### ✅ **Advantages**

1. **Automatic Triggers**: Tasks are generated automatically when events occur
2. **Reliable**: Functions run in Firebase's managed environment
3. **Scalable**: Handles high loads automatically
4. **Cost-Effective**: Pay only for execution time
5. **No Client-Side Code**: Reduces client bundle size
6. **Background Processing**: Doesn't block user interactions
7. **Error Handling**: Built-in retry mechanisms
8. **Monitoring**: Built-in logging and monitoring

### 🔄 **How It Works**

1. **User Assignment**: When you assign a user to a position via the UI
2. **Document Creation**: A document is created in `positionAssignments` collection
3. **Function Trigger**: `onPositionAssignmentCreated` function automatically triggers
4. **Task Generation**: Function generates tasks based on position templates
5. **Database Update**: Tasks are saved to `generatedTasks` collection
6. **Notification**: User receives notification about new tasks

## 🧪 **Testing**

### Local Testing

```bash
# Start emulators
firebase emulators:start

# Test position assignment
# Create a document in positionAssignments collection via Firebase UI
# Check logs in emulator UI for function execution
```

### Production Testing

```bash
# Deploy functions
firebase deploy --only functions

# Test via HTTP endpoints
curl -X POST https://your-region-your-project.cloudfunctions.net/generateTasksForUser \
  -H "Content-Type: application/json" \
  -d '{"companyId": "your-company-id", "userId": "your-user-id"}'
```

## 📈 **Monitoring**

- **Firebase Console**: View function logs and metrics
- **Cloud Logging**: Detailed execution logs
- **Cloud Monitoring**: Performance metrics and alerts

## 🔧 **Configuration**

### Environment Variables

```bash
# Set in Firebase Console or via CLI
firebase functions:config:set app.environment="production"
```

### Function Timeout

```typescript
// In functions/src/index.ts
export const onPositionAssignmentCreated = functions
  .runWith({ timeoutSeconds: 300, memory: '512MB' })
  .firestore
  .document('companies/{companyId}/positionAssignments/{assignmentId}')
  .onCreate(async (snap, context) => {
    // Function logic
  })
```

## 🚨 **Error Handling**

Functions include comprehensive error handling:
- Non-blocking errors (don't fail the main operation)
- Detailed logging for debugging
- Retry mechanisms for transient failures
- Graceful degradation if task generation fails

## 💡 **Next Steps**

1. **Deploy Functions**: `firebase deploy --only functions`
2. **Test Assignment**: Assign a user to a position
3. **Check Tasks**: Verify tasks are generated in "My Tasks"
4. **Monitor Logs**: Check Firebase Console for function execution logs
5. **Customize**: Modify functions based on your specific requirements

This approach provides a robust, scalable solution for automatic task generation! 🎉
