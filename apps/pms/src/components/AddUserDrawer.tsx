'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer'
import { useCompany } from '@/contexts/CompanyContext'
import { UserService } from '@/lib/user-services'
import { User } from '@/types'
import toast from 'react-hot-toast'

interface AddUserDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserAdded: (user: User) => void
}

export function AddUserDrawer({ open, onOpenChange, onUserAdded }: AddUserDrawerProps) {
  const { companyId } = useCompany()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
    position: '',
    phone: '',
    slack: '',
    skills: [] as string[],
    avatar: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!companyId) {
      toast.error('Company not found')
      return
    }

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      setLoading(true)
      
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'admin' | 'manager' | 'employee',
        department: formData.department,
        position: formData.position,
        contact: {
          phone: formData.phone,
          slack: formData.slack
        },
        skills: formData.skills,
        avatar: formData.avatar,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const newUser = await UserService.createUser(companyId, userData)
      onUserAdded(newUser)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        department: '',
        position: '',
        phone: '',
        slack: '',
        skills: [],
        avatar: ''
      })
      
      onOpenChange(false)
      toast.success('User created successfully!')
      
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast.error(error.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
    setFormData(prev => ({ ...prev, skills }))
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Add New User" description="Create a new team member">
      <DrawerContent className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {/* Role and Department */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Role & Department</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                  options={[
                    { value: 'employee', label: 'Employee' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'admin', label: 'Admin' }
                  ]}
                />
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Enter department"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Enter job position"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="slack">Slack Handle</Label>
                <Input
                  id="slack"
                  value={formData.slack}
                  onChange={(e) => handleInputChange('slack', e.target.value)}
                  placeholder="Enter Slack handle"
                />
              </div>
            </div>
          </div>

          {/* Skills and Avatar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                value={formData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder="Enter skills separated by commas"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple skills with commas
              </p>
            </div>

            <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                placeholder="Enter avatar image URL"
              />
            </div>
          </div>
        </form>
      </DrawerContent>
      
      <DrawerFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : null}
          Create User
        </Button>
      </DrawerFooter>
    </Drawer>
  )
}
