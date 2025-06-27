"use client"

import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const useToast = () => {
  const toast = React.useCallback(({ title, description, variant = "default" }: ToastProps) => {
    // Simple implementation using browser alert for now
    const message = `${title || (variant === "destructive" ? "خطا" : "موفقیت")}${description ? `\n${description}` : ""}`;
    
    if (variant === "destructive") {
      console.error(message);
    } else {
      console.log(message);
    }
    
    // You can replace this with a proper toast implementation later
    // For now, we'll just log to console to avoid dependencies
  }, [])

  return {
    toast,
  }
} 