import * as React from "react"
import { format, parse, isValid, startOfDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Icon } from "@/constants"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  disablePast?: boolean
  className?: string
}

function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disablePast = true,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const today = startOfDay(new Date())

  // Parse the value string to Date object
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    const parsed = parse(value, "yyyy-MM-dd", new Date())
    return isValid(parsed) ? parsed : undefined
  }, [value])

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"))
      setOpen(false)
    }
  }

  const handleTodayClick = () => {
    onChange(format(today, "yyyy-MM-dd"))
    setOpen(false)
  }

  const disabledDays = disablePast ? { before: today } : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "w-full flex items-center justify-between rounded-xl border h-14 px-5 text-sm font-bold transition-all outline-none bg-background-dark/50 hover:bg-background-dark/50",
            open ? "border-primary ring-1 ring-primary/30" : "border-card-border hover:border-primary/50",
            className
          )}
        >
          <div className="flex items-center gap-3 text-white">
            <Icon name="calendar_month" className={cn("text-xl", open ? "text-primary" : "text-gray-500")} />
            <span className={value ? "text-white" : "text-gray-600"}>
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
            </span>
          </div>
          <Icon 
            name="expand_more" 
            className={cn("text-xl text-gray-500 transition-transform duration-300", open && "rotate-180 text-primary")} 
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-surface-dark border-card-border rounded-2xl shadow-2xl overflow-hidden" 
        align="start"
        sideOffset={8}
      >
        <div className="p-5">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={disabledDays}
            defaultMonth={selectedDate || today}
          />
          <div className="mt-4 pt-4 border-t border-card-border/50 flex justify-between items-center">
            <Button
              type="button"
              variant="link"
              onClick={handleTodayClick}
              className="text-xs font-black uppercase tracking-widest text-primary hover:underline p-0 h-auto"
            >
              Today
            </Button>
            {disablePast && (
              <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                Future dates only
              </span>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
