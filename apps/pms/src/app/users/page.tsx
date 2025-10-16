'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { COMPANY_CONFIG } from '@/config/company'
import { User } from '@/types'
import { useCompany } from '@/contexts/CompanyContext'
import { ViewToggle, ViewType } from '@/components/ui/view-toggle'
import { ActionMenu, createViewAction, createEditAction, createDeleteAction } from '@/components/ui/action-menu'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { AddUserDrawer } from '@/components/AddUserDrawer'
import { Users, Plus, Mail, Phone, MessageSquare } from 'lucide-react'
import { UserService } from '@/lib/user-services'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const { companyId, isLoading: companyLoading } = useCompany()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewType, setViewType] = useState<ViewType>('card')
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    user: User | null
  }>({ open: false, user: null })
  const [addUserDrawerOpen, setAddUserDrawerOpen] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      if (!companyId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Load users from Firebase for the current company
        const usersData = await UserService.getUsers(companyId)
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
  }, [companyId])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive'
      case 'manager':
        return 'bg-primary/10 text-primary'
      case 'employee':
        return 'bg-success/10 text-success'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (!companyId) return

    try {
      await UserService.deleteUser(companyId, user.id)
      setUsers(users.filter(u => u.id !== user.id))
      toast.success(`${user.name} has been deleted successfully`)
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user. Please try again.')
    }
  }

  const handleViewUser = (user: User) => {
    // TODO: Implement user detail view
    toast.success(`Viewing ${user.name}`)
  }

  const handleEditUser = (user: User) => {
    // TODO: Implement user edit form
    toast.success(`Editing ${user.name}`)
  }

  const handleUserAdded = (newUser: User) => {
    setUsers(prev => [...prev, newUser])
  }

  if (loading || companyLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto">
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
      <div className="mx-auto space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground">Manage your {COMPANY_CONFIG.name} team members</p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle currentView={viewType} onViewChange={setViewType} />
            <Button onClick={() => setAddUserDrawerOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-card-foreground">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-success">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold text-warning">
                  {new Set(users.map(u => u.department)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-warning" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online Now</p>
                <p className="text-2xl font-bold text-primary">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* User List */}
          <div>
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-xl font-semibold text-card-foreground">Team Members</h2>
              </div>
              <div className="p-4">
                {viewType === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-2 px-4 font-medium text-muted-foreground">Role</th>
                          <th className="text-left py-2 px-4 font-medium text-muted-foreground">Department</th>
                          <th className="text-left py-2 px-4 font-medium text-muted-foreground">Email</th>
                          <th className="text-left py-2 px-4 font-medium text-muted-foreground">Phone</th>
                          <th className="text-left py-2 px-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                  {user.avatar ? (
                                    <img 
                                      src={user.avatar} 
                                      alt={user.name}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {user.name.charAt(0)}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-card-foreground">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.position}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{user.department}</td>
                            <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-4 text-muted-foreground">{user.contact?.phone || 'Not provided'}</td>
                            <td className="py-3 px-4">
                              <ActionMenu
                                items={[
                                  createViewAction(() => handleViewUser(user)),
                                  createEditAction(() => handleEditUser(user)),
                                  createDeleteAction(() => setDeleteDialog({ open: true, user }))
                                ]}
                                size="sm"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-4">
                      {users.length === 0 ? (
                        <div className="text-center py-12">
                          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-card-foreground mb-2">No Users Found</h3>
                          <p className="text-muted-foreground mb-4">Get started by adding your first team member.</p>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First User
                          </Button>
                        </div>
                      ) : (
                        users.map((user) => (
                        <div key={user.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              {user.avatar ? (
                                <img 
                                  src={user.avatar} 
                                  alt={user.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-lg font-medium text-muted-foreground">
                                  {user.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium text-card-foreground">{user.name}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                  {user.role}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{user.position}</p>
                              <p className="text-sm text-muted-foreground">{user.department}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
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
                                {(Array.isArray(user.skills) ? user.skills : []).map((skill, index) => (
                                  <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <ActionMenu
                                items={[
                                  createViewAction(() => handleViewUser(user)),
                                  createEditAction(() => handleEditUser(user)),
                                  createDeleteAction(() => setDeleteDialog({ open: true, user }))
                                ]}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>
                        ))
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, user: null })}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteDialog.user?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={() => deleteDialog.user && handleDeleteUser(deleteDialog.user)}
      />

      {/* Add User Drawer */}
      <AddUserDrawer
        open={addUserDrawerOpen}
        onOpenChange={setAddUserDrawerOpen}
        onUserAdded={handleUserAdded}
      />
    </DashboardLayout>
  )
}
