'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { COMPANY_CONFIG } from '@/config/company'
import { User } from '@/types'
import { Users, Plus, Mail, Phone, MessageSquare } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        
        // Load users from Firebase
        const usersRef = collection(db, 'users')
        const usersQuery = query(usersRef, orderBy('name', 'asc'))
        const usersSnapshot = await getDocs(usersQuery)
        
        const usersData: User[] = usersSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            email: data.email || '',
            name: data.name || 'Unknown User',
            role: data.role || 'employee',
            department: data.department || 'Unknown Department',
            position: data.position || 'Unknown Position',
            avatar: data.avatar || undefined,
            skills: data.skills || [],
            contact: {
              phone: data.contact?.phone || 'Not provided',
              slack: data.contact?.slack || 'Not provided'
            },
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString()
          }
        })
        
        setUsers(usersData)
        setError(null)
      } catch (error) {
        console.error('Error loading users:', error)
        setError('Failed to load users. Please try again.')
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'employee':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Users</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">Manage your {COMPANY_CONFIG.name} team members</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              </div>
              <ScrollArea className="h-96">
                <div className="p-6 space-y-4">
                  {users.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
                      <p className="text-gray-600 mb-4">Get started by adding your first team member.</p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First User
                      </Button>
                    </div>
                  ) : (
                    users.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-medium text-gray-600">
                              {user.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{user.position}</p>
                          <p className="text-sm text-gray-500">{user.department}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{user.contact?.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{user.contact?.slack || 'Not provided'}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(user.skills || []).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* User Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-semibold">{users.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Admins</span>
                  <span className="font-semibold text-red-600">
                    {users.filter(u => u.role === 'admin').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Managers</span>
                  <span className="font-semibold text-blue-600">
                    {users.filter(u => u.role === 'manager').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Employees</span>
                  <span className="font-semibold text-green-600">
                    {users.filter(u => u.role === 'employee').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments</h3>
              <div className="space-y-2">
                {Array.from(new Set(users.map(u => u.department))).map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{dept}</span>
                    <span className="font-semibold">
                      {users.filter(u => u.department === dept).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Invite User
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Team Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
