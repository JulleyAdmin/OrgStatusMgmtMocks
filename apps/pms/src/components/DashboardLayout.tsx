'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Menu, ChevronRight, Bell, User, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
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
      '/org-chart': 'Organization Chart',
      '/users': 'Users',
      '/notifications': 'Notifications',
      '/settings': 'Settings'
    }
    
    return routeMap[path] || 'Dashboard'
  }

  // Function to get breadcrumb path
  const getBreadcrumb = (path: string) => {
    const segments = path.split('/').filter(Boolean)
    const breadcrumb = []
    
    if (segments.length === 0) {
      return ['Dashboard']
    }
    
    if (segments[0] === 'projects' && segments[1] === 'create') {
      return ['Projects', 'Create Project']
    }
    
    return segments.map(segment => {
      const capitalized = segment.charAt(0).toUpperCase() + segment.slice(1)
      return capitalized
    })
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-card border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Mobile menu button and breadcrumb */}
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2">
                {getBreadcrumb(pathname).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <span className={`text-sm font-medium ${
                      index === getBreadcrumb(pathname).length - 1 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                    }`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side - Notifications and User Profile */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
                </Button>
                
                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border z-[70]">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold text-card-foreground">Notifications</h3>
                    </div>
                    <div className="p-4">
                      <div className="text-center text-muted-foreground py-8">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p>No new notifications</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative" ref={profileRef}>
                <Button
                  variant="ghost"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-card-foreground">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.role || 'Employee'}
                    </p>
                  </div>
                </Button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg border border-border z-[70]">
                    <div className="p-4 border-b border-border">
                      <p className="font-semibold text-card-foreground">{user?.name || 'User'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
                    </div>
                    <div className="py-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2"
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          // Navigate to profile page
                        }}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2"
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          // Navigate to settings page
                        }}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Button>
                      <div className="border-t border-border my-2"></div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-destructive hover:text-destructive"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content with consistent spacing */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
