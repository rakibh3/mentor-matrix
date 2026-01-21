import * as React from "react"

import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { IconAvatar, type IconAvatarProps } from "@/components/ui/icon-avatar"
import { Label } from "@/components/ui/label"

export interface SettingToggleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  onCheckedChange: () => void
  disabled?: boolean
  layout?: "horizontal" | "vertical"
  iconVariant?: IconAvatarProps["variant"]
}

function SettingToggleCard({ 
  className, 
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  layout = "horizontal",
  iconVariant,
  ...props 
}: SettingToggleCardProps) {
  // Determine icon variant: use provided iconVariant, or fallback to checked-based logic for horizontal
  const computedIconVariant = iconVariant ?? (checked ? 'primary' : 'default')

  if (layout === "vertical") {
    return (
      <div 
        className={cn(
          "bg-background-dark/40 border border-card-border rounded-2xl p-6 flex flex-col gap-3 group hover:bg-white/[0.02] transition-colors cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )} 
        onClick={() => !disabled && onCheckedChange()}
        {...props}
      >
        <div className="flex items-center justify-between">
          <IconAvatar variant={computedIconVariant} size="sm" bordered={false}>
            {icon}
          </IconAvatar>
          <Switch 
            checked={checked} 
            onCheckedChange={onCheckedChange}
            disabled={disabled}
          />
        </div>
        <h4 className="text-sm font-black text-white uppercase tracking-tight">{title}</h4>
        <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "bg-background-dark/40 border border-card-border rounded-2xl p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )} 
      onClick={() => !disabled && onCheckedChange()}
      {...props}
    >
      <div className="flex items-center gap-4">
        <IconAvatar variant={computedIconVariant} size="sm" bordered>
          {icon}
        </IconAvatar>
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-white cursor-pointer">{title}</Label>
          <p className="text-xs text-text-secondary font-medium">{description}</p>
        </div>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        size="lg"
        disabled={disabled}
      />
    </div>
  )
}

export { SettingToggleCard }
