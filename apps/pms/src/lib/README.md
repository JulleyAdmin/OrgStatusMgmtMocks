# Library Structure

## Overview

This directory contains core libraries, services, and utilities for the PMS application.

## Directory Structure

### Services (`services/`)
Organized service modules for different domains:
- **org/** - Organization management services
- **tasks/** - Task management services
- **users/** - User management services
- **projects/** - Project management services
- **companies/** - Company/multi-tenant services

See [services/README.md](./services/README.md) for details.

### Service Files (Root Level)
- `org-services.ts` - Organization structure management
- `user-services.ts` - User CRUD and authentication
- `project-services.ts` - Project management
- `company-services.ts` - Multi-tenant company operations
- `task-template-service.ts` - Task template management
- `task-assignment-service.ts` - Task assignment logic
- `task-notification-service.ts` - Task notifications
- `task-instantiation-workflow-service.ts` - Workflow orchestration
- `position-task-assignment-service.ts` - Position-task relationships
- `delegation-resolver.ts` - Delegation resolution logic

### Core Libraries
- `firebase.ts` - Firebase configuration and initialization
- `auth.ts` - Authentication utilities
- `utils.ts` - General utility functions
- `validations.ts` - Data validation schemas
- `design-system.ts` - Design system configuration

### Configuration
- `dynamic-imports.tsx` - Dynamic component imports for code splitting
- `seed-manufacturing-templates.ts` - Template seeding utility
- `update-collections.sh` - Database migration scripts

## Usage

### Importing Services

**Recommended (from organized structure):**
```typescript
import { UserService, ProjectService } from '@/lib/services'
import { createDepartment, getPositions } from '@/lib/services'
```

**Direct imports (still supported):**
```typescript
import { UserService } from '@/lib/user-services'
import { ProjectService } from '@/lib/project-services'
```

### Importing Utilities
```typescript
import { cn } from '@/lib/utils'
import { validateEmail, validateRequired } from '@/lib/validations'
```

## Migration Progress

### Completed ✅
- Service barrel files created for all domains
- Central services index with backward compatibility
- Clear documentation structure

### In Progress ⏳
- Gradually moving large service files into smaller modules
- Extracting common patterns into shared utilities

### Future Plans 📋
- Split large service files (e.g., 1000+ line files)
- Extract common CRUD patterns
- Create domain-specific submodules
- Add comprehensive unit tests for all services

