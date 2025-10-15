# Julley PMS - Project Management System

A comprehensive Next.js + Turbo monorepo project management system with Firebase backend, featuring advanced dashboard analytics, interactive org charts, workflow designer, and task management capabilities for manufacturing and technology operations.

## 🚀 Features

### Phase 1 - Core Features (Implemented)
- **Dashboard Hub** - KPIs, charts, and real-time activity feed
- **Interactive Org Chart** - D3.js visualization with zoom, pan, and search
- **Workflow Designer** - Drag-and-drop workflow builder with node types
- **Task Command Center** - Advanced filtering, search, and bulk actions
- **Authentication System** - Firebase Auth with role-based access

### Key Capabilities
- 📊 **Real-time Dashboard** with Chart.js visualizations
- 🌳 **Interactive Org Chart** with D3.js tree visualization
- 🔄 **Workflow Automation** with visual designer
- 📋 **Advanced Task Management** with faceted filters
- 👥 **User Management** with role-based permissions
- 🔐 **Secure Authentication** with Firebase Auth
- 📱 **Responsive Design** with Tailwind CSS
- 🎨 **Modern UI/UX** with Headless UI components

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router (stable)
- **React 18.3** - Latest React with improved performance
- **TypeScript** - Type-safe development with enhanced features
- **Tailwind CSS 4** - Next-generation utility-first CSS framework
- **Headless UI 2** - Accessible UI components
- **Heroicons** - Beautiful SVG icons
- **Framer Motion 11** - Animation library
- **Zustand** - State management
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

### Data Visualization
- **Chart.js** - Dashboard charts and analytics
- **D3.js v7** - Interactive org chart visualization
- **React Chart.js 2** - Chart.js React wrapper

### Backend & Database
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User management
- **Firebase Hosting** - Deployment (optional)

### Development Tools
- **Turbo 2.0** - Next-generation monorepo build system
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript 5.2** - Enhanced static type checking

## 📁 Project Structure

```
julley-pms/
├── apps/
│   ├── pms/                   # Main PMS application
│   │   ├── src/
│   │   │   ├── app/          # App Router pages
│   │   │   ├── components/   # React components
│   │   │   ├── lib/         # Utilities and services
│   │   │   ├── scripts/     # Database seeding scripts
│   │   │   ├── store/       # Zustand stores
│   │   │   ├── types/       # TypeScript type definitions
│   │   │   └── config/      # Company configuration
│   │   ├── public/          # Static assets
│   │   └── package.json     # Dependencies and scripts
│   └── platform/             # Multi-tenant platform app
│       ├── src/
│       └── package.json
├── package.json              # Root package.json
├── turbo.json               # Turbo configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd julley-pms
   ```

2. **Clean installation (Recommended)**
   ```bash
   ./clean-install.sh
   ```
   
   Or manually:
   ```bash
   # Remove existing node_modules and lock files
   rm -rf node_modules apps/pms/node_modules
   rm -f package-lock.json apps/pms/package-lock.json
   
   # Install dependencies
   npm install
   ```

3. **Configure Firebase**
   Create `.env.local` in `apps/pms/` with your Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Seed the database**
   ```bash
   cd apps/pms
   npm run seed:pms
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Demo Credentials

The seeding script creates demo users with the following credentials:

| Email | Password | Role | Department |
|-------|----------|------|------------|
| admin@autocracy.com | password123 | Admin | Executive |
| sarah.manager@autocracy.com | password123 | Manager | Manufacturing |
| mike.dev@autocracy.com | password123 | Employee | Engineering |
| lisa.designer@autocracy.com | password123 | Employee | Design |
| david.marketing@autocracy.com | password123 | Manager | Quality Assurance |

## 📊 Database Schema

### Collections
- **users** - User profiles and authentication
- **projects** - Project information and metadata
- **tasks** - Task management and tracking
- **workflows** - Workflow definitions and automation
- **activities** - Activity feed and audit trail
- **org_chart** - Organizational hierarchy data

### Key Relationships
- Users can be assigned to multiple projects
- Tasks belong to projects and have assignees
- Activities track user actions across the system
- Org chart defines reporting relationships
- Workflows define automated processes

## 🎯 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run clean        # Clean build artifacts
```

### Database Seeding
```bash
npm run seed         # Seed all data
npm run seed:users   # Seed users only
npm run seed:projects # Seed projects only
npm run seed:tasks   # Seed tasks only
npm run seed:activities # Seed activities only
npm run seed:org-chart # Seed org chart only
npm run seed:workflows # Seed workflows only
```

## 🎨 Design System

### Colors
- **Primary**: Blue palette (#3b82f6)
- **Success**: Green palette (#10b981)
- **Warning**: Yellow palette (#f59e0b)
- **Error**: Red palette (#ef4444)
- **Gray**: Neutral palette for text and backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive scale from 12px to 48px
- **Weights**: 300, 400, 500, 600, 700

### Components
- Consistent spacing using 8px grid system
- Accessible form controls with proper labels
- Responsive design for mobile and desktop
- Dark mode support (future enhancement)

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Add your web app and get configuration
5. Update `.env.local` with your config

### Environment Variables
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Docker
```bash
docker build -t julley-pms .
docker run -p 3000:3000 julley-pms
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [D3.js](https://d3js.org/) for data visualization
- [Chart.js](https://chartjs.org/) for chart components
- [Heroicons](https://heroicons.com/) for beautiful icons

## 📞 Support

For support, email support@julley.com or create an issue in the GitHub repository.

---

**Built with ❤️ by the Julley Team**
