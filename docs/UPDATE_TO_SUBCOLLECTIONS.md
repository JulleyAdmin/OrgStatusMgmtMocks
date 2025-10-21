# Database Restructuring: Move Collections Under Companies

## Change Overview

Moving all collections from root level to subcollections under `companies/{companyId}/` for proper multi-tenant data isolation.

## Pattern Changes

### Before (Root Collections):
```
/departments/{id}
/positions/{id}
/positionAssignments/{id}
/delegations/{id}
/tasks/{id}
/projects/{id}
/users/{id}
```

### After (Subcollections):
```
/companies/{companyId}/departments/{id}
/companies/{companyId}/positions/{id}
/companies/{companyId}/positionAssignments/{id}
/companies/{companyId}/delegations/{id}
/companies/{companyId}/tasks/{id}
/companies/{companyId}/projects/{id}
/companies/{companyId}/users/{id}
```

## Collections to Update

1. ✅ departments
2. ⏳ positions  
3. ⏳ positionAssignments
4. ⏳ delegations
5. ⏳ occupantSwaps
6. ⏳ delegationCache
7. ⏳ orgAuditLogs
8. ⏳ tasks
9. ⏳ projects
10. ⏳ users

## Files That Need Updates

### Service Files
- ✅ `/lib/org-services.ts` - Department operations updated
- ⏳ `/lib/org-services.ts` - Position/Assignment/Delegation operations
- ⏳ `/lib/task-assignment-service.ts`
- ⏳ `/lib/project-services.ts`
- ⏳ `/lib/user-services.ts`

### Security Rules
- ⏳ `/firestore.rules` - Update all collection paths

### Seed Scripts
- ⏳ `/scripts/seed-org-structure.ts`
- ⏳ `/scripts/seed-pms.ts`

## API Changes

All service functions need to accept `companyId` as the first parameter.

### Example Changes:

```typescript
// BEFORE
getDepartment(departmentId: string)
updateDepartment(departmentId: string, updates, userId)

// AFTER  
getDepartment(companyId: string, departmentId: string)
updateDepartment(companyId: string, departmentId: string, updates, userId)
```

## Benefits

1. **Data Isolation**: Each company's data is completely isolated
2. **Security**: Easier to write security rules per company
3. **Scalability**: Better performance for company-specific queries
4. **Backup**: Can backup/restore individual companies
5. **Multi-tenancy**: True multi-tenant architecture

