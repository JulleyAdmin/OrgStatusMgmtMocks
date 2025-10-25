'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCompany } from '@/hooks/useCompany'
import { seedManufacturingTemplates } from '@/lib/seed-manufacturing-templates'
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function ManufacturingTemplateSeeder() {
  const { currentCompany } = useCompany()
  const [isSeeding, setIsSeeding] = useState(false)
  const [seededTemplates, setSeededTemplates] = useState<any[]>([])

  const manufacturingTemplates = [
    {
      name: "Daily Production Line Setup",
      category: "production",
      description: "Complete setup and calibration of production line equipment",
      estimatedHours: 2,
      priority: "high"
    },
    {
      name: "Quality Control Inspection", 
      category: "quality",
      description: "Comprehensive quality control inspection of manufactured products",
      estimatedHours: 3,
      priority: "high"
    },
    {
      name: "Machine Maintenance",
      category: "maintenance", 
      description: "Scheduled maintenance and calibration of manufacturing equipment",
      estimatedHours: 4,
      priority: "medium"
    },
    {
      name: "Safety Audit",
      category: "safety",
      description: "Comprehensive safety audit of manufacturing facility and processes",
      estimatedHours: 6,
      priority: "high"
    },
    {
      name: "Inventory Count",
      category: "inventory",
      description: "Physical inventory count and reconciliation of manufacturing materials",
      estimatedHours: 8,
      priority: "medium"
    },
    {
      name: "New Employee Onboarding",
      category: "onboarding",
      description: "Comprehensive onboarding process for new manufacturing employees",
      estimatedHours: 8,
      priority: "high"
    },
    {
      name: "Production Planning",
      category: "planning",
      description: "Weekly production planning and resource allocation",
      estimatedHours: 4,
      priority: "high"
    },
    {
      name: "Equipment Calibration",
      category: "calibration",
      description: "Regular calibration of measurement and testing equipment",
      estimatedHours: 2,
      priority: "medium"
    }
  ]

  async function handleSeedTemplates() {
    if (!currentCompany?.id) {
      toast.error('No company selected')
      return
    }

    try {
      setIsSeeding(true)
      const templates = await seedManufacturingTemplates(currentCompany.id)
      setSeededTemplates(templates)
      toast.success(`Successfully seeded ${templates.length} manufacturing templates!`)
    } catch (error) {
      console.error('Error seeding templates:', error)
      toast.error('Failed to seed templates. Check console for details.')
    } finally {
      setIsSeeding(false)
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case 'production': return 'bg-blue-100 text-blue-800'
      case 'quality': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'safety': return 'bg-red-100 text-red-800'
      case 'inventory': return 'bg-purple-100 text-purple-800'
      case 'onboarding': return 'bg-pink-100 text-pink-800'
      case 'planning': return 'bg-indigo-100 text-indigo-800'
      case 'calibration': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!currentCompany) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            No Company Selected
          </CardTitle>
          <CardDescription>
            Please select a company to seed manufacturing templates.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Manufacturing Template Seeder
          </CardTitle>
          <CardDescription>
            Seed your company with pre-built manufacturing task templates for testing and demonstration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Company:</span>
              <Badge variant="outline">{currentCompany.name}</Badge>
            </div>
            
            <Button 
              onClick={handleSeedTemplates}
              disabled={isSeeding}
              className="w-full"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Seeding Templates...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Seed Manufacturing Templates
                </>
              )}
            </Button>

            {seededTemplates.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Successfully Seeded {seededTemplates.length} Templates
                </div>
                <div className="mt-2 text-sm text-green-700">
                  Templates have been added to your task library and are ready to use.
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Templates to be Seeded</CardTitle>
          <CardDescription>
            These manufacturing templates will be added to your task library:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {manufacturingTemplates.map((template, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <div className="flex gap-1">
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    <Badge className={getPriorityColor(template.priority)}>
                      {template.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>⏱️ {template.estimatedHours}h</span>
                  <span>🔄 Recurring</span>
                  <span>📋 DoD Included</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Features</CardTitle>
          <CardDescription>
            Each template includes comprehensive manufacturing-specific features:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">🏭</div>
              <h4 className="font-medium mb-1">Production Focus</h4>
              <p className="text-sm text-gray-600">Manufacturing-specific workflows and processes</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">🛡️</div>
              <h4 className="font-medium mb-1">Safety Compliance</h4>
              <p className="text-sm text-gray-600">OSHA standards and safety protocols</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium mb-1">Quality Control</h4>
              <p className="text-sm text-gray-600">ISO 9001 compliance and quality checkpoints</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">⚙️</div>
              <h4 className="font-medium mb-1">Equipment Focus</h4>
              <p className="text-sm text-gray-600">Maintenance, calibration, and operation tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
