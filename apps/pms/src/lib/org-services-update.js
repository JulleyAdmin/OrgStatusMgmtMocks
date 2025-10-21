// Script to help identify all collection references that need updating
const fs = require('fs');

const file = fs.readFileSync('org-services.ts', 'utf8');

// Find all collection references
const collections = [
  'positions',
  'positionAssignments',
  'delegations',
  'occupantSwaps',
  'delegationCache',
  'orgAuditLogs',
  'tasks',
  'projects',
  'users'
];

collections.forEach(coll => {
  const regex1 = new RegExp(`collection\\(db, '${coll}'\\)`, 'g');
  const regex2 = new RegExp(`doc\\(db, '${coll}',`, 'g');
  
  const matches1 = (file.match(regex1) || []).length;
  const matches2 = (file.match(regex2) || []).length;
  
  console.log(`${coll}: collection()=${matches1}, doc()=${matches2}`);
});
