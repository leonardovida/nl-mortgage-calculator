import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-sm shadow-blue-600/25 hover:from-blue-500 hover:to-blue-600 hover:shadow-md hover:shadow-blue-600/30 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-800 border border-blue-700 hover:border-blue-600 rounded-xl",
        destructive:
          "bg-gradient-to-b from-red-600 to-red-700 text-white shadow-sm shadow-red-600/25 hover:from-red-500 hover:to-red-600 hover:shadow-md hover:shadow-red-600/30 focus-visible:ring-red-200 dark:focus-visible:ring-red-800 border border-red-700 hover:border-red-600 rounded-xl",
        outline:
          "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm shadow-slate-100/50 dark:shadow-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-800 rounded-xl",
        secondary:
          "bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-900 dark:text-white shadow-sm shadow-slate-200/50 dark:shadow-slate-900/10 hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-800 focus-visible:ring-slate-200 dark:focus-visible:ring-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl",
        ghost:
          "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus-visible:ring-slate-200 dark:focus-visible:ring-slate-700 rounded-xl",
        link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline focus-visible:ring-blue-200 dark:focus-visible:ring-blue-800 rounded-md",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 gap-1.5 px-3 has-[>svg]:px-2.5 text-sm",
        lg: "h-12 px-6 has-[>svg]:px-4 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
