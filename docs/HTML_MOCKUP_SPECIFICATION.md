# HTML Mockup Specification Document
## AI-Powered Organizational Hierarchy Platform

**Version:** 1.0
**Date:** January 2025
**Purpose:** Comprehensive specification for creating production-ready HTML mockups for all key screens

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Design System Foundation](#design-system-foundation)
3. [Technical Stack & Component Libraries](#technical-stack--component-libraries)
4. [Screen Inventory & Priorities](#screen-inventory--priorities)
5. [Information Architecture](#information-architecture)
6. [Detailed Screen Specifications](#detailed-screen-specifications)
7. [Interaction Patterns & Workflows](#interaction-patterns--workflows)
8. [Responsive Design Strategy](#responsive-design-strategy)
9. [Implementation Guidelines](#implementation-guidelines)
10. [Quality Assurance Checklist](#quality-assurance-checklist)

---

## 1. Executive Summary

### 1.1 Objective

Create high-fidelity, interactive HTML mockups for the AI-Powered Organizational Hierarchy Platform that serve as production-ready references for the development team. These mockups will demonstrate:

- Complete information architecture
- Visual hierarchy and design language
- Interaction patterns and workflows
- Responsive behavior across devices
- Component reusability and design system adherence

### 1.2 Scope

**20 Core Screens:**
1. Dashboard Hub (Personalized command center)
2. Org Chart Canvas (Interactive visualization)
3. Workflow Designer (Visual builder)
4. Task Command Center (Unified inbox)
5. Calendar & Scheduling Hub (Time-based workflows)
6. Project Portfolio (Gantt & Kanban views)
7. Compliance Control Room (Audit dashboard)
8. Analytics Studio (Custom dashboards)
9. Template Gallery (Searchable library)
10. Admin Console (System configuration)
11. Authentication & Onboarding Flow
12. **Document Management & Knowledge Base** (Repository & wiki)
13. **Notifications Center & Preferences** (Unified inbox)
14. **Global Search & Command Palette** (Cmd+K interface)
15. **Custom Reports & Export Hub** (Report builder)
16. **Integrations Marketplace** (Third-party connections)
17. **Time Tracking & Timesheets** (Time logging)
18. **Audit Log Viewer** (Compliance trail)
19. **Help Center & Support** (In-app documentation)
20. **Personal Settings Hub** (User preferences)

**Supporting Components:**
- Navigation (Sidebar, Top Nav, Breadcrumbs)
- Modals and Dialogs
- Forms and Input Components
- Data Tables and Lists
- Charts and Visualizations
- Toast Notifications and Alerts

### 1.3 Success Criteria

- ✅ Near pixel-perfect representation of final product
- ✅ Interactive elements demonstrate user workflows
- ✅ Responsive across desktop (1920px), tablet (768px), mobile (375px)
- ✅ Accessible (WCAG 2.1 AA minimum)
- ✅ Consistent design system implementation
- ✅ Performance: Page load < 2 seconds
- ✅ Reusable component library created

---

## 2. Design System Foundation

### 2.1 Visual Identity

#### Color Palette

**Primary Colors:**
```css
--primary-50: #EFF6FF;   /* Lightest blue backgrounds */
--primary-100: #DBEAFE;  /* Light blue accents */
--primary-200: #BFDBFE;  /* Soft blue borders */
--primary-300: #93C5FD;  /* Medium blue hover states */
--primary-400: #60A5FA;  /* Bright blue interactive */
--primary-500: #3B82F6;  /* Primary brand blue */
--primary-600: #2563EB;  /* Dark blue emphasis */
--primary-700: #1D4ED8;  /* Darker blue */
--primary-800: #1E40AF;  /* Deep blue */
--primary-900: #1E3A8A;  /* Darkest blue */
```

**Neutral Colors:**
```css
--neutral-50: #F9FAFB;   /* Lightest gray backgrounds */
--neutral-100: #F3F4F6;  /* Light gray sections */
--neutral-200: #E5E7EB;  /* Gray borders */
--neutral-300: #D1D5DB;  /* Medium gray dividers */
--neutral-400: #9CA3AF;  /* Gray text secondary */
--neutral-500: #6B7280;  /* Gray text tertiary */
--neutral-600: #4B5563;  /* Dark gray text */
--neutral-700: #374151;  /* Darker gray headings */
--neutral-800: #1F2937;  /* Deep gray primary text */
--neutral-900: #111827;  /* Darkest gray */
```

**Semantic Colors:**
```css
--success-50: #ECFDF5;
--success-500: #10B981;  /* Green for success states */
--success-700: #047857;

--warning-50: #FFFBEB;
--warning-500: #F59E0B;  /* Amber for warnings */
--warning-700: #B45309;

--error-50: #FEF2F2;
--error-500: #EF4444;    /* Red for errors */
--error-700: #B91C1C;

--info-50: #EFF6FF;
--info-500: #3B82F6;     /* Blue for information */
--info-700: #1D4ED8;
```

**Status Colors:**
```css
--status-draft: #9CA3AF;      /* Gray */
--status-active: #10B981;     /* Green */
--status-pending: #F59E0B;    /* Amber */
--status-blocked: #EF4444;    /* Red */
--status-completed: #3B82F6;  /* Blue */
--status-archived: #6B7280;   /* Dark gray */
```

#### Typography

**Font Stack:**
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

**Type Scale:**
```css
--text-xs: 0.75rem;      /* 12px - Helper text, labels */
--text-sm: 0.875rem;     /* 14px - Body small, captions */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Lead text */
--text-xl: 1.25rem;      /* 20px - H5 */
--text-2xl: 1.5rem;      /* 24px - H4 */
--text-3xl: 1.875rem;    /* 30px - H3 */
--text-4xl: 2.25rem;     /* 36px - H2 */
--text-5xl: 3rem;        /* 48px - H1 */
```

**Font Weights:**
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

**Line Heights:**
```css
--leading-tight: 1.25;    /* Headings */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.625; /* Large text blocks */
```

#### Spacing System

**8-Point Grid:**
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

#### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Buttons, inputs */
--radius-md: 0.375rem;  /* 6px - Cards, panels */
--radius-lg: 0.5rem;    /* 8px - Large cards */
--radius-xl: 0.75rem;   /* 12px - Modals */
--radius-2xl: 1rem;     /* 16px - Hero sections */
--radius-full: 9999px;  /* Full rounded - Pills, avatars */
```

#### Shadows

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

#### Animation & Transitions

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 2.2 Dark Mode Support

All components must support dark mode with the following adjustments:

**Dark Mode Colors:**
```css
[data-theme="dark"] {
  --bg-primary: #0F172A;      /* Dark blue-gray background */
  --bg-secondary: #1E293B;    /* Lighter dark background */
  --bg-tertiary: #334155;     /* Card backgrounds */

  --text-primary: #F1F5F9;    /* Light text */
  --text-secondary: #CBD5E1;  /* Secondary text */
  --text-tertiary: #94A3B8;   /* Tertiary text */

  --border-color: #334155;    /* Borders */
}
```

---

## 3. Technical Stack & Component Libraries

### 3.1 Recommended Technology Stack

**Core Technologies:**
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **JavaScript (ES6+)** - Vanilla JS or lightweight framework
- **Tailwind CSS** - Utility-first CSS framework

**Component Library:**
- **Primary Choice: Ant Design** (Best for enterprise applications)
  - Comprehensive component set
  - Built for enterprise workflows
  - Excellent data visualization components
  - Strong form handling

- **Alternative: Material UI (MUI)** (If React-based)
  - Material Design 3 principles
  - Excellent documentation
  - Strong accessibility support

**Visualization Libraries:**
- **D3.js** - Custom org chart visualization
- **React Flow** - Workflow designer nodes/edges
- **Chart.js** - Dashboard charts and analytics
- **Apache ECharts** - Complex data visualizations

**Interaction Libraries:**
- **SortableJS** - Drag and drop functionality
- **Interact.js** - Advanced drag, resize, gestures
- **DnD Kit** - Modern drag and drop toolkit

**Icon Library:**
- **Lucide Icons** - Modern, consistent icon set
- **Heroicons** - Tailwind-compatible icons

### 3.2 File Structure

```
/mockups
├── /assets
│   ├── /css
│   │   ├── design-system.css      # Design tokens
│   │   ├── components.css         # Component styles
│   │   └── utilities.css          # Utility classes
│   ├── /js
│   │   ├── main.js                # Global scripts
│   │   ├── components.js          # Component logic
│   │   └── mock-data.js           # Sample data
│   ├── /images
│   │   ├── /avatars
│   │   ├── /logos
│   │   └── /illustrations
│   └── /icons
│       └── sprite.svg             # Icon sprite
├── /components
│   ├── navigation.html
│   ├── buttons.html
│   ├── forms.html
│   ├── cards.html
│   ├── tables.html
│   └── charts.html
├── /screens
│   ├── 01-dashboard.html
│   ├── 02-org-chart.html
│   ├── 03-workflow-designer.html
│   ├── 04-task-center.html
│   ├── 05-projects.html
│   ├── 06-compliance.html
│   ├── 07-analytics.html
│   ├── 08-templates.html
│   ├── 09-admin.html
│   └── 10-auth.html
├── index.html                     # Landing/navigation page
└── README.md                      # Documentation
```

---

## 4. Screen Inventory & Priorities

### 4.1 Priority Matrix

| Priority | Screen Name | Complexity | Estimated Time | Dependencies |
|----------|-------------|------------|----------------|--------------|
| P0 | Dashboard Hub | High | 16-20 hours | Component library, Charts |
| P0 | Org Chart Canvas | Very High | 24-32 hours | D3.js, Drag-drop |
| P0 | Task Command Center | High | 16-20 hours | Tables, Filters |
| P1 | Calendar & Scheduling Hub | High | 16-20 hours | Calendar library, Drag-drop |
| P1 | Workflow Designer | Very High | 24-32 hours | React Flow, Drag-drop |
| P1 | Template Gallery | Medium | 8-12 hours | Cards, Search |
| P1 | Authentication Flow | Medium | 8-12 hours | Forms, Validation |
| P1 | **Notifications Center** | Medium | 12-16 hours | WebSocket, Toast UI |
| P1 | **Global Search & Command** | High | 20-24 hours | Algolia/Elasticsearch |
| P2 | Project Portfolio | High | 16-20 hours | Gantt library |
| P2 | Compliance Control Room | High | 16-20 hours | Dashboards, Tables |
| P2 | **Document Management** | Very High | 24-32 hours | File upload, Viewer |
| P2 | **Custom Reports** | High | 20-24 hours | Chart.js, Export libs |
| P2 | **Integrations Marketplace** | Medium | 16-20 hours | OAuth, API |
| P3 | Analytics Studio | High | 16-20 hours | Charts, Filters |
| P3 | Admin Console | Medium | 12-16 hours | Forms, Tables |
| P3 | **Time Tracking** | Medium | 12-16 hours | Timer, Timesheets |
| P3 | **Audit Log Viewer** | Low | 8-12 hours | Table, Filters |
| P3 | **Help Center** | Medium | 12-16 hours | Knowledge base |
| P3 | **Personal Settings** | Low | 8-12 hours | Forms, Preferences |

**Total Estimated Time:** 336-420 hours (8-10 weeks for 1 developer, or 4-5 weeks with 2 developers)**

> **Note:** Detailed specifications for screens 12-20 are available in the separate document: `ADDITIONAL_CAPABILITIES_SPEC.md`

### 4.2 Build Sequence

**Phase 1: Foundation (Week 1)**
1. Setup design system CSS
2. Build component library
3. Create navigation shell
4. Authentication screens

**Phase 2: Core Features (Week 2-3)**
5. Dashboard Hub
6. Task Command Center
7. Notifications Center
8. Global Search & Command Palette
9. Template Gallery

**Phase 3: Advanced Features (Week 4-5)**
10. Org Chart Canvas
11. Workflow Designer
12. Calendar & Scheduling Hub

**Phase 4: Enterprise Features (Week 6-7)**
13. Document Management & Knowledge Base
14. Custom Reports & Export Hub
15. Integrations Marketplace

**Phase 5: Specialized Views (Week 8-9)**
16. Project Portfolio
17. Compliance Control Room
18. Analytics Studio
19. Time Tracking & Timesheets

**Phase 6: Administration & Support (Week 10)**
20. Admin Console
21. Audit Log Viewer
22. Help Center & Support
23. Personal Settings Hub

---

## 5. Information Architecture

### 5.1 Global Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] AI Org Platform          [Search] [Notifications] [@]│
├─────────────────────────────────────────────────────────────┤
│ Sidebar │                                                     │
│         │                                                     │
│ 🏠 Home  │                    Main Content                    │
│ 📊 Tasks │                                                     │
│ 🏢 Org   │                                                     │
│ 🔄 Work  │                                                     │
│ 📁 Proj  │                                                     │
│ ✓ Comp   │                                                     │
│ 📈 Analy │                                                     │
│ 📚 Templ │                                                     │
│ ⚙️ Admin │                                                     │
│         │                                                     │
└─────────┴─────────────────────────────────────────────────────┘
```

**Primary Navigation (Sidebar):**
- **Home** - Dashboard Hub
- **Tasks** - Task Command Center
- **Calendar** - Calendar & Scheduling Hub
- **Documents** - Document Management & Knowledge Base
- **Organization** - Org Chart Canvas
- **Workflows** - Workflow Designer
- **Projects** - Project Portfolio
- **Reports** - Custom Reports & Export Hub
- **Time** - Time Tracking & Timesheets
- **Compliance** - Compliance Control Room
- **Analytics** - Analytics Studio
- **Templates** - Template Gallery
- **Integrations** - Integrations Marketplace
- **Admin** - Admin Console (Role-based)

**Top Navigation (Header):**
- **Global Search** - Cmd+K shortcut (Command Palette)
- **Create New** - Quick action dropdown
- **Notifications** - Bell icon with badge (Notifications Center)
- **Help** - Help Center & Support
- **Profile** - User menu (Personal Settings Hub, Logout)

### 5.2 User Journey Flows

**Flow 1: New Task Creation → Routing**
```
Dashboard → Create Task → Fill Details → AI Routing Suggestion
→ Review/Override → Assign → Notification Sent → Task Created
```

**Flow 2: Org Chart Management**
```
Org Chart → Add Position → Define Role → Set Reporting Line
→ Assign Person → Configure Permissions → Save → Update Complete
```

**Flow 3: Workflow Template Usage**
```
Templates → Browse/Search → Select Template → Customize Steps
→ Configure Routing → Test Workflow → Publish → Activate
```

**Flow 4: Compliance Tracking**
```
Compliance Dashboard → View Requirements → Check Status
→ Drill Down → Review Evidence → Mark Complete → Generate Report
```

---

## 6. Detailed Screen Specifications

### 6.1 Screen: Dashboard Hub

**Purpose:** Personalized command center showing role-specific KPIs and quick actions

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Welcome back, [User Name]! | Today: Jan 15, 2025    │
├─────────────────────────────────────────────────────────────┤
│ Quick Stats (4 columns)                                      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │My Tasks  │ │Pending   │ │Overdue   │ │Completed │        │
│ │  24      │ │Approvals │ │  3       │ │This Week │        │
│ │  ↑ 12%   │ │  8       │ │  ⚠️      │ │  47      │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────────────────┤
│ Main Content (2 columns)                                     │
│ ┌────────────────────────────┐ ┌───────────────────────┐   │
│ │ Priority Tasks (Left 60%)  │ │ Activity Feed (40%)   │   │
│ │ - Task list with status    │ │ - Recent updates      │   │
│ │ - Due dates                │ │ - @mentions           │   │
│ │ - Assignment info          │ │ - Approvals needed    │   │
│ │ - Quick actions            │ │ - Team activity       │   │
│ └────────────────────────────┘ └───────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ Charts & Insights (Bottom row)                               │
│ ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐ │
│ │ Task Trend       │ │ SLA Compliance   │ │ Team Load   │ │
│ │ (Line Chart)     │ │ (Gauge Chart)    │ │ (Bar Chart) │ │
│ └──────────────────┘ └──────────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **KPI Cards (Top Row)**
   - **Dimensions:** 4 cards, equal width, responsive
   - **Elements:**
     - Large number (--text-4xl, --font-bold)
     - Label (--text-sm, --text-secondary)
     - Trend indicator (↑/↓ with percentage)
     - Icon (top right)
     - Background gradient on hover
   - **States:** Default, Hover, Loading
   - **Color Coding:**
     - Green for positive metrics
     - Red for overdue/critical
     - Blue for neutral

2. **Priority Tasks Section**
   - **Task Card Components:**
     - Task title (--text-base, --font-medium)
     - Status badge (pill-shaped, colored by status)
     - Priority indicator (icon + color: High=Red, Medium=Amber, Low=Gray)
     - Due date (with relative time: "2 hours ago", "Due in 3 days")
     - Assigned user (avatar + name)
     - Quick actions (hover menu: View, Edit, Reassign, Complete)
   - **Interactions:**
     - Click to open task detail modal
     - Drag to reorder (visual feedback with ghost element)
     - Checkbox to mark complete
     - Hover shows quick actions toolbar
   - **Filters:**
     - All / My Tasks / Delegated / Watching
     - Status dropdown
     - Date range picker

3. **Activity Feed**
   - **Timeline Layout:**
     - Vertical line with dots
     - Time stamps (relative)
     - User avatars
     - Activity type icons
     - Truncated text with "Show more"
   - **Activity Types:**
     - Task assigned (@mention)
     - Comment added
     - Status changed
     - Approval requested
     - Document attached

4. **Charts Row**
   - **Task Trend Chart (Line):**
     - 30-day rolling window
     - Multiple lines (Created, Completed, Overdue)
     - Interactive tooltips
     - Legend toggle
     - Responsive (stacks on mobile)

   - **SLA Compliance Gauge:**
     - Semi-circular gauge
     - Color zones (0-70% Red, 70-90% Amber, 90-100% Green)
     - Central percentage display
     - Subtitle with actual numbers

   - **Team Load Bar Chart:**
     - Horizontal bars per team member
     - Stacked by task status
     - Max capacity line
     - Sortable by load/name

**Responsive Behavior:**
- **Desktop (≥1280px):** Full 2-column layout with all charts
- **Tablet (768px-1279px):** Single column, charts side-by-side in pairs
- **Mobile (<768px):** Full stack, hide activity feed (accessible via toggle)

**Accessibility:**
- Skip navigation link
- Keyboard shortcuts (? key shows help)
- ARIA labels on interactive elements
- Focus indicators
- Screen reader announcements for updates

**Mock Data Requirements:**
- 24 sample tasks (varied statuses, priorities, due dates)
- 15 activity feed items
- 30 days of trend data
- 8 team members with workload data

---

### 6.2 Screen: Org Chart Canvas

**Purpose:** Interactive visualization of organizational hierarchy with edit capabilities

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Toolbar: [Zoom +/-] [Fit] [Layout▼] [Export▼] [Edit Mode]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                     ┌─────────────────┐                      │
│                     │   CEO           │                      │
│                     │   John Smith    │                      │
│                     └────────┬────────┘                      │
│                              │                               │
│              ┌───────────────┼───────────────┐              │
│              │               │               │              │
│         ┌────▼─────┐   ┌────▼─────┐   ┌────▼─────┐         │
│         │ VP Sales │   │ VP Eng   │   │ VP Ops   │         │
│         │ Jane Doe │   │ Bob Lee  │   │ Amy Chen │         │
│         └────┬─────┘   └────┬─────┘   └──────────┘         │
│              │               │                               │
│       [Expandable subtree]   [...]                           │
│                                                               │
│ Side Panel (Right): Position Details / Search / Filters      │
└─────────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Canvas Toolbar**
   - **Zoom Controls:**
     - Zoom in (+) button
     - Zoom out (-) button
     - Fit to screen button
     - Zoom percentage indicator (clickable for custom zoom)
     - Keyboard: Cmd+Plus, Cmd+Minus, Cmd+0

   - **Layout Options:**
     - Top-down (default)
     - Left-to-right
     - Radial (for smaller orgs)
     - Compact mode (reduces spacing)

   - **Export Options:**
     - PNG/SVG image
     - PDF document
     - Excel spreadsheet
     - JSON data

   - **Edit Mode Toggle:**
     - View mode (default, read-only)
     - Edit mode (enables drag-drop, add/remove)
     - Requires admin permission

2. **Position Node Card**
   - **Visual Design:**
     - Card size: 200px × 120px
     - Border: 2px solid (color by department)
     - Shadow: --shadow-md
     - Border-radius: --radius-md

   - **Content Structure:**
     ```
     ┌──────────────────────────────┐
     │ [Avatar]  Position Title     │
     │           Department         │
     │           Person Name        │
     │           [Direct Reports: 5]│
     │ [Status Dot] [Actions ⋮]    │
     └──────────────────────────────┘
     ```

   - **Interactive States:**
     - Default: Neutral background
     - Hover: Elevated shadow, show actions menu
     - Selected: Primary border, highlighted
     - Empty position: Dashed border, gray background
     - Drag-over: Animated pulsing border (valid drop zone)

   - **Quick Actions (on hover):**
     - View details
     - Add child position
     - Edit position
     - Assign person
     - Delete position (with confirmation)

3. **Connection Lines**
   - **Visual Properties:**
     - Width: 2px
     - Color: --neutral-300 (light mode), --neutral-600 (dark mode)
     - Style: Solid (direct report), Dashed (dotted line/matrix)
     - Animated flow on hover (subtle gradient movement)

   - **Types:**
     - Solid line: Direct reporting relationship
     - Dashed line: Matrix/dotted line reporting
     - Blue line: Selected path (highlights entire reporting chain)

4. **Search & Filter Panel**
   - **Search Bar:**
     - Autocomplete with suggestions
     - Search by: Name, Title, Department, Location
     - Highlight matches on canvas
     - Keyboard shortcut: Cmd+K

   - **Filters:**
     - Department (multi-select)
     - Location (multi-select)
     - Employment type (Full-time, Contract, etc.)
     - Position status (Filled, Vacant)
     - Level (C-suite, Director, Manager, IC)

   - **Filter Chips:**
     - Show active filters
     - Click to remove
     - Clear all button

5. **Position Detail Side Panel**
   - **Triggered by:** Click on position node
   - **Panel Width:** 400px (slides in from right)
   - **Sections:**

     a. **Header:**
        - Position title (--text-2xl, --font-bold)
        - Department badge
        - Status indicator
        - Close button

     b. **Current Assignee:**
        - Large avatar
        - Name, email, phone
        - Start date
        - Quick actions: Message, View profile, Remove

     c. **Position Information:**
        - Position ID
        - Level / Grade
        - Reports to (with link)
        - Direct reports count (expandable list)
        - Location
        - Employment type

     d. **Responsibilities:**
        - Key responsibilities (bullet list)
        - Edit button (if admin)

     e. **Skills & Requirements:**
        - Required skills (tags)
        - Years of experience
        - Education requirements

     f. **History Timeline:**
        - Previous assignees
        - Date ranges
        - Reason for change

     g. **Actions (Footer):**
        - Edit position
        - Assign/Change person
        - Add child position
        - Archive position

6. **Edit Mode Features**
   - **Add New Position:**
     - Click "+" button on existing position
     - Modal form opens
     - Fields: Title, Department, Reports to, Level
     - Validation: Required fields, unique position ID
     - Auto-positioning on canvas

   - **Drag-and-Drop Repositioning:**
     - Drag position node to new parent
     - Visual feedback: Ghost image, drop zone highlight
     - Drop validation: Prevent circular reporting, enforce rules
     - Confirmation dialog: "Move [Position] to report to [New Parent]?"
     - Animation: Smooth transition to new location

   - **Bulk Operations:**
     - Multi-select nodes (Cmd+Click or drag marquee)
     - Actions: Move, Delete, Export, Change department
     - Confirmation for destructive actions

7. **Canvas Interactions**
   - **Pan:** Click and drag background (cursor changes to grab hand)
   - **Zoom:** Mouse wheel, pinch gesture, toolbar buttons
   - **Minimap:** Small overview in bottom-right corner
   - **Fullscreen:** F11 or button
   - **Keyboard Navigation:**
     - Arrow keys: Move between nodes
     - Enter: Open selected node details
     - Delete: Remove selected node (with confirmation)
     - Escape: Deselect / Close panel

**Advanced Features:**

1. **Data Virtualization:**
   - Only render visible nodes (viewport culling)
   - Lazy load subtrees on expand
   - Smooth loading indicators
   - Performance: 60fps with 1000+ nodes

2. **Collaboration:**
   - Real-time presence indicators (live cursors)
   - Who's viewing this position (avatars)
   - Optimistic updates (immediate visual feedback)
   - Conflict resolution (last write wins, with notification)

3. **Versioning & History:**
   - Timeline scrubber (bottom of canvas)
   - "View as of date" selector
   - Diff view (compare two dates, highlight changes)
   - Restore previous version

**Responsive Behavior:**
- **Desktop (≥1280px):** Full canvas with side panel
- **Tablet (768px-1279px):** Canvas full-width, panel overlays
- **Mobile (<768px):** List view alternative (tree structure), limited canvas

**Accessibility:**
- Keyboard-only navigation
- Screen reader descriptions of hierarchy
- High contrast mode
- Focus trap in modals
- ARIA live regions for updates

**Mock Data Requirements:**
- 50+ position nodes (varied departments, levels)
- 5-7 department categories
- 3 levels of hierarchy minimum
- 10 vacant positions
- 5 matrix reporting relationships
- Sample historical data (3 months)

**Technical Considerations:**
- Use D3.js for tree layout algorithm
- SVG rendering for crisp zoom
- Canvas fallback for large trees (1000+ nodes)
- WebWorker for layout calculations
- Local storage for user preferences (zoom level, filters)

---

### 6.3 Screen: Workflow Designer

**Purpose:** Visual drag-and-drop interface for creating and editing automated workflows

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Header: [Workflow Name*] [Save Draft] [Test] [Publish]      │
├───────────┬─────────────────────────────────────────────────┤
│ Nodes     │                 Canvas                          │
│ Palette   │                                                 │
│           │    ┌──────────┐                                 │
│ 🎯 Trigger│    │ START    │                                 │
│           │    └─────┬────┘                                 │
│ ⚡ Action │          │                                       │
│           │    ┌─────▼────┐                                 │
│ 🔀 Logic  │    │ ACTION 1 │                                 │
│           │    │ Create   │                                 │
│ ✅ Approva│    │ Task     │                                 │
│           │    └─────┬────┘                                 │
│ 🔔 Notify │          │                                       │
│           │    ┌─────▼────┐     ┌──────────┐               │
│ 🎬 End    │    │CONDITION?├─Yes→│ACTION 2  │               │
│           │    │Priority  │     │Route to  │               │
│           │    └─────┬────┘     │Manager   │               │
│           │          │No        └────┬─────┘               │
│           │          │               │                      │
│           │    ┌─────▼───────────────▼────┐                │
│           │    │       END                │                │
│           │    └──────────────────────────┘                │
│           │                                                 │
├───────────┴─────────────────────────────────────────────────┤
│ Properties Panel (Bottom): [Selected Node Configuration]    │
└─────────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Workflow Header**
   - **Workflow Name Input:**
     - Inline editable (click to edit)
     - Auto-save on blur
     - Character limit: 100
     - Validation: Required, unique

   - **Status Badge:**
     - Draft (Gray)
     - Testing (Amber)
     - Active (Green)
     - Inactive (Red)

   - **Action Buttons:**
     - Save Draft (Cmd+S)
     - Test Run (opens test modal)
     - Publish (opens confirmation dialog)
     - More actions menu: Duplicate, Export, Delete, Version history

   - **Metadata Display:**
     - Last edited by [User] at [Time]
     - Version number
     - Active since [Date]

2. **Node Palette (Left Sidebar)**
   - **Width:** 240px
   - **Sections (Collapsible):**

     a. **Triggers** (How workflow starts)
        - Manual trigger
        - Schedule (cron)
        - Webhook
        - Form submission
        - Task status change
        - Position assignment

     b. **Actions** (What happens)
        - Create task
        - Update task
        - Send notification
        - Assign to position/person
        - Create document
        - Call API
        - Run script

     c. **Logic** (Decision points)
        - If/Then/Else condition
        - Switch/Case
        - Loop (for each)
        - Delay/Wait
        - Parallel paths
        - Merge paths

     d. **Approvals** (Human in loop)
        - Single approver
        - Multiple approvers (any/all)
        - Sequential approvals
        - Voting (majority/unanimous)

     e. **Notifications** (Communication)
        - Email notification
        - In-app notification
        - SMS message
        - Push notification
        - Slack/Teams message

     f. **End** (Workflow completion)
        - Success end
        - Error end
        - Redirect

   - **Node Card Design:**
     ```
     ┌──────────────┐
     │ 🎯 Icon      │
     │ Node Name    │
     │ Description  │
     └──────────────┘
     ```
   - **Interaction:** Drag from palette to canvas

3. **Canvas Area**
   - **Background:**
     - Dot grid pattern (subtle, --neutral-100)
     - Zoom levels: 25%, 50%, 75%, 100%, 125%, 150%
     - Pan: Click-drag background, Space+drag

   - **Node Design:**
     ```
     ┌─────────────────────────────┐
     │ [Icon] Node Name        [⋮] │
     │ ─────────────────────────── │
     │ Brief config summary        │
     │ (e.g., "Route to Manager")  │
     └──────────┬──────────────────┘
                ↓ Connection point
     ```
     - Size: 280px wide × auto height
     - Border: 2px solid (colored by type)
     - Border-radius: --radius-lg
     - Shadow: --shadow-md (elevated on hover/select)

   - **Node States:**
     - Default: White background, gray border
     - Hover: Elevated shadow, show menu icon
     - Selected: Primary blue border, show properties panel
     - Error: Red border, show error icon/tooltip
     - Valid: Green checkmark icon
     - Executing (test mode): Animated pulsing border

   - **Connection Lines:**
     - Bezier curves (smooth, organic flow)
     - Animated dashed line while dragging
     - Color: --neutral-400
     - Width: 2px
     - Arrows at endpoints
     - Hover: Thicker, show delete button
     - Click: Select (shows conditions/labels)

   - **Connection Labels:**
     - For conditional branches: "Yes", "No", "Error"
     - Editable on click
     - Positioned above line
     - Background pill for readability

4. **Node Interactions**
   - **Add Node:**
     - Drag from palette to canvas
     - Drop shows green highlight zone
     - Auto-connect to nearest valid node
     - Alternative: Click "+" on connection line

   - **Edit Node:**
     - Click node to select
     - Properties panel opens (bottom)
     - Inline edit for quick changes
     - Double-click for modal with full config

   - **Move Node:**
     - Drag to reposition
     - Auto-arrange button (smart layout)
     - Snap to grid (toggle option)
     - Connections update dynamically

   - **Delete Node:**
     - Select and press Delete key
     - Click menu → Delete
     - Confirmation for nodes with connections
     - Undo capability (Cmd+Z)

   - **Copy/Paste:**
     - Copy node: Cmd+C
     - Paste node: Cmd+V
     - Duplicate node: Cmd+D
     - Maintains configuration

5. **Properties Panel (Bottom Drawer)**
   - **Trigger:** Opens when node selected
   - **Height:** 300px (resizable, 200px-500px)
   - **Tabs:**
     - **Configuration:** Node-specific settings
     - **Conditions:** When to execute (optional)
     - **Advanced:** Timeout, retries, error handling

   - **Example: "Create Task" Action Node**
     ```
     ┌─────────────────────────────────────────────────┐
     │ Configuration  Conditions  Advanced              │
     ├─────────────────────────────────────────────────┤
     │ Task Title: [Input field]                       │
     │ Description: [Textarea]                         │
     │ Priority: [Dropdown: High/Medium/Low]           │
     │ Assign to: [Position/Person selector]           │
     │ Due date: [Date picker] or [Relative: +3 days]  │
     │ Checklist: [+ Add item]                         │
     │ Tags: [Tag input]                               │
     │                                                  │
     │ [Cancel] [Apply]                                │
     └─────────────────────────────────────────────────┘
     ```

   - **Dynamic Fields:**
     - Use variables from previous steps
     - Dropdown with @ mention syntax: "@trigger.formData.customerName"
     - Syntax highlighting for expressions
     - Live validation with error messages

6. **Testing Mode**
   - **Trigger:** Click "Test" button
   - **Test Modal:**
     - Input test data (if workflow has trigger inputs)
     - Select test organization/user
     - Choose execution speed (Fast/Real-time)
     - Start button

   - **Visual Execution:**
     - Nodes light up sequentially as executed
     - Success: Green pulse animation
     - Error: Red pulse, show error details
     - Pause/Resume buttons
     - Step-by-step controls

   - **Test Results Panel:**
     - Execution log (timestamped)
     - Variable values at each step
     - API request/response details
     - Performance metrics (execution time per node)
     - Success/failure summary

   - **Actions:**
     - Export test results
     - Rerun test
     - Compare with previous test

7. **Validation & Error Handling**
   - **Real-time Validation:**
     - Detect disconnected nodes
     - Identify circular dependencies
     - Highlight missing required configurations
     - Check for unreachable nodes (dead paths)

   - **Error Indicators:**
     - Red badge with count on invalid nodes
     - Tooltip explains error
     - Prevent publish if errors exist

   - **Warnings (non-blocking):**
     - Multiple end nodes
     - No error handling configured
     - Long execution paths (performance concern)

8. **Advanced Features**
   - **Versioning:**
     - Auto-save every 30 seconds (drafts)
     - Manual versions on publish
     - Version history sidebar
     - Compare versions (diff view)
     - Rollback to previous version

   - **Templates:**
     - Save workflow as template
     - Template marketplace
     - Quick start from template
     - Template categories

   - **Variables & Expressions:**
     - Global variables
     - Environment-specific variables (dev/prod)
     - Expression builder (GUI for complex logic)
     - Function library (date math, string manipulation, etc.)

   - **Subworkflows:**
     - Nest workflows within workflows
     - Reusable workflow components
     - Call subworkflow node
     - Pass parameters

9. **Minimap & Navigation**
   - **Minimap (Bottom-right corner):**
     - Shows entire workflow overview
     - Viewport indicator (draggable rectangle)
     - Click to jump to area
     - 150px × 100px size

   - **Breadcrumbs (if subworkflows):**
     - Show hierarchy
     - Click to navigate up
     - Example: "Main Workflow > Task Approval > Escalation"

   - **Find Node (Cmd+F):**
     - Search by node name/type
     - Highlight matches
     - Jump to result

**Responsive Behavior:**
- **Desktop (≥1280px):** Full layout with sidebar and bottom panel
- **Tablet (768px-1279px):** Collapsible sidebar, full canvas, bottom panel
- **Mobile (<768px):** List view of nodes, limited visual editing (view-only recommended)

**Accessibility:**
- Keyboard-only workflow creation (limited but possible)
- Screen reader announces node connections
- High contrast mode for nodes and connections
- Focus indicators on all interactive elements
- ARIA descriptions for workflow structure

**Mock Data Requirements:**
- 3 sample workflows:
  1. Simple: "New employee onboarding" (5 nodes)
  2. Medium: "Purchase approval" (12 nodes, conditional logic)
  3. Complex: "Project lifecycle" (20+ nodes, loops, parallel paths)
- Node library with 30+ node types
- Sample test data for each workflow
- Version history (3 versions per workflow)

**Technical Considerations:**
- Use React Flow library for node/edge management
- SVG for nodes and connections
- Auto-layout using Dagre algorithm
- Local storage for draft autosave
- WebSocket for real-time collaboration (future)
- JSON export format for workflows

---

### 6.4 Screen: Task Command Center

**Purpose:** Unified inbox for all assigned tasks with advanced filtering and bulk actions

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Header: My Tasks (24)  [+ New Task]  [🔔 Notifications]     │
├─────────────────────────────────────────────────────────────┤
│ Filters Bar: [All] [My Tasks] [Delegated] [Watching]        │
│              [Status ▼] [Priority ▼] [Due Date ▼] [Clear]   │
├──────────────┬──────────────────────────────────────────────┤
│ Left Panel   │              Task List                       │
│ (Filters)    │  ┌──────────────────────────────────────┐   │
│              │  │ ☐ [HIGH] Task Title                  │   │
│ Status       │  │     Due in 2 hours | @John Smith     │   │
│ □ Open (12)  │  │     [In Progress] [Edit] [View]      │   │
│ □ Progress(8)│  └──────────────────────────────────────┘   │
│ □ Review (3) │  ┌──────────────────────────────────────┐   │
│ □ Blocked(1) │  │ ☐ [MED] Another Task                 │   │
│              │  │     Due: Jan 18 | @Jane Doe          │   │
│ Priority     │  │     [Open] [Edit] [View]             │   │
│ □ High (5)   │  └──────────────────────────────────────┘   │
│ □ Medium(14) │  [Load more...]                             │
│ □ Low (5)    │                                              │
│              │                                              │
│ Assigned By  │                                              │
│ □ Me (8)     │                                              │
│ □ Manager(12)│                                              │
│ □ System (4) │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

**Key Components:**

1. **Header Section**
   - **Page Title:** "My Tasks" with count badge
   - **Primary Actions:**
     - Create New Task (prominent button)
     - Notifications (bell icon with unread count)
     - View selector (List / Kanban / Calendar views)

   - **Quick Actions Menu (⋮):**
     - Export tasks (CSV/Excel)
     - Print task list
     - Import tasks
     - Task settings

2. **Smart Filters Bar**
   - **Preset Views (Pills):**
     - All tasks
     - My Tasks (assigned to me)
     - Delegated (I assigned to others)
     - Watching (I'm following)
     - Overdue (past due date, red indicator)
     - Completed Today

   - **Filter Dropdowns:**
     - **Status:** Multi-select (Open, In Progress, Review, Blocked, Completed)
     - **Priority:** Multi-select (High, Medium, Low)
     - **Due Date:** Predefined ranges (Today, This Week, Next Week, Overdue, Custom)
     - **More Filters (...):** Project, Tags, Position, Department

   - **Active Filter Chips:**
     - Show selected filters
     - Click × to remove
     - Clear All button

   - **Search Bar:**
     - Full-text search across task titles, descriptions
     - Autocomplete with recent searches
     - Advanced search syntax: "priority:high status:open"

3. **Left Sidebar (Faceted Filters)**
   - **Width:** 240px
   - **Collapsible:** Button to hide/show
   - **Sections:**

     a. **Status (with counts):**
        - Checkboxes with task counts
        - Visual indicator (colored dot)

     b. **Priority:**
        - High (red), Medium (amber), Low (gray)
     - Count badges

     c. **Assigned By:**
        - List of users who assigned tasks
        - Avatar + name
        - Count

     d. **Project:**
        - List of active projects
        - Hierarchical (expand/collapse)

     e. **Tags:**
        - Cloud of tags (sized by frequency)
        - Click to filter

     f. **Date Ranges:**
        - Today, Tomorrow, This Week, Next Week, Later, No Due Date

     g. **Custom Filters:**
        - Saved searches (user-created)
        - Star favorites
        - Share filters with team

4. **Task List (Main Area)**
   - **List Layout:**
     - Card-based design
     - Alternating subtle background (zebra striping optional)
     - Hover: Elevated shadow, show quick actions
     - Selected: Primary border highlight

   - **Task Card Structure:**
     ```
     ┌─────────────────────────────────────────────────┐
     │ ☐ [Priority Badge] Task Title               [⋮] │
     │    Description preview (truncated)...           │
     │    ────────────────────────────────────────────│
     │    📅 Due: Jan 18, 2:00 PM | 👤 @John Smith    │
     │    📁 Project: Q1 Initiative | 🏷️ urgent       │
     │    [Status: In Progress ▼] [Comment] [Share]   │
     └─────────────────────────────────────────────────┘
     ```

   - **Card Elements:**
     - **Checkbox:** Mark complete (with animation)
     - **Priority Badge:** Color-coded pill (High=Red, Med=Amber, Low=Gray)
     - **Task Title:** --text-base, --font-medium, clickable
     - **Description Preview:** --text-sm, --text-secondary, 2-line truncate
     - **Metadata Row:**
       - Due date with icon (red if overdue, amber if due today)
       - Assigned user (avatar + @mention)
       - Project link
       - Tags (pills, first 3 shown, "+2 more")
     - **Action Bar:**
       - Status dropdown (inline change)
       - Comment button (count badge if comments exist)
       - Share button
     - **Menu (⋮):** Edit, Duplicate, Delegate, Delete

   - **Sorting Options:**
     - Due date (ascending/descending)
     - Priority (high to low)
     - Created date
     - Last updated
     - Alphabetical
     - Custom drag-and-drop order (saved per user)

5. **Multi-Select & Bulk Actions**
   - **Selection:**
     - Checkbox on each task card
     - Select all checkbox (header)
     - Shift+click for range selection
     - Cmd+click for individual selection

   - **Bulk Actions Bar (appears on selection):**
     ```
     ┌─────────────────────────────────────────────────┐
     │ ✓ 5 tasks selected | [Change Status ▼]         │
     │   [Assign to ▼] [Add Tag] [Move to Project ▼]  │
     │   [Bulk Edit] [Export] [Delete] [Deselect All] │
     └─────────────────────────────────────────────────┘
     ```
   - **Actions:**
     - Change status (dropdown)
     - Reassign (position/person picker)
     - Add/remove tags
     - Move to different project
     - Bulk edit (modal with common fields)
     - Export selected
     - Delete (with confirmation)

6. **Task Detail View (Modal or Side Panel)**
   - **Trigger:** Click task title
   - **Layout:** Large modal (800px width) or slide-out panel (500px)

   - **Sections:**

     a. **Header:**
        - Task title (editable inline)
        - Priority selector
        - Status selector
        - Assigned user (avatar + name)
        - Due date (inline date picker)
        - Close button

     b. **Description:**
        - Rich text editor (markdown support)
        - Inline editing
        - File attachments (drag-drop zone)
        - Link previews

     c. **Checklist:**
        - Sub-tasks with checkboxes
        - Progress indicator (3/5 completed)
        - Add new checklist item
        - Reorder by drag-drop

     d. **Routing Information:**
        - Show routing decision tree
        - AI explanation: "Routed to Manager because Priority=High"
        - Override routing button
        - Routing history

     e. **Activity Timeline:**
        - Chronological log
        - User avatars
        - Action types: Created, Assigned, Commented, Status changed
        - Timestamps
        - Comments section

     f. **Comments:**
        - Threaded comments
        - @mention support (autocomplete)
        - Rich text formatting
        - File attachments
        - Reactions (emoji)

     g. **Related Tasks:**
        - Dependencies (blockers/blocked by)
        - Linked tasks
        - Parent/child relationships

     h. **Metadata:**
        - Created by, Created date
        - Last modified by, Modified date
        - Task ID (copyable)
        - Project, Tags
        - Custom fields

     i. **Actions (Footer):**
        - Save (Cmd+S)
        - Delete (with confirmation)
        - Duplicate
        - Print
        - Export
        - Share (get link, email)

7. **Kanban View (Alternative Layout)**
   - **Trigger:** View selector → Kanban
   - **Layout:** Horizontal swimlanes by status
   ```
   ┌──────────────┬──────────────┬──────────────┬──────────────┐
   │ Open (12)    │In Progress(8)│  Review (3)  │ Completed(24)│
   │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │
   │ │Task Card │ │ │Task Card │ │ │Task Card │ │ │Task Card │ │
   │ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘ │
   │ ┌──────────┐ │ ┌──────────┐ │              │              │
   │ │Task Card │ │ │Task Card │ │              │              │
   │ └──────────┘ │ └──────────┘ │              │              │
   └──────────────┴──────────────┴──────────────┴──────────────┘
   ```
   - **Interactions:**
     - Drag cards between columns to change status
     - Scroll columns independently
     - Collapse/expand columns
     - Customize columns (add/remove/rename)
     - WIP limits (visual indicator when exceeded)

8. **Calendar View (Alternative Layout)**
   - **Trigger:** View selector → Calendar
   - **Layout:** Month/week/day views
   - **Features:**
     - Tasks displayed on due date
     - Color-coded by priority/project
     - Drag to reschedule
     - Multi-day tasks span across dates
     - Overdue tasks highlighted
     - Agenda view (list by day)

9. **Quick Actions & Shortcuts**
   - **Keyboard Shortcuts:**
     - `C` - Create new task
     - `?` - Show shortcuts help
     - `E` - Edit selected task
     - `Cmd+K` - Quick search
     - `J/K` - Navigate up/down task list
     - `Enter` - Open selected task
     - `Cmd+Enter` - Mark complete

   - **Command Palette (Cmd+K):**
     - Search tasks
     - Quick actions (Create, Filter, Export)
     - Navigate to other screens
     - Execute commands

10. **Notifications & Alerts**
    - **Types:**
      - New task assigned
      - Task due soon (24h, 1h warnings)
      - Task overdue
      - Status change
      - Comment/mention
      - Approval request

    - **Notification Panel:**
      - Slide-in from right
      - Grouped by type/date
      - Mark as read/unread
      - Quick actions (View, Dismiss, Snooze)
      - Settings (notification preferences)

**Advanced Features:**

1. **Smart Filters & Saved Views:**
   - Save current filter combination
   - Name and share views
   - Set as default view
   - Pinned views (quick access)

2. **Task Dependencies:**
   - Visual indicator on blocked tasks
   - Dependency graph view
   - Auto-notifications when blockers cleared

3. **Recurring Tasks:**
   - Repeat patterns (daily, weekly, monthly, custom)
   - Auto-creation on schedule
   - Series management

4. **Time Tracking:**
   - Start/stop timer on tasks
   - Manual time entry
   - Time logged by user
   - Reports and export

5. **Subtasks & Hierarchies:**
   - Nest tasks within tasks
   - Collapsible tree view
   - Progress rollup to parent

**Responsive Behavior:**
- **Desktop (≥1280px):** Full layout with sidebar
- **Tablet (768px-1279px):** Collapsible sidebar, full task list
- **Mobile (<768px):** Stack layout, filters in drawer, simplified cards

**Accessibility:**
- Full keyboard navigation
- Screen reader optimized
- ARIA labels and live regions
- Focus management
- Color blind safe colors

**Mock Data Requirements:**
- 50+ tasks (varied status, priority, due dates)
- 10 users (assignees)
- 5 projects
- 20 tags
- 100+ activity log entries
- 50+ comments

---

### 6.5 Screen: Calendar & Scheduling Hub

**Purpose:** Unified calendar view for time-based workflows, task scheduling, resource availability, and compliance deadlines

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Calendar - January 2025     [Today] [Day|Week|Month|Agenda] │
│ [< Prev] [Next >]  [Search...]  [Filters ▼]  [+ Create]   │
├───────────┬─────────────────────────────────────────────────┤
│ Mini Cal  │              Main Calendar View                 │
│           │                                                 │
│  Jan 2025 │   Mon 13  Tue 14  Wed 15  Thu 16  Fri 17      │
│ Su Mo Tu..│   ─────   ─────   ─────   ─────   ─────       │
│       1 2 │   9:00  │[Task A]│       │       │            │
│  3  4  5 │  10:00  │[Task B]│[Event]│       │            │
│  6  7  8 │  11:00  │       │       │[Task C]│            │
│  9 10 11 │  12:00  │ Lunch Break (Team)    │            │
│ 12 13 14 │  14:00  │       │[Review]│       │[Meeting]   │
│ 15 16 17 │  15:00  │[Task D]│       │       │            │
│ 18 19 20 │  16:00  │       │       │       │            │
│           │                                                 │
│ Calendars │  Weekend days grayed out                        │
│ ☑ My Tasks│  Hover shows details, Click opens side panel   │
│ ☑ Team    │                                                 │
│ ☑ Deadlin.│                                                 │
│ □ PTO     │                                                 │
│ □ Meetin. │                                                 │
└───────────┴─────────────────────────────────────────────────┘
```

**Key Components:**

1. **Calendar Header**
   - **Current Period Display:**
     - Large text: "January 2025"
     - Clickable to open date picker
     - Navigation arrows (< Previous, Next >)
     - Today button (jumps to current date)

   - **View Selector (Segmented Control):**
     - Day view (hourly breakdown)
     - Week view (5-day or 7-day)
     - Month view (grid layout)
     - Agenda view (chronological list)
     - Year view (mini month grid)
     - Timeline view (horizontal Gantt-like)

   - **Action Buttons:**
     - + Create (dropdown: Task, Event, Meeting, Recurring)
     - Search (quick find events/tasks)
     - Filters (calendar sources, types, assignees)
     - Export (iCal, Google Calendar)
     - Print view
     - Settings (calendar preferences)

2. **Left Sidebar**
   - **Mini Calendar (Date Picker):**
     - 200px × 200px
     - Current month display
     - Dot indicators on dates with events
     - Color-coded dots by calendar type
     - Click date to jump to that day
     - Multi-select dates (Cmd+Click) for range

   - **Calendar Sources (Checkboxes):**
     ```
     Calendars
     ☑ My Tasks (24)         [●] Blue
     ☑ Team Calendar (12)    [●] Green
     ☑ Deadlines (8)         [●] Red
     ☐ PTO/Leave (5)         [●] Purple
     ☐ Meetings (18)         [●] Amber
     ☐ Recurring Tasks (45)  [●] Teal
     ☐ Compliance (6)        [●] Orange
     ──────────────────
     + Create Calendar
     ```
   - Toggle visibility
   - Count of items per calendar
   - Color indicator
   - Drag to reorder
   - Edit/delete calendar

   - **Resource Availability:**
     - Team members list
     - Availability status (Available, Busy, Away, Focus Time)
     - Click to view detailed schedule
     - Filter events by person

3. **Month View (Default)**
   - **Grid Layout:**
     - 7 columns (days of week)
     - 5-6 rows (weeks)
     - Fixed-height cells (120px)
     - Header row: Sun, Mon, Tue, Wed, Thu, Fri, Sat

   - **Cell Design:**
     ```
     ┌──────────────────┐
     │ 15           [+] │  <- Date number, Add button
     ├──────────────────┤
     │ ▫️ Task A (9am) │  <- Event bars
     │ ▫️ Meeting (2pm)│
     │ ▫️ +3 more      │  <- Overflow indicator
     └──────────────────┘
     ```
   - Date number (top-left, --text-sm)
   - Today highlighted (primary border, background tint)
   - Event bars (colored by calendar, truncated text)
   - Overflow indicator ("+3 more")
   - Past dates: Reduced opacity
   - Weekends: Light gray background
   - Holidays: Special background color

   - **Event Bars:**
     - Height: 24px
     - Max 3 visible per cell
     - Color-coded left border (4px)
     - Icon + title (truncated)
     - Time indicator (if timed event)
     - Multi-day events span across cells
     - Hover: Tooltip with details
     - Click: Open detail panel

4. **Week View**
   - **Time Grid Layout:**
     - Vertical time axis (left): 12am-11pm (hourly)
     - Horizontal day columns: 7 days
     - Business hours highlighted (9am-5pm)
     - 30-minute grid lines (subtle)

   - **Event Blocks:**
     - Positioned by start time
     - Height based on duration
     - Stacked for overlapping events
     - Color-coded background
     - Resize handles (top/bottom) for drag-resize
     - Drag to move time/day
     - Double-click to edit

   - **All-Day Events:**
     - Special row above time grid
     - Spans multiple days if needed
     - Collapsible if many

   - **Current Time Indicator:**
     - Red horizontal line
     - Updates in real-time
     - Auto-scroll to current time

5. **Day View**
   - **Single Column Layout:**
     - Full hourly breakdown
     - 15-minute intervals visible
     - Large event blocks
     - More detail visible (description preview)

   - **Split View Option:**
     - Left: Current day schedule
     - Right: Task list for the day
     - Drag tasks from list to schedule

6. **Agenda View (List)**
   - **Chronological List:**
     ```
     ┌──────────────────────────────────────────┐
     │ Today - Wednesday, January 15            │
     ├──────────────────────────────────────────┤
     │ 9:00 AM  [Task A]                    ⋮  │
     │          Assigned to: John Smith         │
     │          Project: Q1 Initiative          │
     ├──────────────────────────────────────────┤
     │ 2:00 PM  [Review Meeting]            ⋮  │
     │          Duration: 1 hour                │
     │          Location: Conference Room A     │
     ├──────────────────────────────────────────┤
     │ Tomorrow - Thursday, January 16          │
     ├──────────────────────────────────────────┤
     │ All Day  [Compliance Deadline]       ⋮  │
     │          Status: Pending Review          │
     └──────────────────────────────────────────┘
     ```
   - Grouped by date
   - All-day events first
   - Timed events chronologically
   - Compact card design
   - Quick actions menu
   - Infinite scroll (loads future dates)

7. **Timeline View (Gantt-like)**
   - **Horizontal Layout:**
     - Vertical axis: Resources/People
     - Horizontal axis: Time (days/weeks)
     - Task bars span duration
     - Dependencies shown (arrows)
     - Useful for capacity planning

8. **Event/Task Detail Panel**
   - **Trigger:** Click any calendar item
   - **Slide-in from Right:** 500px width

   - **Sections:**
     a. **Header:**
        - Event/Task title (editable)
        - Calendar source badge
        - Status indicator
        - Close button

     b. **Time & Date:**
        - Start date/time picker
        - End date/time picker
        - All-day toggle
        - Time zone selector
        - Repeat/Recurrence settings

     c. **Assignment:**
        - Assigned to (person picker)
        - Assigned by
        - Notify assignee checkbox

     d. **Details:**
        - Description (rich text)
        - Location (for meetings)
        - Video conference link
        - Attachments (drag-drop)

     e. **Recurrence Settings (if recurring):**
        - Pattern: Daily, Weekly, Monthly, Yearly, Custom
        - Repeat every: [N] [days/weeks/months]
        - Repeat on: Days of week (checkboxes)
        - Ends: Never / After N occurrences / On date
        - Exception dates (skip holidays)

     f. **Reminders:**
        - Add reminder (dropdown: 15 min, 30 min, 1 hr, 1 day before)
        - Multiple reminders allowed
        - Notification method: Email, In-app, SMS

     g. **Participants (for meetings):**
        - List of attendees
        - Add participant (autocomplete)
        - Availability check (green=free, red=busy)
        - RSVP status (Accepted, Declined, Maybe)

     h. **Visibility & Sharing:**
        - Public / Private
        - Share calendar link
        - Permissions (View, Edit)

     i. **Actions (Footer):**
        - Save (Cmd+S)
        - Delete (with confirmation)
        - Duplicate
        - Convert to task/event
        - Add to different calendar

9. **Recurring Workflows**
   - **Create Recurring Task:**
     - Recurrence pattern selector
     - Preview: "Next 5 occurrences: Jan 15, Jan 22..."
     - Smart suggestions: "Every Monday at 9 AM"

   - **Edit Recurrence:**
     - Edit this occurrence only
     - Edit this and future occurrences
     - Edit all occurrences
     - Visual diff showing changes

   - **Skip Occurrences:**
     - Mark as exception
     - Reason field (optional)
     - Logged in audit trail

10. **Time-Based Workflow Triggers**
    - **Scheduled Workflows:**
      - Cron-like scheduler
      - Visual builder: "Run every [Monday] at [9:00 AM]"
      - Time zone aware
      - Execution history log

    - **Deadline-Based Triggers:**
      - "5 days before compliance deadline, create review task"
      - "1 day after task due date, send escalation"
      - Configurable lead/lag time

    - **Calendar as Trigger:**
      - "On each occurrence of [Event], do [Action]"
      - Example: "On monthly review meeting, generate report"

11. **Resource Scheduling & Availability**
    - **Team Availability View:**
      - Matrix: People × Time
      - Color-coded: Available (green), Busy (red), Away (gray)
      - Overlay tasks and meetings
      - Find available time slot

    - **Capacity Planning:**
      - Workload indicators per person
      - Overallocation warnings
      - Suggested alternative assignments

    - **Leave/PTO Calendar:**
      - Submit time-off request
      - Approval workflow
      - Out-of-office notifications
      - Coverage assignment

12. **Compliance Deadline Management**
    - **Deadline Cards:**
      - High-visibility design (red border)
      - Countdown timer
      - Required tasks/evidence
      - Progress indicator
      - Auto-reminders (7 days, 3 days, 1 day, overdue)

    - **Compliance Calendar Filter:**
      - Show only compliance items
      - Group by regulation type
      - Risk level indicators

    - **Recurring Compliance:**
      - Annual audits
      - Quarterly reviews
      - Monthly reports
      - Auto-create from template

13. **Drag & Drop Interactions**
    - **Drag from Task List:**
      - Grab task from sidebar
      - Drop on calendar to schedule
      - Shows time slot on hover

    - **Drag within Calendar:**
      - Move event to different time/day
      - Resize event duration
      - Ghost image shows new position
      - Snap to grid (15-min intervals)

    - **Drag to Create:**
      - Click-and-drag on empty space
      - Creates event block
      - Duration based on drag distance
      - Opens quick-create form

14. **Smart Scheduling Features**
    - **Find Available Time:**
      - Select participants
      - AI suggests best time slots
      - Considers: Working hours, existing meetings, preferences
      - One-click add to calendar

    - **Buffer Time:**
      - Auto-add 5-min buffers between meetings
      - Prevent back-to-back scheduling

    - **Focus Time Blocking:**
      - Block uninterrupted work time
      - Auto-decline meeting requests
      - Suggested focus blocks based on workload

15. **Integrations & Sync**
    - **External Calendar Sync:**
      - Google Calendar (two-way sync)
      - Outlook Calendar (two-way sync)
      - Apple Calendar (iCal)
      - Sync frequency: Real-time, 15 min, 1 hour

    - **Video Conference:**
      - Auto-generate Zoom/Teams links
      - Add to meeting description
      - Join button on event

    - **Task Integration:**
      - Calendar events linked to tasks
      - Task due dates show on calendar
      - Complete task from calendar

16. **Search & Filters**
    - **Advanced Search:**
      - Text search (titles, descriptions)
      - Filter by:
        - Calendar source
        - Date range
        - Assigned person
        - Status
        - Recurrence (recurring only)
        - Has attachments
        - Priority

    - **Saved Searches:**
      - "My overdue tasks"
      - "Team meetings this month"
      - "Upcoming compliance deadlines"

17. **Notifications & Reminders**
    - **Notification Types:**
      - Upcoming event (customizable lead time)
      - Event changed/cancelled
      - New invitation
      - RSVP response
      - Overdue task

    - **Snooze Feature:**
      - Snooze reminder for 5 min, 15 min, 1 hour
      - Custom snooze time

18. **Calendar Settings**
    - **Preferences:**
      - First day of week (Sunday/Monday)
      - Default view (Month/Week/Day)
      - Time format (12h/24h)
      - Time zone
      - Working hours (start/end)
      - Working days (exclude weekends)

    - **Notification Settings:**
      - Enable/disable notification types
      - Quiet hours
      - Notification sound

    - **Calendar Colors:**
      - Customize calendar source colors
      - Color themes (Light, Dark, High Contrast)

19. **Mobile-Specific Features**
    - **Swipe Gestures:**
      - Swipe left/right to change day/week
      - Swipe down to refresh
      - Long-press to quick-add

    - **Bottom Sheet:**
      - Event details slide up from bottom
      - Native date/time pickers

**Advanced Features:**

1. **Meeting Scheduler:**
   - Poll attendees for availability
   - Propose multiple time options
   - Vote on best time
   - Auto-schedule winner

2. **Calendar Sharing:**
   - Share individual calendar
   - Public URL (read-only)
   - Embed in website
   - Subscribe link (iCal format)

3. **Calendar Analytics:**
   - Time spent in meetings (weekly/monthly)
   - Task completion trends
   - Busiest days/times
   - Meeting effectiveness score

4. **Smart Suggestions:**
   - "You have 3 hours of free time tomorrow morning"
   - "Task A due in 2 days, schedule time?"
   - "Meetings are 40% of your week, consider blocking focus time"

**Responsive Behavior:**
- **Desktop (≥1280px):** Full layout with sidebar
- **Tablet (768px-1279px):** Collapsible sidebar, week/month view optimized
- **Mobile (<768px):** Agenda view default, simplified day view, drawer for mini calendar

**Accessibility:**
- Keyboard navigation (arrow keys to move dates, Enter to select)
- Screen reader announces date changes
- Focus indicators on all interactive elements
- ARIA labels for calendar grid
- Color-blind safe event colors

**Mock Data Requirements:**
- 100+ calendar events (past 30 days + future 60 days)
- 20 recurring events/tasks
- 10 compliance deadlines
- 8 team members with availability
- 15 meetings with multiple participants
- 5 all-day events
- 3 multi-day events

**Technical Considerations:**
- **Calendar Libraries:**
  - FullCalendar.js (recommended - feature-rich, customizable)
  - React Big Calendar (React-based)
  - Toast UI Calendar (open-source, modern)

- **Date Handling:**
  - date-fns or Day.js (lightweight, immutable)
  - Handle time zones correctly
  - DST awareness

- **Performance:**
  - Lazy load events (viewport-based)
  - Virtual scrolling for long agenda lists
  - Debounce drag operations
  - Cache rendered views

- **Data Model:**
  ```json
  {
    "id": "evt-001",
    "type": "task|event|deadline",
    "title": "Review Q1 Budget",
    "description": "...",
    "start": "2025-01-15T14:00:00Z",
    "end": "2025-01-15T15:00:00Z",
    "allDay": false,
    "calendarId": "cal-tasks",
    "assignedTo": "user-123",
    "location": "Conference Room A",
    "recurrence": {
      "pattern": "weekly",
      "interval": 1,
      "daysOfWeek": [1, 3, 5],
      "endDate": "2025-12-31"
    },
    "reminders": [
      { "method": "email", "minutes": 60 }
    ],
    "status": "scheduled",
    "metadata": {}
  }
  ```

---

### 6.6 Screen: Template Gallery

**Purpose:** Searchable library of pre-built workflow and project templates

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Template Gallery - 100+ Templates Ready to Use              │
│ [Search templates...] [Category ▼] [Industry ▼] [Sort ▼]   │
├───────────┬─────────────────────────────────────────────────┤
│Categories │           Template Grid                         │
│           │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│□ All(100+)│ │Template│ │Template│ │Template│ │Template│   │
│□ Workflow │ │  Card  │ │  Card  │ │  Card  │ │  Card  │   │
│  (45)     │ │        │ │        │ │        │ │        │   │
│□ Project  │ └────────┘ └────────┘ └────────┘ └────────┘   │
│  (32)     │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│□ Complian.│ │Template│ │Template│ │Template│ │Template│   │
│  (15)     │ │  Card  │ │  Card  │ │  Card  │ │  Card  │   │
│□ Kanban   │ └────────┘ └────────┘ └────────┘ └────────┘   │
│  (8)      │                                                 │
│           │ [Load More] [Showing 1-12 of 100+]             │
│Industry   │                                                 │
│□ General  │                                                 │
│□ Tech     │                                                 │
│□ Finance  │                                                 │
│□ Health   │                                                 │
└───────────┴─────────────────────────────────────────────────┘
```

**Key Components:**

1. **Header & Search**
   - **Title:** "Template Gallery" with subtitle
   - **Search Bar:**
     - Prominent, full-width
     - Placeholder: "Search by name, category, or keywords..."
     - Real-time filtering
     - Search suggestions dropdown

   - **Filter Bar:**
     - Category dropdown (Workflow, Project, Compliance, Organizational)
     - Industry dropdown (All, Technology, Finance, Healthcare, Manufacturing, etc.)
     - Complexity filter (Basic, Intermediate, Advanced)
     - Setup time filter (< 15 min, 15-30 min, 30+ min)
     - Sort dropdown (Popular, Newest, Highest Rated, A-Z)
     - Clear filters button

2. **Left Sidebar Filters**
   - **Categories (Checkboxes with counts):**
     - All Templates (100+)
     - Workflow Templates (45)
     - Project Templates (32)
     - Compliance Templates (15)
     - Kanban Boards (8)

   - **Industry Filters:**
     - General Purpose
     - Technology & IT
     - Finance & Banking
     - Healthcare
     - Manufacturing
     - Retail & E-commerce
     - Government
     - Education

   - **Tags (Cloud):**
     - Common tags sized by frequency
     - Click to filter

   - **Ratings:**
     - 5 stars (★★★★★)
     - 4 stars and up
     - 3 stars and up

   - **Features:**
     - Has automation
     - Includes approvals
     - Compliance ready
     - Pre-built reports

3. **Template Card Design**
   ```
   ┌──────────────────────────────┐
   │ [Preview Image/Diagram]      │
   │                              │
   ├──────────────────────────────┤
   │ Template Name                │
   │ By [Creator] | [Category]    │
   │ ────────────────────────────│
   │ Short description of what    │
   │ this template does...        │
   │ ────────────────────────────│
   │ ⭐ 4.8 (124) | 🚀 2.5k uses  │
   │ 📦 12 tasks | ⏱️ 15 min     │
   │ ────────────────────────────│
   │ [Preview] [Use Template]     │
   └──────────────────────────────┘
   ```

   - **Card Dimensions:** 320px × 420px
   - **Preview Image:** 320px × 180px (16:9 ratio)
   - **Elements:**
     - Preview thumbnail (workflow diagram or project screenshot)
     - Template name (--text-lg, --font-semibold)
     - Creator badge (System, Community, Custom)
     - Category badge (colored pill)
     - Description (3 lines max, truncated with "...")
     - Rating (stars + count)
     - Usage count (social proof)
     - Complexity indicator (tasks/steps count)
     - Setup time estimate
     - Primary action: "Use Template" button
     - Secondary action: "Preview" link

   - **Card States:**
     - Default: --shadow-sm
     - Hover: --shadow-lg, elevated, show quick view button
     - Favorite: Heart icon in top-right corner (filled if favorited)
     - Used: Checkmark badge "You've used this"

4. **Template Grid Layout**
   - **Desktop (≥1280px):** 4 columns
   - **Tablet (768px-1279px):** 2-3 columns
   - **Mobile (<768px):** 1 column (list view)
   - **Spacing:** --space-6 gap between cards
   - **Pagination:** Load more button or infinite scroll
   - **Empty State:** "No templates match your filters" with clear filters button

5. **Template Preview Modal**
   - **Trigger:** Click "Preview" button
   - **Modal Size:** 1000px × 700px (responsive)

   - **Layout:**
     ```
     ┌───────────────────────────────────────────────┐
     │ Template Name                    [× Close]     │
     ├───────────────────────────────────────────────┤
     │ [Visual Preview]           Details Panel      │
     │ - Workflow diagram         - Description      │
     │ - Task list                - Features         │
     │ - Screenshots              - Requirements     │
     │ (Carousel/Tabs)            - Reviews          │
     ├───────────────────────────────────────────────┤
     │ [Cancel] [Add to Favorites] [Use Template]    │
     └───────────────────────────────────────────────┘
     ```

   - **Visual Preview Section (Left 60%):**
     - Tabs: Overview, Workflow, Tasks, Screenshots
     - **Overview:** High-level diagram
     - **Workflow:** Detailed workflow visualization
     - **Tasks:** List of tasks/steps included
     - **Screenshots:** Gallery of final result
     - Zoom/Pan controls for diagrams

   - **Details Panel (Right 40%):**
     - **Header:**
       - Template name
       - Rating (stars + count)
       - Usage count
       - Favorite button

     - **Description:**
       - Full description (markdown support)
       - Use cases
       - Benefits

     - **Features List:**
       - Automation included
       - Approval workflows
       - Compliance tracking
       - Custom fields
       - Notifications

     - **Requirements:**
       - Minimum role/permissions
       - Dependencies (other templates)
       - Setup time
       - Complexity level

     - **What's Included:**
       - Number of tasks/workflows
       - Pre-configured rules
       - Sample data
       - Documentation

     - **Reviews Section:**
       - Recent reviews (3-5)
       - Rating breakdown (5★: 80%, 4★: 15%, etc.)
       - View all reviews link

   - **Actions (Footer):**
     - Cancel (close modal)
     - Add to Favorites (heart icon)
     - Use Template (primary button)

6. **Use Template Flow**
   - **Trigger:** Click "Use Template" button
   - **Step 1: Confirmation Modal**
     ```
     ┌───────────────────────────────────────┐
     │ Use Template: "Employee Onboarding"  │
     ├───────────────────────────────────────┤
     │ This will create:                     │
     │ ✓ 12 tasks                           │
     │ ✓ 3 approval workflows               │
     │ ✓ 5 notification rules               │
     │                                       │
     │ Customize before creating?           │
     │ ○ Yes, let me configure              │
     │ ● No, use default settings           │
     │                                       │
     │ [Cancel] [Continue]                  │
     └───────────────────────────────────────┘
     ```

   - **Step 2: Customization (Optional)**
     - Form with key settings
     - Task assignments (positions/people)
     - Due dates (relative or absolute)
     - Notification preferences
     - Custom field values
     - Save as new template option

   - **Step 3: Creation**
     - Progress indicator
     - "Creating your [Template Name]..."
     - Animated checkmarks for each item created
     - Success message with links to created items

7. **My Templates Section**
   - **Tab:** "All Templates" / "My Templates" / "Favorites"
   - **My Templates:**
     - User-created templates
     - Modified system templates
     - Actions: Edit, Duplicate, Share, Delete

   - **Favorites:**
     - Bookmarked templates
     - Quick access
     - Remove from favorites

8. **Create Custom Template**
   - **Button:** "+ Create Template" (prominent)
   - **Form Fields:**
     - Template name *
     - Category *
     - Description *
     - Tags (multi-select)
     - Base template (optional, start from existing)
     - Visibility (Private, Team, Public)
     - Preview image (upload)

   - **Builder:**
     - Same interface as Workflow Designer
     - Define tasks/workflows
     - Set default values
     - Add variables (placeholders for customization)
     - Test template

   - **Publish:**
     - Review & preview
     - Publish to gallery (if approved)
     - Share link

9. **Template Details Page**
   - **URL:** /templates/{template-id}
   - **Full-page layout (not modal)**
   - **Sections:**
     - Hero section (large preview)
     - Description
     - Features
     - Screenshots/Diagrams
     - Reviews & Ratings
     - Related templates
     - FAQ
     - Comments/Discussion

   - **Sidebar:**
     - Use Template button (sticky)
     - Template metadata
     - Creator info
     - Last updated
     - Version number

10. **Advanced Features**
    - **Version Control:**
      - Templates have versions
      - Changelog displayed
      - Update notifications for templates in use

    - **Template Marketplace:**
      - Community-contributed templates
      - Rating & review system
      - Verified/Featured badges
      - Download count

    - **Template Bundles:**
      - Curated collections
      - "Startup Essentials" bundle
      - "Compliance Starter Pack"
      - One-click install bundle

    - **AI Recommendations:**
      - "Based on your role..."
      - "Similar to templates you've used"
      - "Trending in your industry"

**Responsive Behavior:**
- **Desktop (≥1280px):** 4-column grid with sidebar
- **Tablet (768px-1279px):** 2-3 columns, collapsible sidebar
- **Mobile (<768px):** 1 column, filters in drawer

**Accessibility:**
- Keyboard navigation through grid
- Screen reader descriptions for templates
- Focus indicators
- ARIA labels

**Mock Data Requirements:**
- 50+ template cards (varied categories)
- 10 featured templates
- Sample reviews for each template
- Preview images/diagrams
- Usage statistics

---

### 6.6 Screen: Authentication & Onboarding

**Purpose:** Secure login and guided first-time user experience

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│                    [LOGO] AI Org Platform                    │
│                                                               │
│          ┌───────────────────────────────┐                  │
│          │     Welcome Back              │                  │
│          │                               │                  │
│          │ Email: [____________]         │                  │
│          │ Password: [____________]      │                  │
│          │ ☐ Remember me                │                  │
│          │                               │                  │
│          │ [Sign In]                     │                  │
│          │                               │                  │
│          │ ─────── OR ───────           │                  │
│          │                               │                  │
│          │ [🔵 Sign in with SSO]        │                  │
│          │ [Forgot password?]            │                  │
│          │                               │                  │
│          └───────────────────────────────┘                  │
│                                                               │
│          Don't have an account? [Sign up]                    │
└─────────────────────────────────────────────────────────────┘
```

**Screens:**

1. **Login Screen**
2. **SSO Authentication**
3. **Password Reset**
4. **New User Registration**
5. **Multi-Factor Authentication**
6. **Onboarding Flow (5 steps)**

*[Detailed specs for auth screens...]*

---

### 6.7 Additional Screens (Summary)

**6.7.1 Project Portfolio**
- Gantt chart view
- Kanban board layout
- Resource allocation
- Timeline visualization
- Project cards with progress

**6.7.2 Compliance Control Room**
- Compliance dashboard
- Requirements checklist
- Audit trail table
- Risk heat map
- Evidence upload

**6.7.3 Analytics Studio**
- Custom dashboard builder
- Chart library (50+ types)
- Data table views
- Filter panels
- Export functionality

**6.7.4 Admin Console**
- User management table
- Role & permissions matrix
- System settings forms
- Audit log viewer
- Integration configuration

*[Each screen would have similar detailed specifications as above]*

---

## 7. Interaction Patterns & Workflows

### 7.1 Common Interaction Patterns

#### Pattern 1: Drag and Drop
**Use Cases:** Org chart editing, workflow designer, Kanban boards, task prioritization

**Implementation:**
```javascript
// Using SortableJS or DnD Kit
- Visual feedback: Ghost image, drop zone highlight
- Cursor changes: grab → grabbing
- Constraints: Valid drop zones only
- Undo/Redo: Support cancellation
```

**Visual Feedback:**
- Source item: Reduced opacity (0.5)
- Ghost/drag image: Follows cursor, --shadow-xl
- Drop zones: Dashed border, background color change
- Invalid zones: Red border, cursor: not-allowed
- Success: Green pulse animation, smooth transition

#### Pattern 2: Modal Dialogs
**Use Cases:** Task details, confirmations, forms, previews

**Design:**
- Backdrop: rgba(0, 0, 0, 0.5), backdrop-blur-sm
- Modal: Max-width 800px, --radius-xl, --shadow-2xl
- Animation: Scale + fade-in (200ms)
- Close methods: X button, Escape key, click backdrop
- Focus trap: Tab cycles within modal
- Scroll: Body scroll locked, modal scrolls if content overflows

#### Pattern 3: Toast Notifications
**Use Cases:** Success/error feedback, updates, warnings

**Design:**
- Position: Top-right corner (stack vertically)
- Size: 400px × auto
- Duration: 5s (dismissible before timeout)
- Types:
  - Success: Green border, checkmark icon
  - Error: Red border, X icon
  - Warning: Amber border, alert icon
  - Info: Blue border, info icon
- Animation: Slide-in from right
- Actions: Undo button, link to details

#### Pattern 4: Inline Editing
**Use Cases:** Task titles, labels, descriptions

**Flow:**
1. Default: Display value, subtle edit icon on hover
2. Click: Transform to input field, select text
3. Edit: Type new value, validation feedback
4. Save: Click outside, Enter key, or Save button
5. Cancel: Escape key or Cancel button
6. Feedback: Success toast or error message

#### Pattern 5: Progressive Disclosure
**Use Cases:** Complex forms, advanced filters, settings

**Approach:**
- Show essential fields first
- "Show more" link reveals additional options
- Accordion sections for grouped settings
- Tooltips for explanations
- Help icon (?) with popover

#### Pattern 6: Empty States
**Use Cases:** No data, no search results, new users

**Design:**
- Illustration (friendly, brand-aligned)
- Headline: "No [items] yet"
- Subtext: Brief explanation
- Call-to-action: "+ Create [item]" button
- Secondary action: "Import", "Learn more"

#### Pattern 7: Loading States
**Use Cases:** API requests, data fetching, processing

**Types:**
- **Skeleton screens:** Content placeholder (preferred)
- **Spinner:** Circular progress (global or inline)
- **Progress bar:** For multi-step processes
- **Shimmer effect:** Animated gradient across skeleton

**Guidelines:**
- Show immediately (no delay)
- Indicate progress if possible
- Provide cancel option for long operations
- Timeout: Show error after 30s

#### Pattern 8: Search & Autocomplete
**Use Cases:** Global search, user pickers, filters

**Features:**
- Instant search (debounced 300ms)
- Autocomplete suggestions
- Recent searches
- Categories in results
- Keyboard navigation (arrows, Enter)
- Clear button
- No results state

### 7.2 Key User Workflows

#### Workflow A: Create and Route Task
```
1. Dashboard → Click "+ New Task"
2. Modal opens with form
3. Fill required fields (Title, Description)
4. Select Position/Person (with search)
5. AI suggests routing → Show explanation
6. User can override → Select different route
7. Set priority, due date, tags
8. Click "Create Task"
9. Confirmation toast → Link to task
10. Task appears in assignee's inbox
11. Notification sent
```

#### Workflow B: Edit Organizational Chart
```
1. Navigation → Organization
2. Org Chart Canvas loads
3. Click "Edit Mode" toggle
4. Drag position node to new parent
5. Drop zone highlights → Green if valid
6. Confirmation dialog: "Move [Position]?"
7. Click "Confirm"
8. Animation: Node transitions to new location
9. Connections redraw
10. Success toast: "Position updated"
11. Auto-save draft
12. Click "Publish Changes" → Review diff → Confirm
```

#### Workflow C: Use Workflow Template
```
1. Navigation → Templates
2. Browse/search templates
3. Click template card
4. Preview modal opens
5. Review details, diagrams
6. Click "Use Template"
7. Customization form opens
8. Assign positions, set dates
9. Click "Create"
10. Progress indicator shows items being created
11. Success: Redirect to workflow designer
12. Workflow ready to activate
```

---

## 8. Responsive Design Strategy

### 8.1 Breakpoint System

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Tablet portrait */
--breakpoint-md: 768px;   /* Tablet landscape */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large screens */
```

### 8.2 Responsive Behavior by Screen

| Screen | Desktop (≥1280px) | Tablet (768-1279px) | Mobile (<768px) |
|--------|-------------------|---------------------|-----------------|
| Dashboard | Full 2-column layout | Stack widgets | Vertical stack |
| Org Chart | Full canvas + panel | Canvas, overlay panel | List view alternative |
| Workflow Designer | Sidebar + canvas | Collapsible sidebar | View-only recommended |
| Task Center | Sidebar + list | Collapsible sidebar | Stack, filters in drawer |
| Templates | 4-column grid | 2-3 columns | 1 column |

### 8.3 Mobile Optimization

**Touch Targets:**
- Minimum: 44px × 44px (Apple HIG)
- Spacing: Minimum 8px between targets

**Navigation:**
- Bottom tab bar (main navigation)
- Hamburger menu for secondary items
- Swipe gestures (back, dismiss)

**Forms:**
- Vertical stack, full-width inputs
- Native date/time pickers
- Auto-focus first field
- Submit button sticky at bottom

**Tables:**
- Card view on mobile
- Horizontal scroll for data tables
- Expandable rows for details

---

## 9. Implementation Guidelines

### 9.1 Development Process

**Phase 1: Setup (Days 1-2)**
1. Initialize project structure
2. Setup CSS variables (design tokens)
3. Configure Tailwind CSS
4. Create base HTML template
5. Setup asset pipeline

**Phase 2: Component Library (Days 3-5)**
1. Build atomic components
   - Buttons, inputs, labels
   - Cards, badges, pills
   - Icons, avatars
   - Dropdowns, modals
2. Document components
3. Create component showcase page

**Phase 3: Navigation Shell (Days 6-7)**
1. Global header
2. Sidebar navigation
3. Breadcrumbs
4. Footer
5. Responsive behavior

**Phase 4: Screen Implementation (Days 8-30)**
- Follow priority order (P0 → P1 → P2 → P3)
- One screen at a time
- Review after each screen

**Phase 5: Polish & QA (Days 31-35)**
1. Cross-browser testing
2. Responsive testing
3. Accessibility audit
4. Performance optimization
5. Documentation

### 9.2 Code Standards

**HTML:**
- Semantic HTML5 elements
- BEM naming convention for classes
- Data attributes for JS hooks
- ARIA labels and roles

**CSS:**
- Use CSS custom properties
- Mobile-first media queries
- Avoid !important
- Comment complex logic

**JavaScript:**
- ES6+ syntax
- Modular code (separate files)
- Event delegation where possible
- Commented and readable

### 9.3 File Naming Conventions

```
- Screens: 01-dashboard.html, 02-org-chart.html
- Styles: component-name.css, screen-name.css
- Scripts: component-name.js, utilities.js
- Assets: icon-name.svg, image-description.png
```

### 9.4 Version Control

**Git Workflow:**
- Main branch: Production-ready mockups
- Develop branch: Work in progress
- Feature branches: feature/screen-name
- Commit messages: "feat: Add task command center"

### 9.5 Documentation

**Include:**
- README.md (setup, structure, usage)
- Component documentation
- Screen specifications
- Design token reference
- Interaction notes

---

## 10. Quality Assurance Checklist

### 10.1 Visual Design
- [ ] Consistent spacing (8-point grid)
- [ ] Correct colors (design system)
- [ ] Typography hierarchy
- [ ] Proper shadows and borders
- [ ] Dark mode support
- [ ] Print styles (if applicable)

### 10.2 Functionality
- [ ] All interactive elements work
- [ ] Forms validate correctly
- [ ] Modals open/close properly
- [ ] Dropdowns function
- [ ] Search works
- [ ] Filters apply correctly
- [ ] Sorting works
- [ ] Pagination works

### 10.3 Responsive Design
- [ ] Mobile (375px) tested
- [ ] Tablet (768px) tested
- [ ] Desktop (1280px, 1920px) tested
- [ ] Touch targets ≥ 44px on mobile
- [ ] No horizontal scroll (unintended)
- [ ] Images responsive
- [ ] Text readable at all sizes

### 10.4 Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 10.5 Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast ≥ 4.5:1
- [ ] Screen reader tested
- [ ] No ARIA errors
- [ ] Semantic HTML used
- [ ] Alt text on images

### 10.6 Performance
- [ ] Page load < 2 seconds
- [ ] Images optimized
- [ ] CSS minified
- [ ] JS minified
- [ ] No console errors
- [ ] Smooth animations (60fps)

### 10.7 Content
- [ ] All lorem ipsum replaced
- [ ] Realistic mock data
- [ ] Proper spelling/grammar
- [ ] Consistent terminology
- [ ] Accurate labels
- [ ] Helpful error messages

---

## Appendix A: Design Resources

### A.1 Fonts
- **Inter:** https://fonts.google.com/specimen/Inter
- **JetBrains Mono:** https://www.jetbrains.com/lp/mono/

### A.2 Icons
- **Lucide:** https://lucide.dev/
- **Heroicons:** https://heroicons.com/

### A.3 Illustrations
- **unDraw:** https://undraw.co/
- **Storyset:** https://storyset.com/

### A.4 Libraries & Tools
- **Tailwind CSS:** https://tailwindcss.com/
- **Ant Design:** https://ant.design/
- **D3.js:** https://d3js.org/
- **React Flow:** https://reactflow.dev/
- **Chart.js:** https://www.chartjs.org/
- **SortableJS:** https://sortablejs.github.io/Sortable/

### A.5 Color Tools
- **Coolors:** https://coolors.co/
- **Color Hunt:** https://colorhunt.co/

### A.6 Accessibility Testing
- **WAVE:** https://wave.webaim.org/
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

## Appendix B: Screen Specifications Summary Table

| # | Screen Name | Priority | Complexity | Components | Est. Hours |
|---|-------------|----------|------------|------------|------------|
| 1 | Dashboard Hub | P0 | High | KPIs, Charts, Lists | 16-20 |
| 2 | Org Chart Canvas | P0 | Very High | D3 Tree, Cards, Panel | 24-32 |
| 3 | Task Command Center | P0 | High | Tables, Filters, Modals | 16-20 |
| 4 | Workflow Designer | P1 | Very High | Flow Diagram, Forms | 24-32 |
| 5 | Template Gallery | P1 | Medium | Cards, Search, Modals | 8-12 |
| 6 | Auth & Onboarding | P1 | Medium | Forms, Wizards | 8-12 |
| 7 | Project Portfolio | P2 | High | Gantt, Kanban, Charts | 16-20 |
| 8 | Compliance Control | P2 | High | Dashboards, Tables | 16-20 |
| 9 | Analytics Studio | P3 | High | Custom Charts, Filters | 16-20 |
| 10 | Admin Console | P3 | Medium | Forms, Tables, Settings | 12-16 |

**Total: 160-200 hours**

---

## Appendix C: Component Library Checklist

### C.1 Core Components
- [ ] Button (primary, secondary, tertiary, danger)
- [ ] Input (text, email, password, number)
- [ ] Textarea
- [ ] Select dropdown
- [ ] Multi-select
- [ ] Checkbox
- [ ] Radio button
- [ ] Toggle switch
- [ ] Date picker
- [ ] Time picker
- [ ] File upload
- [ ] Search bar
- [ ] Tags input

### C.2 Navigation
- [ ] Sidebar nav
- [ ] Top nav
- [ ] Breadcrumbs
- [ ] Tabs
- [ ] Pagination
- [ ] Stepper

### C.3 Data Display
- [ ] Table
- [ ] Card
- [ ] List
- [ ] Avatar
- [ ] Badge
- [ ] Tag/Pill
- [ ] Tooltip
- [ ] Popover
- [ ] Progress bar
- [ ] Progress circle

### C.4 Feedback
- [ ] Alert
- [ ] Toast notification
- [ ] Modal
- [ ] Drawer/Panel
- [ ] Skeleton loader
- [ ] Spinner
- [ ] Empty state

### C.5 Charts
- [ ] Line chart
- [ ] Bar chart
- [ ] Pie chart
- [ ] Donut chart
- [ ] Gauge chart
- [ ] Area chart
- [ ] Gantt chart

---

## Appendix D: Mock Data Specifications

### D.1 Users (20 sample users)
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "avatar": "https://i.pravatar.cc/150?img=1",
  "role": "Manager",
  "department": "Engineering",
  "position": "Engineering Manager"
}
```

### D.2 Tasks (50 sample tasks)
```json
{
  "id": "task-001",
  "title": "Review Q1 Budget Proposal",
  "description": "Detailed review of the Q1 budget...",
  "status": "In Progress",
  "priority": "High",
  "assignedTo": "user-123",
  "assignedBy": "user-456",
  "dueDate": "2025-01-20T14:00:00Z",
  "createdDate": "2025-01-15T09:00:00Z",
  "project": "Q1 Planning",
  "tags": ["finance", "urgent"],
  "comments": 5,
  "subtasks": {
    "completed": 3,
    "total": 5
  }
}
```

### D.3 Organization Positions (50 nodes)
```json
{
  "id": "pos-001",
  "title": "CEO",
  "department": "Executive",
  "level": 1,
  "reportsTo": null,
  "assignedUser": "user-001",
  "directReports": 3,
  "status": "Filled",
  "location": "San Francisco",
  "employmentType": "Full-time"
}
```

### D.4 Workflow Templates (30 templates)
```json
{
  "id": "tmpl-001",
  "name": "Employee Onboarding",
  "category": "Workflow",
  "industry": "General",
  "description": "Complete onboarding process...",
  "rating": 4.8,
  "ratingsCount": 124,
  "usageCount": 2567,
  "complexity": "Basic",
  "setupTime": "15 minutes",
  "tasksIncluded": 12,
  "features": ["automation", "approvals"],
  "creator": "System",
  "previewImage": "url-to-image.png"
}
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | PM Team | Initial specification document |

---

**End of HTML Mockup Specification Document**
