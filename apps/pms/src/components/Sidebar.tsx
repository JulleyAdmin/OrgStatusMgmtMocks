'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { COMPANY_CONFIG } from '@/config/company'
import {
  Home,
  CheckSquare,
  Users,
  Settings,
  Bell,
  Building2,
  Workflow,
  BarChart3,
  Menu,
  X,
  LogOut,
  Network,
  Inbox,
  FileText,
  UserCheck,
  Library
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { OrgChartDrawer } from '@/components/OrgChartDrawer'

// Main navigation - available to all users
const mainNavigation = [
  {
    name: 'Home',
    href: '/home',
    icon: Home,
  },
  {
    name: 'Inbox',
    href: '/inbox',
    icon: Inbox,
  },
  {
    name: 'My Tasks',
    href: '/my-tasks',
    icon: UserCheck,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
]

// Task Management - available to all users
const taskManagement = [
  {
    name: 'Task Center',
    href: '/tasks',
    icon: CheckSquare,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: Building2,
  },
  {
    name: 'Task Library',
    href: '/task-library',
    icon: Library,
  },
  {
    name: 'Task Templates',
    href: '/task-templates',
    icon: FileText,
  },
]

// Admin navigation - only for admin users
const adminNavigation = [
  {
    name: 'Workflow Designer',
    href: '/workflow',
    icon: Workflow,
  },
  {
    name: 'Organization',
    href: '/organization',
    icon: Network,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [orgChartOpen, setOrgChartOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuthStore()
  const router = useRouter()

  const isAdmin = user?.role === 'admin'

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully!')
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to logout. Please try again.')
    }
  }

  const renderNavItem = (item: typeof mainNavigation[0]) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    if (isCollapsed) {
      return (
        <Tooltip key={item.name}>
          <TooltipTrigger asChild>
            <Link href={item.href}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-full justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative",
                  isActive && "text-red-600 bg-red-50"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  isActive && "text-red-600"
                )} />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return (
      <Link key={item.name} href={item.href}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative",
            isActive && "text-red-600 bg-red-50 font-semibold"
          )}
        >
          <Icon className={cn(
            "mr-3 w-5 h-5",
            isActive && "text-red-600"
          )} />
          {item.name}
        </Button>
      </Link>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "flex h-full flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-lg">Admin Panel</h1>
                <p className="text-xs text-gray-500">{COMPANY_CONFIG.name}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>


        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main
                </p>
              )}
              {mainNavigation.map(renderNavItem)}
            </div>

            {/* Task Management */}
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Tasks
                </p>
              )}
              {taskManagement.map(renderNavItem)}
            </div>

            {/* Admin Section */}
            {isAdmin && (
              <div className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3">
                    <Separator className="my-2" />
                    <p className="px-0 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <span className="mr-2 text-blue-600">Admin</span>
                    </p>
                  </div>
                )}
                {isCollapsed && <Separator className="my-2" />}
                {adminNavigation.map(renderNavItem)}
              </div>
            )}
          </nav>
        </ScrollArea>

        {/* User Profile Section */}
        <div className="px-3 py-4 border-t border-gray-200">
          <div className="space-y-1">
            {!isCollapsed && user && (
              <div className="px-2 mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Profile
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Org Chart for All Users */}
            <Button
              variant="ghost"
              onClick={() => setOrgChartOpen(true)}
              className={cn(
                "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                !isCollapsed ? "text-sm" : "justify-center"
              )}
            >
              <BarChart3 className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && "Org Chart"}
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className={cn(
                "w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50",
                !isCollapsed ? "text-sm" : "justify-center"
              )}
            >
              <LogOut className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && "Sign Out"}
            </Button>
          </div>
        </div>

        {/* Org Chart Drawer */}
        <OrgChartDrawer open={orgChartOpen} onOpenChange={setOrgChartOpen} />

      </div>
    </TooltipProvider>
  )
}
