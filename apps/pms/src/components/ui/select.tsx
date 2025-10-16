import * as React from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  searchable?: boolean
  emptyMessage?: string
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ 
    options = [], 
    value, 
    onValueChange, 
    placeholder = "Select option...", 
    disabled = false,
    className,
    searchable = true,
    emptyMessage = "No options found.",
    ...props 
  }, ref) => {
    const [open, setOpen] = React.useState(false)

    const selectedOption = options.find((option) => option.value === value)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              !selectedOption && "text-gray-500",
              className
            )}
            disabled={disabled}
            {...props}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[9999]" align="start">
          <Command>
            {searchable && (
              <CommandInput placeholder="Search..." />
            )}
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange?.(currentValue)
                      setOpen(false)
                    }}
                    disabled={option.disabled}
                    className={cn(
                      "cursor-pointer",
                      option.disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
Select.displayName = "Select"

export { Select }

// Multi-select variant
export interface MultiSelectProps {
  options: SelectOption[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  searchable?: boolean
  emptyMessage?: string
  maxSelections?: number
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ 
    options = [], 
    value = [], 
    onValueChange, 
    placeholder = "Select options...", 
    disabled = false,
    className,
    searchable = true,
    emptyMessage = "No options found.",
    maxSelections,
    ...props 
  }, ref) => {
    const [open, setOpen] = React.useState(false)

    const selectedOptions = options.filter((option) => value.includes(option.value))
    const displayText = selectedOptions.length > 0 
      ? `${selectedOptions.length} selected` 
      : placeholder

    const handleSelect = (optionValue: string) => {
      if (value.includes(optionValue)) {
        onValueChange?.(value.filter(v => v !== optionValue))
      } else {
        if (maxSelections && value.length >= maxSelections) {
          return
        }
        onValueChange?.([...value, optionValue])
      }
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              selectedOptions.length === 0 && "text-gray-500",
              className
            )}
            disabled={disabled}
            {...props}
          >
            {displayText}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[9999]" align="start">
          <Command>
            {searchable && (
              <CommandInput placeholder="Search..." />
            )}
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    disabled={option.disabled || Boolean(maxSelections && value.length >= maxSelections && !value.includes(option.value))}
                    className={cn(
                      "cursor-pointer",
                      (option.disabled || (maxSelections && value.length >= maxSelections && !value.includes(option.value))) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
MultiSelect.displayName = "MultiSelect"

export { MultiSelect }