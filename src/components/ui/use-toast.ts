import { toast } from "sonner"

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
  type: ToastType
  title: string
  message: string
  duration?: number
}

export const useToast = () => {
  const addToast = ({ type, title, message, duration = 5000 }: ToastOptions) => {
    const toastFn = {
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
    }[type]

    toastFn(title, {
      description: message,
      duration,
    })
  }

  return { addToast }
}

// Re-export toast for direct usage if needed
export { toast }
