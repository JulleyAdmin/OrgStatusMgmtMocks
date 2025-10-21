#!/bin/bash

# Backup original file
cp org-services.ts org-services.ts.backup

# Update all collection references to use subcollections under companies/

# Positions
sed -i.tmp "s/collection(db, 'positions')/collection(db, 'companies', companyId, 'positions')/g" org-services.ts
sed -i.tmp "s/doc(db, 'positions', positionId)/doc(db, 'companies', companyId, 'positions', positionId)/g" org-services.ts

# Position Assignments  
sed -i.tmp "s/collection(db, 'positionAssignments')/collection(db, 'companies', companyId, 'positionAssignments')/g" org-services.ts
sed -i.tmp "s/doc(db, 'positionAssignments', assignmentId)/doc(db, 'companies', companyId, 'positionAssignments', assignmentId)/g" org-services.ts
sed -i.tmp "s/doc(db, 'positionAssignments', /doc(db, 'companies', companyId, 'positionAssignments', /g" org-services.ts

# Delegations
sed -i.tmp "s/collection(db, 'delegations')/collection(db, 'companies', companyId, 'delegations')/g" org-services.ts  
sed -i.tmp "s/doc(db, 'delegations', delegationId)/doc(db, 'companies', companyId, 'delegations', delegationId)/g" org-services.ts

# Occupant Swaps
sed -i.tmp "s/collection(db, 'occupantSwaps')/collection(db, 'companies', companyId, 'occupantSwaps')/g" org-services.ts

# Delegation Cache
sed -i.tmp "s/doc(db, 'delegationCache', positionId)/doc(db, 'companies', companyId, 'delegationCache', positionId)/g" org-services.ts

# Org Audit Logs
sed -i.tmp "s/collection(db, 'orgAuditLogs')/collection(db, 'companies', companyId, 'orgAuditLogs')/g" org-services.ts

# Tasks
sed -i.tmp "s/collection(db, 'tasks')/collection(db, 'companies', companyId, 'tasks')/g" org-services.ts

# Projects
sed -i.tmp "s/collection(db, 'projects')/collection(db, 'companies', companyId, 'projects')/g" org-services.ts

# Users  
sed -i.tmp "s/doc(db, 'users', /doc(db, 'companies', companyId, 'users', /g" org-services.ts

# Clean up temp files
rm -f org-services.ts.tmp*

echo "✅ Collection references updated!"
echo "⚠️  Note: You still need to:"
echo "1. Update function signatures to include companyId parameter"
echo "2. Update function calls to pass companyId"
echo "3. Test all operations"

