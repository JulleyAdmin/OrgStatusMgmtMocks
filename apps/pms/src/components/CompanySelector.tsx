// Simple Company Selector Component for Debugging

'use client'

import React from 'react'
import { useCompany } from '@/contexts/CompanyContext'
import { Button } from '@/components/ui/button'

export function CompanySelector() {
  const { 
    currentCompany, 
    userCompanies, 
    switchCompany, 
    isLoading, 
    error 
  } = useCompany()

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg bg-blue-50">
        <p className="text-blue-800">Loading companies...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50">
        <p className="text-red-800">Error: {error}</p>
      </div>
    )
  }

  if (userCompanies.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50">
        <p className="text-yellow-800">No companies found. Please create a company first.</p>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <h3 className="font-semibold text-green-800 mb-2">Company Selector</h3>
      <p className="text-green-700 mb-2">
        Current: <strong>{currentCompany?.name || 'None'}</strong>
      </p>
      <div className="space-y-2">
        {userCompanies.map((company) => (
          <Button
            key={company.id}
            variant={currentCompany?.id === company.id ? "default" : "outline"}
            onClick={() => switchCompany(company.id)}
            className="w-full justify-start"
          >
            {company.name} ({company.domain})
          </Button>
        ))}
      </div>
    </div>
  )
}
