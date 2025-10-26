'use client'

import React, { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface VirtualizedTableColumn<T> {
  key: keyof T | string
  header: string
  width: number
  render?: (item: T, index: number) => React.ReactNode
  className?: string
}

interface VirtualizedTableProps<T> {
  data: T[]
  columns: VirtualizedTableColumn<T>[]
  height?: number
  itemHeight?: number
  className?: string
  onRowClick?: (item: T, index: number) => void
  loading?: boolean
  emptyMessage?: string
  pageSize?: number
}

export function VirtualizedTable<T extends Record<string, any>>({
  data,
  columns,
  height = 400,
  itemHeight = 50,
  className,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  pageSize = 20
}: VirtualizedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)
  
  const totalWidth = useMemo(() => 
    columns.reduce((sum, col) => sum + col.width, 0), 
    [columns]
  )

  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = currentPage * pageSize
  const endIndex = Math.min(startIndex + pageSize, data.length)
  const currentData = data.slice(startIndex, endIndex)

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  if (loading) {
    return (
      <div className={cn("border rounded-lg", className)}>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("border rounded-lg", className)}>
        <div className="flex items-center justify-center h-32 text-gray-500">
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="flex bg-gray-50 border-b">
        {columns.map((column) => (
          <div
            key={String(column.key)}
            className="px-4 py-3 text-sm font-medium text-gray-700"
            style={{ width: column.width }}
          >
            {column.header}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      <div style={{ height: height - 60, overflowY: 'auto' }}>
        {currentData.map((item, index) => (
          <div
            key={startIndex + index}
            className={cn(
              "flex items-center border-b border-gray-200 hover:bg-gray-50",
              onRowClick && "cursor-pointer"
            )}
            style={{ height: itemHeight }}
            onClick={() => onRowClick?.(item, startIndex + index)}
          >
            {columns.map((column, colIndex) => (
              <div
                key={String(column.key)}
                className={cn(
                  "px-4 py-2 text-sm",
                  column.className
                )}
                style={{ width: column.width }}
              >
                {column.render 
                  ? column.render(item, startIndex + index)
                  : String(item[column.key] || '')
                }
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {endIndex} of {data.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for managing virtualized data with pagination
export function useVirtualizedData<T>(
  data: T[],
  pageSize: number = 50
) {
  const [currentPage, setCurrentPage] = React.useState(0)
  
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }, [data, currentPage, pageSize])

  const totalPages = Math.ceil(data.length / pageSize)
  const hasNextPage = currentPage < totalPages - 1
  const hasPreviousPage = currentPage > 0

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const previousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  return {
    paginatedData,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    totalItems: data.length
  }
}