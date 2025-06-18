import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "flex h-11 w-full min-w-0 rounded-xl border px-4 py-3 text-base outline-none transition-all duration-200",
        // Background and border
        "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700",
        "shadow-sm shadow-slate-100/50 dark:shadow-slate-900/10",
        // Text and placeholder
        "text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500",
        // Focus states
        "focus:border-blue-300 dark:focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20",
        "focus:shadow-md focus:shadow-blue-100/50 dark:focus:shadow-blue-900/20",
        // Hover states
        "hover:border-slate-300 dark:hover:border-slate-600",
        // Invalid states
        "aria-invalid:border-red-300 dark:aria-invalid:border-red-600 aria-invalid:ring-red-100 dark:aria-invalid:ring-red-900/20",
        // Disabled states
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        // File input styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-900 dark:file:text-white",
        // Selection styles
        "selection:bg-blue-500 selection:text-white",
        // Responsive text size
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
