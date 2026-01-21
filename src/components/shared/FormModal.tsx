import * as React from "react"

import { cn } from "@/lib/utils"
import { Icon } from "@/constants"
import { Dialog, DialogContent, DialogTitle, DialogDescription, type DialogContentProps } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { Button } from "@/components/ui/button"
import { IconAvatar, type IconAvatarProps } from "@/components/ui/icon-avatar"

export interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  icon: string
  iconVariant?: IconAvatarProps["variant"]
  title: string
  subtitle?: string
  size?: DialogContentProps["size"]
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  submitText?: string
  cancelText?: string
  isSubmitting?: boolean
  formClassName?: string
}

function FormModalHeader({ 
  icon, 
  iconVariant = "default",
  title, 
  subtitle 
}: Pick<FormModalProps, "icon" | "iconVariant" | "title" | "subtitle">) {
  return (
    <div className="flex items-center gap-6 mb-10">
      <IconAvatar size="xl" variant={iconVariant}>
        <Icon name={icon} className="text-4xl" />
      </IconAvatar>
      <div>
        <h3 className="text-3xl font-black text-white uppercase tracking-tight">{title}</h3>
        {subtitle && <p className="text-text-secondary text-base">{subtitle}</p>}
      </div>
    </div>
  )
}

function FormModalFooter({ 
  submitText = "Save", 
  cancelText = "Cancel", 
  onClose,
  isSubmitting = false
}: Pick<FormModalProps, "submitText" | "cancelText" | "onClose" | "isSubmitting">) {
  return (
    <div className="flex gap-4 mt-6">
      <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitText}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="lg" 
        onClick={onClose} 
        className="flex-1"
        disabled={isSubmitting}
      >
        {cancelText}
      </Button>
    </div>
  )
}

function FormModal({
  isOpen,
  onClose,
  icon,
  iconVariant,
  title,
  subtitle,
  size = "2xl",
  children,
  onSubmit,
  submitText,
  cancelText,
  isSubmitting,
  formClassName,
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size={size}>
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle || `${title} form`}</DialogDescription>
        </VisuallyHidden>
        <div className="p-10 flex flex-col">
          <FormModalHeader 
            icon={icon} 
            iconVariant={iconVariant}
            title={title} 
            subtitle={subtitle} 
          />
          <form 
            onSubmit={onSubmit} 
            className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", formClassName)}
          >
            {children}
            <div className="md:col-span-2">
              <FormModalFooter 
                submitText={submitText} 
                cancelText={cancelText} 
                onClose={onClose}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { FormModal, FormModalHeader, FormModalFooter }
