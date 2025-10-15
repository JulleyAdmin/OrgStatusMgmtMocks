'use client'

import { COMPANY_CONFIG } from '../config/company'

export function CompanyConfigDisplay() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-700">Company Information</h4>
          <p className="text-sm text-gray-600">Name: {COMPANY_CONFIG.name}</p>
          <p className="text-sm text-gray-600">Industry: {COMPANY_CONFIG.industry}</p>
          <p className="text-sm text-gray-600">Description: {COMPANY_CONFIG.description}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Equipment Types</h4>
          <div className="flex flex-wrap gap-1">
            {COMPANY_CONFIG.equipmentTypes?.map((type, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {type}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Manufacturing Phases</h4>
          <div className="flex flex-wrap gap-1">
            {COMPANY_CONFIG.manufacturingPhases?.map((phase, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                {phase}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Quality Standards</h4>
          <div className="flex flex-wrap gap-1">
            {COMPANY_CONFIG.qualityStandards?.map((standard, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                {standard}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
