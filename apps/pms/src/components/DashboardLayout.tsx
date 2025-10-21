'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Menu, ChevronRight, Bell, User, Settings, LogOut, Home } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface DashboardLayoutProps {
  children: React.ReactNode
  projectName?: string
}

export function DashboardLayout({ children, projectName }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuthStore()
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Function to get page title based on route
  const getPageTitle = (path: string) => {
    const routeMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/tasks': 'Task Center',
      '/projects': 'Projects',
      '/projects/create': 'Create Project',
      '/workflow': 'Workflow Designer',
      '/organization': 'Organization',
      '/org-chart': 'Organization Chart',
      '/users': 'Users',
      '/notifications': 'Notifications',
      '/settings': 'Settings'
    }
    
    // Handle dynamic routes like /projects/[id]
    if (path.startsWith('/projects/') && path !== '/projects/create') {
      return projectName || 'Project Details'
    }
    
    return routeMap[path] || 'Dashboard'
  }

  // Function to get breadcrumb path
  const getBreadcrumb = (path: string) => {
    const segments = path.split('/').filter(Boolean)
    const breadcrumb = []
    
    if (segments.length === 0) {
      return [{ label: 'Dashboard', href: '/dashboard' }]
    }
    
    // Handle specific project routes
    if (segments[0] === 'projects') {
      breadcrumb.push({ label: 'Projects', href: '/projects' })
      
      if (segments[1] === 'create') {
        breadcrumb.push({ label: 'Create Project', href: '/projects/create' })
      } else if (segments[1] && segments[1] !== 'create') {
        // This is a project ID - use project name if available
        breadcrumb.push({ label: projectName || 'Project Details', href: `/projects/${segments[1]}` })
      }
    } else {
      // Default breadcrumb generation
      let currentPath = ''
      segments.forEach((segment, index) => {
        currentPath += `/${segment}`
        const capitalized = segment.charAt(0).toUpperCase() + segment.slice(1)
        breadcrumb.push({ 
          label: capitalized, 
          href: currentPath 
        })
      })
    }
    
    return breadcrumb
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setProfileDropdownOpen(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-64 h-full">
            <Sidebar className="relative" />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Mobile menu button and page title */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Page Title */}
              <h1 className="text-2xl font-semibold text-gray-900">
                {getPageTitle(pathname)}
              </h1>
            </div>
            
            {/* Right side - Notifications and User Profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative text-gray-500 hover:text-gray-700"
                >
                  <Bell className="w-5 h-5" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">46</span>
                </Button>
                
                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-[70]">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="p-4">
                      <div className="text-center text-gray-500 py-8">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No new notifications</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || 'S'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {user?.name || 'Admin User'}
                </span>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content with consistent spacing */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
