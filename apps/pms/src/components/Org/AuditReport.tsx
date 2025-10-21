'use client'

import { useState, useEffect } from 'react'
import { FileText, Search, Download, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Position, PositionHistoryView, OrgAuditLog } from '@/types/org-schema'
import {
  getPositions,
  getPositionHistory,
  getCompanyAuditLogs,
  getEntityAuditLogs,
} from '@/lib/org-services'
import { useCompany } from '@/contexts/CompanyContext'

export function AuditReport() {
  const { currentCompany } = useCompany()
  const companyId = currentCompany?.id
  const [positions, setPositions] = useState<Position[]>([])
  const [selectedPosition, setSelectedPosition] = useState<string>('')
  const [positionHistory, setPositionHistory] = useState<PositionHistoryView | null>(null)
  const [auditLogs, setAuditLogs] = useState<OrgAuditLog[]>([])
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState<'position_history' | 'audit_log' | 'compliance'>(
    'position_history'
  )

  // Filters
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    specificDate: '',
  })

  useEffect(() => {
    if (currentCompany) {
      loadPositions()
    }
  }, [currentCompany])

  async function loadPositions() {
    if (!companyId) return

    try {
      const data = await getPositions(companyId)
      setPositions(data)
    } catch (error) {
      console.error('Error loading positions:', error)
    }
  }

  async function handleGenerateReport() {
    if (!companyId) return

    setLoading(true)
    try {
      if (reportType === 'position_history' && selectedPosition) {
        const history = await getPositionHistory(
          companyId,
          selectedPosition,
          dateFilter.specificDate || undefined
        )
        setPositionHistory(history)
        setAuditLogs([])
      } else if (reportType === 'audit_log') {
        if (selectedPosition) {
          const logs = await getEntityAuditLogs(companyId, 'position', selectedPosition)
          setAuditLogs(logs)
        } else if (dateFilter.startDate && dateFilter.endDate) {
          const logs = await getCompanyAuditLogs(
            companyId,
            new Date(dateFilter.startDate).toISOString(),
            new Date(dateFilter.endDate).toISOString()
          )
          setAuditLogs(logs)
        }
        setPositionHistory(null)
      } else if (reportType === 'compliance' && selectedPosition) {
        // Get both history and audit logs for compliance report
        const [history, logs] = await Promise.all([
          getPositionHistory(companyId, selectedPosition),
          getEntityAuditLogs(companyId, 'position', selectedPosition),
        ])
        setPositionHistory(history)
        setAuditLogs(logs)
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error generating report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleExportReport() {
    if (!positionHistory && auditLogs.length === 0) return

    let csvContent = ''

    if (positionHistory) {
      csvContent = 'Position History Report\n\n'
      csvContent += `Position: ${positionHistory.positionTitle}\n`
      csvContent += `Department: ${positionHistory.departmentName}\n\n`
      csvContent += 'User Name,User Email,Start Date,End Date,Assignment Type,Reason,Status\n'
      
      positionHistory.assignments.forEach((assignment) => {
        csvContent += `"${assignment.userName}","${assignment.userEmail}","${new Date(
          assignment.startAt
        ).toLocaleDateString()}","${
          assignment.endAt ? new Date(assignment.endAt).toLocaleDateString() : 'Current'
        }","${assignment.assignmentType}","${assignment.reason}","${
          assignment.isActive ? 'Active' : 'Ended'
        }"\n`
      })
    }

    if (auditLogs.length > 0) {
      if (csvContent) csvContent += '\n\n'
      csvContent += 'Audit Log Report\n\n'
      csvContent += 'Timestamp,User,Action,Entity Type,Entity ID,Reason\n'
      
      auditLogs.forEach((log) => {
        csvContent += `"${new Date(log.timestamp).toLocaleString()}","${log.userName}","${
          log.action
        }","${log.entityType}","${log.entityId}","${log.reason}"\n`
      })
    }

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `org-audit-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString()
  }

  function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString()
  }

  function getActionColor(action: string): string {
    switch (action) {
      case 'create':
        return 'default'
      case 'update':
        return 'secondary'
      case 'delete':
        return 'destructive'
      case 'assign':
      case 'approve':
        return 'default'
      case 'unassign':
      case 'reject':
      case 'revoke':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit & Compliance Reports</h2>
          <p className="text-muted-foreground">
            Generate reports for compliance and track organizational changes
          </p>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Configure your audit report parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                value={reportType}
                onValueChange={(value: any) => setReportType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="position_history">Position History</SelectItem>
                  <SelectItem value="audit_log">Audit Log</SelectItem>
                  <SelectItem value="compliance">Compliance Report (Full)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position (Optional)</Label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Positions</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.title} ({position.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {reportType === 'position_history' && (
            <div className="space-y-2">
              <Label htmlFor="specificDate">Specific Date (Optional)</Label>
              <Input
                id="specificDate"
                type="date"
                value={dateFilter.specificDate}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, specificDate: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for full history, or select a date to see who held the position at that time
              </p>
            </div>
          )}

          {reportType === 'audit_log' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button onClick={handleGenerateReport} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
            {(positionHistory || auditLogs.length > 0) && (
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Position History Report */}
      {positionHistory && (
        <Card>
          <CardHeader>
            <CardTitle>Position History: {positionHistory.positionTitle}</CardTitle>
            <CardDescription>
              Department: {positionHistory.departmentName}
              {positionHistory.occupantAt && (
                <span className="ml-4">
                  Occupant at {formatDate(positionHistory.occupantAt.timestamp)}:{' '}
                  <strong>{positionHistory.occupantAt.userName}</strong>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positionHistory.assignments.map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{assignment.userName}</TableCell>
                    <TableCell>{assignment.userEmail}</TableCell>
                    <TableCell>{formatDate(assignment.startAt)}</TableCell>
                    <TableCell>
                      {assignment.endAt ? formatDate(assignment.endAt) : (
                        <Badge variant="default">Current</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{assignment.assignmentType}</Badge>
                    </TableCell>
                    <TableCell>{assignment.reason}</TableCell>
                    <TableCell>
                      <Badge variant={assignment.isActive ? 'default' : 'secondary'}>
                        {assignment.isActive ? 'Active' : 'Ended'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Audit Log Report */}
      {auditLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Audit Log ({auditLogs.length} entries)</CardTitle>
            <CardDescription>
              Detailed audit trail of all organizational changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">{formatDateTime(log.timestamp)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{log.userName}</p>
                        <p className="text-xs text-muted-foreground">{log.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionColor(log.action) as any}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.entityType}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.entityId.slice(0, 8)}...</TableCell>
                    <TableCell className="max-w-[200px] truncate">{log.reason}</TableCell>
                    <TableCell>
                      <details className="text-xs">
                        <summary className="cursor-pointer text-primary hover:underline">
                          {log.changes.length} change(s)
                        </summary>
                        <div className="mt-2 space-y-1">
                          {log.changes.map((change, idx) => (
                            <div key={idx} className="border-l-2 pl-2">
                              <p className="font-medium">{change.field}</p>
                              <p className="text-muted-foreground">
                                {String(change.oldValue || 'null')} → {String(change.newValue || 'null')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </details>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!positionHistory && auditLogs.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No report generated yet</p>
            <p className="text-muted-foreground mb-4">
              Configure your report parameters above and click "Generate Report"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

