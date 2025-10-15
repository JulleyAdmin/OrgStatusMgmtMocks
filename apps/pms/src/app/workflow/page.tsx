'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { COMPANY_CONFIG } from '@/config/company'
import { Workflow, Plus, Play, Save } from 'lucide-react'

export default function WorkflowDesignerPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workflow Designer</h1>
            <p className="text-gray-600">Design and automate {COMPANY_CONFIG.name} manufacturing workflows</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Run Workflow
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Workflow Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow h-96">
              <div className="p-6">
                <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Workflow Canvas</h3>
                    <p className="text-gray-600 mb-4">Drag and drop workflow nodes to design your manufacturing process</p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Workflow
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Library */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Nodes</h3>
              <div className="space-y-2">
                <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-sm font-medium">Start</div>
                  <div className="text-xs text-gray-600">Begin workflow</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-sm font-medium">Process</div>
                  <div className="text-xs text-gray-600">Manufacturing step</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-sm font-medium">Quality Check</div>
                  <div className="text-xs text-gray-600">Quality control</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-sm font-medium">Decision</div>
                  <div className="text-xs text-gray-600">Conditional logic</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-sm font-medium">End</div>
                  <div className="text-xs text-gray-600">Complete workflow</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates</h3>
              <div className="space-y-2">
                <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-sm font-medium">Robot Assembly</div>
                  <div className="text-xs text-gray-600">Industrial robot workflow</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-sm font-medium">Quality Control</div>
                  <div className="text-xs text-gray-600">QC process</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-sm font-medium">IoT Integration</div>
                  <div className="text-xs text-gray-600">Sensor integration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
