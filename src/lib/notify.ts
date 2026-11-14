import { toast as shadcnToast } from "@/components/ui/use-toast";

/**
 * Universal Notification Dispatcher (shadcn/ui + Radix Toast)
 * High-touch feedback for all user actions across EduCore
 */
export const notify = {
  success: (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
      variant: "success" as any,
    });
  },

  error: (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
      variant: "destructive",
    });
  },

  warning: (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
      variant: "warning" as any,
    });
  },

  info: (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
      variant: "info" as any,
    });
  },
};
