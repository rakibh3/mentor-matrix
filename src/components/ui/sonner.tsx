import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Icon } from "@/constants"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-right"
      icons={{
        success: <Icon name="check_circle" className="text-lg text-primary" />,
        info: <Icon name="info" className="text-lg text-chart-blue" />,
        warning: <Icon name="warning" className="text-lg text-amber-500" />,
        error: <Icon name="error" className="text-lg text-red-500" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "w-80 sm:w-96 overflow-hidden rounded-[1.5rem] bg-surface-dark/95 backdrop-blur-xl border shadow-2xl p-5 flex items-start gap-4 animate-fade-in-right",
          title: "text-sm font-black text-white uppercase tracking-tight",
          description: "text-sm text-text-secondary font-medium mt-1 leading-relaxed",
          actionButton: "bg-primary text-background-dark font-black uppercase text-xs px-4 py-2 rounded-xl",
          cancelButton: "bg-white/10 text-white font-black uppercase text-xs px-4 py-2 rounded-xl",
          closeButton: "text-gray-500 hover:text-white bg-transparent border-none",
          success: "border-primary/30 shadow-primary/10",
          error: "border-red-500/30 shadow-red-500/10",
          warning: "border-amber-500/30 shadow-amber-500/10",
          info: "border-chart-blue/30 shadow-chart-blue/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
