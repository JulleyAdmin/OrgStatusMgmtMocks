'use client'

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  description?: string
}

export function Drawer({ open, onOpenChange, children, title, description }: DrawerProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white border-l border-gray-200 shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          {(title || description) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                )}
                {description && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-auto bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerContent({ className, children, ...props }: DrawerContentProps) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
}

interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerFooter({ className, children, ...props }: DrawerFooterProps) {
  return (
    <div className={cn("flex items-center justify-end gap-2 p-6 border-t border-gray-200 bg-white", className)} {...props}>
      {children}
    </div>
  )
}
