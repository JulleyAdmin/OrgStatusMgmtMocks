# Multi-Tenant Migration Plan: Moving Collections Under Companies

## 🎯 Overview

This migration restructures the database from root-level collections to subcollections under each company document, enabling true multi-tenant data isolation.

## ✅ Progress Status

### Completed
- ✅ Departments: All functions updated with subcollections
- ✅ Positions: Basic functions updated
- ✅ Collection references: Bulk update via script (all `collection(db, 'xxx')` updated)

### In Progress  
- ⏳ Position Assignments: Function signatures need companyId
- ⏳ Delegations: Function signatures need companyId
- ⏳ Audit Logs: Function signatures need companyId

### Pending
- ⏳ Update all function calls in UI components
- ⏳ Update Firestore security rules for subcollections
- ⏳ Update seed scripts
- ⏳ Test all operations

## 📋 Remaining Function Signature Updates Needed

### Position Assignment Functions
```typescript
// CURRENT → NEEDED
getCurrentAssignment(positionId) 
  → getCurrentAssignment(companyId, positionId)

getPositionAssignmentHistory(positionId)
  → getPositionAssignmentHistory(companyId, positionId)

getUserAssignments(userId)
  → getUserAssignments(companyId, userId)

endPositionAssignment(assignmentId, endAt, userId)
  → endPositionAssignment(companyId, assignmentId, endAt, userId)
```

### Delegation Functions
```typescript
approveDelegation(delegationId, approverUserId)
  → approveDelegation(companyId, delegationId, approverUserId)

rejectDelegation(delegationId, approverUserId, reason)
  → rejectDelegation(companyId, delegationId, approverUserId, reason)

revokeDelegation(delegationId, userId, reason)
  → revokeDelegation(companyId, delegationId, userId, reason)

getActiveDelegations(userId)
  → getActiveDelegations(companyId, userId)

getReceivedDelegations(userId)
  → getReceivedDelegations(companyId, userId)
```

### Resolution Functions
```typescript
resolveEffectiveAssignment(positionId)
  → resolveEffectiveAssignment(companyId, positionId)

getDelegationCache(positionId)
  → getDelegationCache(companyId, positionId)

invalidateDelegationCache(positionId)
  → invalidateDelegationCache(companyId, positionId)
```

### Audit Functions
```typescript
getEntityAuditLogs(entityType, entityId)
  → getEntityAuditLogs(companyId, entityType, entityId)
```

## 🔧 UI Component Updates Needed

All UI components that call these services need to pass `companyId`. They can get it from:

```typescript
import { useCompany } from '@/contexts/CompanyContext'

function MyComponent() {
  const { currentCompany } = useCompany()
  const companyId = currentCompany?.id
  
  // Now use companyId in all service calls
  await getDepartments(companyId)
  await getPositions(companyId)
  // etc.
}
```

### Files to Update:
1. `/components/Org/DepartmentManagement.tsx`
2. `/components/Org/PositionManagement.tsx`
3. `/components/Org/AssignmentManagement.tsx`
4. `/components/Org/OccupantSwap.tsx`
5. `/components/Org/DelegationManagement.tsx`
6. `/components/Org/AuditReport.tsx`

## 🔒 Firestore Rules Update

The security rules need to be updated to use subcollection paths:

```javascript
// OLD (Root collections)
match /departments/{departmentId} {
  allow read: if isAuthenticated();
}

// NEW (Subcollections)
match /companies/{companyId}/departments/{departmentId} {
  allow read: if isAuthenticated() && 
    request.auth.token.companyId == companyId;
}
```

## 🌱 Seed Script Updates

Update `/scripts/seed-org-structure.ts` to create data under company:

```typescript
// Before
const departmentRef = doc(collection(db, 'departments'))

// After
const departmentRef = doc(collection(db, 'companies', COMPANY_ID, 'departments'))
```

## ✅ Testing Checklist

After all updates:

- [ ] Department CRUD operations
- [ ] Position CRUD operations
- [ ] Assignment operations
- [ ] Occupant swap
- [ ] Delegation creation/approval/revocation
- [ ] Audit report generation
- [ ] Data isolation between companies
- [ ] Security rules enforcement

## 📝 Migration Steps

### Step 1: Complete Service Layer (In Progress)
1. ✅ Update all collection() calls
2. ⏳ Update all function signatures
3. ⏳ Update internal function calls

### Step 2: Update UI Components
1. Import `useCompany()` in all org components
2. Extract `companyId` from context
3. Pass `companyId` to all service calls
4. Test each component

### Step 3: Update Rules & Scripts
1. Update `firestore.rules` for subcollections
2. Update seed scripts
3. Test security rules

### Step 4: Data Migration (If Needed)
If you have existing data at root level:
1. Create migration script
2. Copy data to company subcollections
3. Verify data integrity
4. Delete old root collections

### Step 5: Deploy & Monitor
1. Deploy updated rules
2. Deploy updated app
3. Monitor for errors
4. Verify data isolation

## 🚨 Breaking Changes

This is a **BREAKING CHANGE** that requires:
1. All existing data must be migrated
2. All API calls must be updated
3. Security rules must be deployed

## 💡 Benefits After Migration

1. **True Multi-Tenancy**: Complete data isolation per company
2. **Better Security**: Company-level access control
3. **Scalability**: Firestore optimized for subcollections
4. **Backup/Restore**: Per-company data management
5. **Compliance**: Easier data deletion per company

## 🔗 Related Files

- Service Layer: `/lib/org-services.ts`
- Task Service: `/lib/task-assignment-service.ts`
- Delegation Resolver: `/lib/delegation-resolver.ts`
- Security Rules: `/firestore.rules`
- Seed Script: `/scripts/seed-org-structure.ts`

## 📞 Next Steps

1. Complete remaining function signature updates
2. Update all UI component calls
3. Update security rules
4. Test thoroughly
5. Deploy

---

**Status**: 🟡 In Progress (40% complete)
**Estimated Time**: 2-3 hours remaining
**Priority**: High - Required for multi-tenant security

