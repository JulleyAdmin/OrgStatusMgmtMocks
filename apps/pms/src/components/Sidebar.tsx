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
  LayoutDashboard,
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
  Network
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
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
    name: 'Org Chart',
    href: '/org-chart',
    icon: BarChart3,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
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
  const pathname = usePathname()
  const { user, signOut } = useAuthStore()
  const router = useRouter()

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
          <nav className="space-y-1">
            {navigation.map((item) => {
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
            })}
          </nav>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="px-3 py-4 border-t border-gray-200">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                !isCollapsed ? "text-sm" : "justify-center"
              )}
            >
              <Users className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && "Add User"}
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                !isCollapsed ? "text-sm" : "justify-center"
              )}
            >
              <BarChart3 className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && "View Reports"}
            </Button>
          </div>
        </div>

      </div>
    </TooltipProvider>
  )
}
