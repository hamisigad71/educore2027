"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            {/* Visual Icon per Variant */}
            <div className="shrink-0 mt-0.5">
              {variant === "success" && (
                <div className="h-6 w-6 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
              {variant === "destructive" && (
                <div className="h-6 w-6 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4" />
                </div>
              )}
              {variant === "warning" && (
                <div className="h-6 w-6 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              )}
              {variant === "info" && (
                <div className="h-6 w-6 rounded-xl bg-sky-500/15 text-sky-600 flex items-center justify-center">
                  <Info className="h-4 w-4" />
                </div>
              )}
              {variant === "default" && (
                <div className="h-6 w-6 rounded-xl bg-slate-500/15 text-slate-700 flex items-center justify-center">
                  <Info className="h-4 w-4" />
                </div>
              )}
            </div>

            <div className="grid gap-0.5 flex-1 pr-4">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
