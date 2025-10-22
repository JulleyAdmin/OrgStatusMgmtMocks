'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { getUserAssignments, getPosition, getDepartment } from '@/lib/org-services'
import { PositionAssignment, Position, Department } from '@/types/org-schema'
import { useCompany } from '@/contexts/CompanyContext'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MessageSquare, 
  Building2, 
  Briefcase, 
  Calendar,
  Award
} from 'lucide-react'

interface UserProfileViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function UserProfileView({
  open,
  onOpenChange,
  user,
}: UserProfileViewProps) {
  const { companyId } = useCompany()
  const [loading, setLoading] = useState(true)
  const [currentAssignment, setCurrentAssignment] = useState<PositionAssignment | null>(null)
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null)
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null)
  const [assignmentHistory, setAssignmentHistory] = useState<PositionAssignment[]>([])

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user || !companyId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Get user's position assignments
        const assignments = await getUserAssignments(companyId, user.id)
        setAssignmentHistory(assignments)
        
        // Find the active assignment
        const activeAssignment = assignments.find(a => a.status === 'active')
        
        if (activeAssignment) {
          setCurrentAssignment(activeAssignment)
          
          // Get position details
          const position = await getPosition(companyId, activeAssignment.positionId)
          setCurrentPosition(position)
          
          // Get department details
          if (position?.departmentId) {
            const department = await getDepartment(companyId, position.departmentId)
            setCurrentDepartment(department)
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (open && user) {
      loadUserProfile()
    }
  }, [open, user, companyId])

  if (!user) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>
            View detailed information about this user
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 pb-6 border-b">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-medium text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              {currentPosition ? (
                <p className="text-gray-600">{currentPosition.title}</p>
              ) : (
                <p className="text-gray-600">{user.position}</p>
              )}
              <div className="flex items-center mt-2 space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : user.role === 'manager' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
                {currentDepartment && (
                  <span className="text-sm text-gray-500">{currentDepartment.name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Current Position Assignment */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : currentAssignment && currentPosition ? (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Current Position Assignment</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Briefcase className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-blue-700 font-medium">Position</p>
                    <p className="text-sm text-blue-900 font-semibold">{currentPosition.title}</p>
                    {currentPosition.description && (
                      <p className="text-xs text-blue-700 mt-1">{currentPosition.description}</p>
                    )}
                  </div>
                </div>
                
                {currentDepartment && (
                  <div className="flex items-start space-x-3">
                    <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-blue-700 font-medium">Department</p>
                      <p className="text-sm text-blue-900">{currentDepartment.name}</p>
                      {currentDepartment.description && (
                        <p className="text-xs text-blue-700 mt-1">{currentDepartment.description}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-blue-700 font-medium">Assignment Period</p>
                    <p className="text-sm text-blue-900">
                      Started: {new Date(currentAssignment.startAt).toLocaleDateString()}
                    </p>
                    {currentAssignment.endAt && (
                      <p className="text-sm text-blue-900">
                        Ends: {new Date(currentAssignment.endAt).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-xs text-blue-600 mt-1 capitalize">
                      {currentAssignment.assignmentType} assignment
                    </p>
                  </div>
                </div>

                {currentPosition.requiredSkills && currentPosition.requiredSkills.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-blue-700 font-medium">Required Skills for Position</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentPosition.requiredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 text-center">No active position assignment found</p>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
              {user.contact?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{user.contact.phone}</p>
                  </div>
                </div>
              )}
              {user.contact?.slack && (
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Slack</p>
                    <p className="text-sm text-gray-900">{user.contact.slack}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Skills */}
          {user.skills && user.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Assignment History */}
          {assignmentHistory.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Position History</h3>
              <div className="space-y-2">
                {assignmentHistory.slice(0, 5).map((assignment, index) => (
                  <div 
                    key={assignment.id} 
                    className={`p-3 rounded-lg border ${
                      assignment.status === 'active' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Assignment {index + 1}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(assignment.startAt).toLocaleDateString()}
                          {assignment.endAt && ` - ${new Date(assignment.endAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        assignment.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member Since */}
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

