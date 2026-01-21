import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Icon } from "@/constants"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-base font-black uppercase tracking-widest text-white",
        nav: "flex items-center gap-1",
        button_previous: cn(
          "size-9 flex items-center justify-center rounded-xl bg-transparent hover:bg-white/10 text-text-secondary hover:text-primary absolute left-0 transition-colors cursor-pointer"
        ),
        button_next: cn(
          "size-9 flex items-center justify-center rounded-xl bg-transparent hover:bg-white/10 text-text-secondary hover:text-primary absolute right-0 transition-colors cursor-pointer"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex gap-1 mb-2",
        weekday:
          "text-text-secondary w-11 font-black text-[0.65rem] uppercase tracking-widest text-center",
        week: "flex w-full gap-1 mt-1",
        day: "h-11 w-11 text-center text-sm p-0 relative flex items-center justify-center",
        day_button: cn(
          "size-10 p-0 font-bold rounded-xl cursor-pointer transition-all",
          "text-white hover:bg-primary/20 hover:text-primary",
          "focus:outline-none focus:ring-2 focus:ring-primary/50"
        ),
        selected:
          "bg-primary text-background-dark hover:bg-primary hover:text-background-dark focus:bg-primary focus:text-background-dark rounded-xl shadow-lg shadow-primary/30",
        today: "ring-1 ring-primary/50 text-primary rounded-xl",
        outside:
          "text-text-secondary/40 hover:text-text-secondary/60",
        disabled: "text-text-secondary/20 cursor-not-allowed opacity-30 hover:bg-transparent hover:text-text-secondary/20",
        range_middle:
          "aria-selected:bg-primary/20 aria-selected:text-white",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (
          <Icon 
            name={orientation === "left" ? "chevron_left" : "chevron_right"} 
            className="text-xl" 
          />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
