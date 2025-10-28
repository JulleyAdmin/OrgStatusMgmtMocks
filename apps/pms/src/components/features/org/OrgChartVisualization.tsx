'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  User as UserIcon,
  Users,
  Building2
} from 'lucide-react'
import { Position, Department, PositionAssignment } from '@/types/org-schema'
import { User } from '@/types/index'
import { cn } from '@/lib/utils'

interface OrgNode {
  position: Position
  department: Department | undefined
  assignment: PositionAssignment | null
  children: OrgNode[]
  isExpanded: boolean
}

interface OrgChartVisualizationProps {
  positions: Position[]
  departments: Department[]
  assignments: Map<string, PositionAssignment | null>
  users: Map<string, User>
  onNodeClick?: (position: Position) => void
}

export function OrgChartVisualization({
  positions,
  departments,
  assignments,
  users,
  onNodeClick
}: OrgChartVisualizationProps) {
  const [rootNodes, setRootNodes] = useState<OrgNode[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [expandAll, setExpandAll] = useState(true)
  const [filterByLevel, setFilterByLevel] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Build the org tree
  useEffect(() => {
    const nodeMap = new Map<string, OrgNode>()
    
    // Create nodes for all positions
    positions.forEach(pos => {
      const dept = departments.find(d => d.id === pos.departmentId)
      const assignment = assignments.get(pos.id) || null
      
      nodeMap.set(pos.id, {
        position: pos,
        department: dept,
        assignment,
        children: [],
        isExpanded: expandAll
      })
    })

    // Build parent-child relationships
    const roots: OrgNode[] = []
    positions.forEach(pos => {
      const node = nodeMap.get(pos.id)!
      
      if (pos.reportsToPositionId) {
        const parent = nodeMap.get(pos.reportsToPositionId)
        if (parent) {
          parent.children.push(node)
        } else {
          // If parent not found, treat as root
          roots.push(node)
        }
      } else {
        roots.push(node)
      }
    })

    // Sort children by level
    const sortChildren = (node: OrgNode) => {
      node.children.sort((a, b) => a.position.level - b.position.level)
      node.children.forEach(sortChildren)
    }
    roots.forEach(sortChildren)

    setRootNodes(roots)
  }, [positions, departments, assignments, users, expandAll])

  // Check if node matches search criteria
  const nodeMatchesSearch = (node: OrgNode): boolean => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    const matchesPosition = node.position.title.toLowerCase().includes(searchLower) ||
                           node.position.code.toLowerCase().includes(searchLower)
    const matchesDept = node.department?.name.toLowerCase().includes(searchLower) || false
    
    // Check if assignment has user and if user name matches
    const assignedUser = node.assignment ? users.get(node.assignment.userId) : null
    const matchesUser = assignedUser ? 
      assignedUser.name.toLowerCase().includes(searchLower) ||
      assignedUser.email.toLowerCase().includes(searchLower) : false

    return matchesPosition || matchesDept || matchesUser
  }

  // Check if any descendant (including self) matches search
  const nodeOrDescendantMatchesSearch = (node: OrgNode): boolean => {
    return nodeMatchesSearch(node) || node.children.some(child => nodeOrDescendantMatchesSearch(child))
  }

  // Check if node has descendants at the filtered level
  const hasDescendantAtLevel = (node: OrgNode, targetLevel: number): boolean => {
    if (node.position.level === targetLevel) return true
    return node.children.some(child => hasDescendantAtLevel(child, targetLevel))
  }

  // Check if node should be shown
  const shouldShowNode = (node: OrgNode): boolean => {
    // Level filter: show if this node is at the level OR has descendants at that level
    if (filterByLevel !== null) {
      return hasDescendantAtLevel(node, filterByLevel)
    }

    // Search: show if this node matches OR if it's an ancestor of a matching node
    if (searchTerm) {
      return nodeOrDescendantMatchesSearch(node)
    }

    // No filter: show all
    return true
  }

  const toggleNode = (node: OrgNode) => {
    node.isExpanded = !node.isExpanded
    setRootNodes([...rootNodes])
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50))
  }

  const handleResetZoom = () => {
    setZoomLevel(100)
  }

  const getLevelColor = (level: number): string => {
    const colors = [
      'from-purple-500 to-purple-600',  // Level 1 - CEO
      'from-blue-500 to-blue-600',       // Level 2 - C-Suite
      'from-indigo-500 to-indigo-600',   // Level 3 - VPs
      'from-cyan-500 to-cyan-600',       // Level 4 - GMs
      'from-teal-500 to-teal-600',       // Level 5 - Managers
      'from-green-500 to-green-600',     // Level 6 - Senior
      'from-lime-500 to-lime-600',       // Level 7 - Executives
      'from-amber-500 to-amber-600',     // Level 8 - Trainees
      'from-orange-500 to-orange-600',   // Level 9 - Interns
    ]
    return colors[level - 1] || 'from-gray-500 to-gray-600'
  }

  const OrgNodeCard = ({ node, depth = 0 }: { node: OrgNode; depth?: number }) => {
    if (!shouldShowNode(node)) return null

    const hasChildren = node.children.length > 0
    const visibleChildren = node.children.filter(shouldShowNode)
    
    // Auto-expand when searching to show matching nodes
    if (searchTerm && hasChildren && nodeOrDescendantMatchesSearch(node) && !nodeMatchesSearch(node)) {
      node.isExpanded = true
    }

    return (
      <div className="flex flex-col items-center">
        {/* Node Card */}
        <Card
          className={cn(
            'relative min-w-[240px] max-w-[280px] p-3 cursor-pointer transition-all duration-200',
            'hover:shadow-lg hover:scale-105 border-2',
            node.assignment ? 'border-green-300' : 'border-gray-300'
          )}
          onClick={() => onNodeClick?.(node.position)}
        >
          {/* Level Badge */}
          <div className="absolute -top-2 -right-2">
            <Badge variant="secondary" className={cn('bg-gradient-to-r text-white font-semibold', getLevelColor(node.position.level))}>
              L{node.position.level}
            </Badge>
          </div>

          {/* Department Badge */}
          {node.department && (
            <div className="flex items-center gap-1 mb-2">
              <Building2 className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600 font-medium">{node.department.code}</span>
            </div>
          )}

          {/* User Assignment */}
          {(() => {
            if (!node.assignment) {
              return (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-500">Vacant Position</p>
                  </div>
                  {/* Position Title Highlighted */}
                  <p className="text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {node.position.title}
                  </p>
                </div>
              )
            }

            const assignedUser = users.get(node.assignment.userId)
            
            if (!assignedUser) {
              return (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <UserIcon className="w-4 h-4 text-orange-500" />
                    <p className="text-xs text-orange-600 font-medium">User Not Found</p>
                  </div>
                  {/* Position Title Highlighted */}
                  <p className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    {node.position.title}
                  </p>
                </div>
              )
            }

            return (
              <div className="space-y-2">
                {/* User Name at Top */}
                <div className="flex items-center gap-2">
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {assignedUser.avatar ? (
                      <img 
                        src={assignedUser.avatar} 
                        alt={assignedUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      assignedUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  {/* User Name */}
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {assignedUser.name}
                  </h3>
                </div>
                
                {/* Position Title Below - Highlighted */}
                <p className="text-xs font-semibold text-blue-700 truncate text-center bg-blue-50 px-2 py-1 rounded">
                  {node.position.title}
                </p>

                {/* Assignment Type Badge */}
                <div className="flex justify-center pt-1">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-xs',
                      node.assignment.assignmentType === 'permanent' ? 'bg-green-50 text-green-700 border-green-200' :
                      node.assignment.assignmentType === 'temporary' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    )}
                  >
                    {node.assignment.assignmentType}
                  </Badge>
                </div>
              </div>
            )
          })()}

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 border-2 border-gray-300 hover:border-blue-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(node)
              }}
            >
              {node.isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
        </Card>

        {/* Children */}
        {hasChildren && node.isExpanded && (
          <div className="relative mt-8">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-300 -top-6" />
            
            {/* Horizontal line */}
            {visibleChildren.length > 1 && (
              <div
                className="absolute h-0.5 bg-gray-300 top-0"
                style={{
                  left: `${(240 + 32) / 2}px`,
                  right: `${(240 + 32) / 2}px`,
                }}
              />
            )}

            {/* Children nodes */}
            <div className="flex gap-8 pt-6">
              {visibleChildren.map((child, idx) => (
                <div key={child.position.id} className="relative">
                  {/* Vertical connector to child */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-300 -top-6" />
                  <OrgNodeCard node={child} depth={depth + 1} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const uniqueLevels = Array.from(new Set(positions.map(p => p.level))).sort((a, b) => a - b)

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by position, department, or person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterByLevel || ''}
              onChange={(e) => setFilterByLevel(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Levels</option>
              {uniqueLevels.map(level => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>
          </div>

          {/* Expand/Collapse All */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandAll(!expandAll)}
          >
            <Users className="w-4 h-4 mr-2" />
            {expandAll ? 'Collapse All' : 'Expand All'}
          </Button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="px-2 text-sm font-medium">{zoomLevel}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              <strong>{departments.length}</strong> Departments
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              <strong>{positions.length}</strong> Positions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">
              <strong>{Array.from(assignments.values()).filter(a => a !== null).length}</strong> Assigned
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              <strong>{positions.length - Array.from(assignments.values()).filter(a => a !== null).length}</strong> Vacant
            </span>
          </div>
        </div>
      </Card>

      {/* Org Chart */}
      <Card className="p-8 overflow-auto" ref={containerRef}>
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          <div className="flex gap-12 justify-center">
            {rootNodes.filter(shouldShowNode).map(node => (
              <OrgNodeCard key={node.position.id} node={node} />
            ))}
          </div>
        </div>

        {rootNodes.filter(shouldShowNode).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No positions found matching your criteria</p>
          </div>
        )}
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <h4 className="text-sm font-semibold mb-3 text-gray-700">Organization Levels</h4>
        <div className="flex flex-wrap gap-2">
          {uniqueLevels.map(level => (
            <Badge
              key={level}
              className={cn('bg-gradient-to-r text-white', getLevelColor(level))}
            >
              Level {level}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  )
}

