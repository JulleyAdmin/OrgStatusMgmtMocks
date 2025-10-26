# Manufacturing Template Seeder

This utility helps you seed your Firebase database with realistic manufacturing industry task templates for testing and demonstration purposes.

## 🏭 Templates Included

The seeder creates **8 comprehensive manufacturing templates**:

### Production Templates
- **Daily Production Line Setup** - Equipment calibration and daily operations setup
- **Production Planning** - Weekly production planning and resource allocation

### Quality & Safety Templates  
- **Quality Control Inspection** - Comprehensive product quality inspection
- **Safety Audit** - Manufacturing facility safety audit
- **Equipment Calibration** - Regular calibration of measurement equipment

### Operations Templates
- **Machine Maintenance** - Scheduled equipment maintenance
- **Inventory Count** - Physical inventory count and reconciliation
- **New Employee Onboarding** - Manufacturing employee onboarding process

## 🚀 How to Use

### Method 1: UI Seeder (Recommended)
1. Navigate to **Task Library** → **Template Seeder** tab
2. Click **"Seed Manufacturing Templates"** button
3. Templates will be added to your company's task library

### Method 2: Programmatic Seeding
```typescript
import { seedManufacturingTemplates } from '@/lib/seed-manufacturing-templates'

// Seed templates for a specific company
await seedManufacturingTemplates('your-company-id')
```

### Method 3: Browser Console
```javascript
// Run in browser console (make sure you're logged in)
import('/src/lib/seed-manufacturing-templates.js').then(module => {
  module.seedManufacturingTemplates('your-company-id')
})
```

## 📋 Template Features

Each template includes:

### ✅ **Complete Task Structure**
- **Name & Description** - Clear, manufacturing-specific descriptions
- **Categories** - Production, Quality, Safety, Maintenance, etc.
- **Priority Levels** - High, Medium, Low based on manufacturing importance
- **Estimated Hours** - Realistic time estimates (2-8 hours)

### ✅ **Manufacturing-Specific Requirements**
- **Required Skills** - Equipment Operation, Safety Protocols, Quality Control
- **Certifications** - Forklift License, Safety Training, Quality Inspector Cert
- **Departments** - Production, Manufacturing, Quality Control, Maintenance, Safety

### ✅ **Compliance & Safety**
- **OSHA Standards** - Safety compliance requirements
- **ISO 9001** - Quality management standards
- **Safety Requirements** - PPE, Lockout/Tagout, Emergency procedures

### ✅ **Definition of Done (DoD)**
- **4-5 DoD Items** per template
- **Required vs Optional** items clearly marked
- **Sequential Order** for task completion

### ✅ **Quality Checkpoints**
- **Equipment Verification** - Calibration, functionality tests
- **Process Validation** - Production rates, quality standards
- **Documentation** - Reports, logs, certificates

## 🎯 Use Cases

### **Testing & Development**
- Test task assignment workflows
- Validate position-based task generation
- Demo task management features

### **Manufacturing Demo**
- Showcase manufacturing-specific templates
- Demonstrate compliance tracking
- Illustrate safety and quality processes

### **Training & Onboarding**
- Train users on task management system
- Show realistic manufacturing workflows
- Practice with industry-relevant content

## 🔧 Customization

Templates can be customized after seeding:

1. **Edit Templates** - Modify descriptions, requirements, DoD items
2. **Assign to Positions** - Link templates to specific manufacturing positions
3. **Create Variations** - Duplicate and modify for different scenarios
4. **Add Company-Specific** - Include your company's specific processes

## 📊 Template Categories

| Category | Count | Description |
|----------|-------|-------------|
| **Production** | 2 | Daily operations and planning |
| **Quality** | 2 | Inspection and calibration |
| **Safety** | 1 | Facility safety audit |
| **Maintenance** | 1 | Equipment maintenance |
| **Inventory** | 1 | Material counting |
| **Onboarding** | 1 | New employee training |

## 🛡️ Safety & Compliance

All templates include manufacturing industry standards:

- **OSHA Compliance** - Safety protocols and procedures
- **ISO 9001** - Quality management requirements  
- **Equipment Safety** - Lockout/tagout, PPE requirements
- **Documentation** - Audit trails and compliance records

## 🎉 Ready to Use

After seeding, templates are immediately available for:

- **Task Creation** - Generate tasks from templates
- **Position Assignment** - Assign templates to manufacturing positions
- **Workflow Testing** - Test complete task management workflows
- **User Training** - Train team members on the system

---

**Note:** Templates are marked as `isSystemTemplate: true` and can be easily identified in the task library. They serve as a foundation that can be customized for your specific manufacturing needs.
