# Database Seeding Guide

This guide explains how to seed the Firebase database with initial data for the Julley PMS project.

## Prerequisites

1. Make sure you have Firebase configured with the correct environment variables in `.env.local`
2. Install dependencies: `npm install`
3. Ensure Firebase project is set up and accessible

## Seeding Options

### Full Database Seed
To seed all data at once:
```bash
npm run seed
```

This will create:
- 10 users with different roles and departments
- 8 projects with various statuses and priorities
- 20 tasks across different projects
- 15 activity entries
- 10 org chart nodes with hierarchical relationships
- 4 sample workflows

### Individual Component Seeding

You can also seed individual components:

```bash
# Seed users only
npm run seed:users

# Seed projects only (requires users to exist first)
npm run seed:projects

# Seed tasks only (requires users and projects to exist first)
npm run seed:tasks

# Seed activities only (requires users and projects to exist first)
npm run seed:activities

# Seed org chart only (requires users to exist first)
npm run seed:org-chart

# Seed workflows only (independent)
npm run seed:workflows
```

## Demo Users

The seeding script creates the following demo users:

| Email | Name | Role | Department | Position |
|-------|------|------|------------|----------|
| admin@julley.com | John Admin | admin | Executive | CEO |
| sarah.manager@julley.com | Sarah Johnson | manager | Engineering | Engineering Manager |
| mike.dev@julley.com | Mike Chen | employee | Engineering | Senior Developer |
| lisa.design@julley.com | Lisa Rodriguez | employee | Design | UI/UX Designer |
| david.marketing@julley.com | David Kim | manager | Marketing | Marketing Manager |
| emma.hr@julley.com | Emma Wilson | manager | Human Resources | HR Manager |
| alex.sales@julley.com | Alex Thompson | employee | Sales | Sales Representative |
| sophie.qa@julley.com | Sophie Brown | employee | Engineering | QA Engineer |
| james.devops@julley.com | James Miller | employee | Engineering | DevOps Engineer |
| maria.finance@julley.com | Maria Garcia | manager | Finance | Finance Manager |

**Default Password for all demo users: `password123`**

## Sample Data Overview

### Projects (8 total)
- Julley PMS Platform (Active, High Priority)
- Mobile App Redesign (Active, Medium Priority)
- Marketing Campaign Q1 (Active, High Priority)
- HR System Integration (Planning, Medium Priority)
- Financial Reporting Dashboard (Active, High Priority)
- Customer Support Portal (On Hold, Low Priority)
- Security Audit & Compliance (Active, Urgent Priority)
- Sales CRM Enhancement (Planning, Medium Priority)

### Tasks (20 total)
Tasks are distributed across projects with various statuses:
- Done: 4 tasks
- In Progress: 6 tasks
- Review: 1 task
- Todo: 9 tasks

### Workflows (4 total)
- Task Approval Workflow (Active)
- Project Kickoff Workflow (Active)
- Bug Report Workflow (Active)
- Employee Onboarding Workflow (Inactive)

## Organization Chart

The org chart follows this hierarchy:
```
John Admin (CEO)
├── Sarah Johnson (Engineering Manager)
│   ├── Mike Chen (Senior Developer)
│   ├── Lisa Rodriguez (UI/UX Designer)
│   ├── Sophie Brown (QA Engineer)
│   └── James Miller (DevOps Engineer)
├── David Kim (Marketing Manager)
│   └── Alex Thompson (Sales Representative)
├── Emma Wilson (HR Manager)
└── Maria Garcia (Finance Manager)
```

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Verify your `.env.local` file has correct Firebase configuration
   - Ensure Firebase project is active and accessible

2. **Permission Denied**
   - Check Firebase security rules
   - Verify your Firebase project has the correct permissions

3. **Duplicate Data**
   - The seed script will create new data each time it runs
   - To avoid duplicates, clear existing data first or use individual seed commands

### Clearing Existing Data

To clear existing data before seeding:
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Delete existing collections manually
4. Run the seed script again

## Customization

You can modify the seed data by editing the respective seed files:
- `src/scripts/seed-users.ts` - User data
- `src/scripts/seed-projects.ts` - Project data
- `src/scripts/seed-tasks.ts` - Task data
- `src/scripts/seed-activities.ts` - Activity data
- `src/scripts/seed-org-chart.ts` - Org chart data
- `src/scripts/seed-workflows.ts` - Workflow data

## Notes

- All timestamps are set to recent dates for realistic demo data
- User avatars use Unsplash placeholder images
- Tasks have realistic estimated and actual hours
- Projects have realistic budgets and progress percentages
- Activities show a timeline of recent actions
