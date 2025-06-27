"use client"

import React from "react"

// Simple toast container for now
const Toaster = () => {
  return (
    <div 
      id="toast-container" 
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
      style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
    />
  )
}

export { Toaster } 