'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'
import { ProjectCreationForm } from '@/components/ProjectCreationForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  PRDAlignedProject, 
  Position, 
  WorkflowTemplate, 
  ComplianceRequirement 
} from '@/types/prd-aligned-schema'
import { EnhancedProject } from '@/types/project-schema'

export default function CreateProjectPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([])
  const [complianceRequirements, setComplianceRequirements] = useState<ComplianceRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock data for demo - in real implementation, this would come from Firebase
        const mockPositions: Position[] = [
          {
            id: 'pos-1',
            title: 'Manufacturing Manager',
            department: 'Manufacturing',
            level: 2,
            managerPositionId: 'pos-ceo',
            directReports: ['pos-engineer-1', 'pos-engineer-2'],
            matrixReports: [],
            skills: ['Project Management', 'Team Leadership', 'Quality Control'],
            responsibilities: ['Oversee manufacturing operations', 'Manage production schedules'],
            isActive: true,
            effectiveStartDate: '2024-01-01',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'pos-2',
            title: 'Senior Manufacturing Engineer',
            department: 'Engineering',
            level: 3,
            managerPositionId: 'pos-1',
            directReports: [],
            matrixReports: ['pos-quality-manager'],
            skills: ['CAD Design', 'Manufacturing Processes', 'Quality Assurance'],
            responsibilities: ['Design manufacturing systems', 'Implement quality controls'],
            isActive: true,
            effectiveStartDate: '2024-01-01',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'pos-3',
            title: 'Quality Manager',
            department: 'Quality Assurance',
            level: 2,
            managerPositionId: 'pos-ceo',
            directReports: [],
            matrixReports: ['pos-2'],
            skills: ['Quality Control', 'ISO Standards', 'Compliance'],
            responsibilities: ['Ensure quality standards', 'Manage compliance'],
            isActive: true,
            effectiveStartDate: '2024-01-01',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]

        const mockTemplates: WorkflowTemplate[] = [
          {
            id: 'template-1',
            name: 'Manufacturing Project Template',
            description: 'Standard template for manufacturing projects with quality gates',
            category: 'project',
            industry: ['Manufacturing'],
            department: ['Manufacturing', 'Engineering'],
            positionLevel: [2, 3],
            steps: [
              {
                id: 'step-1',
                name: 'Project Planning',
                description: 'Initial project planning and resource allocation',
                stepType: 'task',
                assignedPositionId: 'pos-1',
                routingRules: [],
                dependencies: [],
                estimatedHours: 40,
                definitionOfDone: [
                  {
                    id: 'dod-1',
                    text: 'Project charter approved',
                    isRequired: true,
                    evidenceType: 'approval',
                    validationRules: []
                  }
                ],
                isRequired: true,
                order: 1
              }
            ],
            approvalMatrix: {
              id: 'approval-1',
              name: 'Standard Project Approval',
              type: 'sequential',
              approvers: [
                {
                  id: 'level-1',
                  level: 1,
                  positionIds: ['pos-1'],
                  requiredApprovals: 1,
                  canDelegate: true,
                  timeoutHours: 24
                }
              ],
              escalationPolicy: {
                id: 'escalation-1',
                name: 'Standard Escalation',
                escalationSteps: [],
                maxEscalations: 2
              },
              timeoutHours: 72
            },
            complianceRequirements: [
              {
                id: 'comp-1',
                regulation: 'ISO 9001',
                region: 'Global',
                industry: 'Manufacturing',
                requirement: 'Quality management system compliance',
                deadlineType: 'relative',
                deadlineValue: '30 days',
                evidenceRequired: ['Quality audit report'],
                auditTrailRequired: true
              }
            ],
            estimatedDuration: 90,
            isActive: true,
            createdBy: 'admin',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]

        const mockCompliance: ComplianceRequirement[] = [
          {
            id: 'comp-sox',
            regulation: 'SOX',
            region: 'US',
            industry: 'Financial Services',
            requirement: 'Financial reporting controls',
            deadlineType: 'absolute',
            deadlineValue: '2024-12-31',
            evidenceRequired: ['Audit report', 'Control documentation'],
            auditTrailRequired: true
          },
          {
            id: 'comp-gdpr',
            regulation: 'GDPR',
            region: 'EU',
            industry: 'All',
            requirement: 'Data protection compliance',
            deadlineType: 'absolute',
            deadlineValue: '2024-12-31',
            evidenceRequired: ['Privacy impact assessment', 'Data processing agreement'],
            auditTrailRequired: true
          }
        ]

        setPositions(mockPositions)
        setWorkflowTemplates(mockTemplates)
        setComplianceRequirements(mockCompliance)

        // Mock current user
        setCurrentUser({
          id: 'user-1',
          name: 'John Admin',
          email: 'admin@autocracy.com',
          role: 'admin',
          department: 'Executive'
        })
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleProjectCreated = (project: EnhancedProject) => {
    console.log('Enhanced project created:', project)
    alert(`Project "${project.name}" created successfully!`)
    router.push('/projects')
  }

  const handleCancel = () => {
    router.push('/projects')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to create position-based projects.</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto">
          <div className="mb-6">
            <p className="text-gray-600">
              Create a new project using AI-Powered Organizational Hierarchy Platform with position-based architecture, intelligent routing, and compliance automation.
            </p>
          </div>
          
          <ProjectCreationForm
            onProjectCreated={handleProjectCreated}
            onCancel={handleCancel}
            currentUser={currentUser}
            positions={positions}
            workflowTemplates={workflowTemplates}
            complianceRequirements={complianceRequirements}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
