# Services Architecture

This directory contains organized service modules for the PMS application.

## Structure

```
services/
├── index.ts              # Central export for all services
├── org/                  # Organization services
│   └── index.ts
├── tasks/                # Task management services
│   └── index.ts
├── users/                # User services
│   └── index.ts
├── projects/             # Project services
│   └── index.ts
└── companies/            # Company services
    └── index.ts
```

## Service Categories

### Organization Services (`org/`)
- Department management
- Position management
- Assignment management
- Delegation management
- Audit logging
- Located in: `@/lib/org-services.ts`

### Task Services (`tasks/`)
- Task template management
- Task assignment
- Task instantiation workflow
- Task notifications
- Position-task assignments
- Templates in: `@/lib/task-template-service.ts`

### User Services (`users/`)
- User CRUD operations
- User authentication
- User profiles
- Located in: `@/lib/user-services.ts`

### Project Services (`projects/`)
- Project CRUD operations
- Project phases and deliverables
- Project resource management
- Located in: `@/lib/project-services.ts`

### Company Services (`companies/`)
- Company management
- Multi-tenant operations
- Company settings
- Located in: `@/lib/company-services.ts`

## Usage

Import services from the centralized index:

```typescript
// Import specific service
import { UserService, ProjectService } from '@/lib/services'

// Import org services
import { createDepartment, getPositions } from '@/lib/services'

// Import task services
import { TaskTemplateService } from '@/lib/services'
```

## Migration Status

- ✅ **Completed**: Org services are in the new structure
- ✅ **Completed**: Service index with barrel files
- ⏳ **In Progress**: Gradually moving service implementations into organized modules
- ⏳ **Future**: Split large service files into smaller, focused modules

## Backward Compatibility

All services maintain backward compatibility through re-exports. You can still import from their original locations:

```typescript
// Old way (still works)
import { UserService } from '@/lib/user-services'

// New way (recommended)
import { UserService } from '@/lib/services'
```

