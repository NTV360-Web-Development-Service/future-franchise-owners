/**
 * @fileoverview Button Component
 * 
 * A flexible, accessible button component built with Radix UI and class-variance-authority.
 * Provides multiple variants, sizes, and supports composition patterns through the asChild prop.
 * 
 * @module Components/UI/Button
 * @version 1.0.0
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button variant styles using class-variance-authority
 * 
 * Defines the visual appearance and behavior variants for the button component.
 * Includes base styles, variant-specific styles, and size configurations.
 * 
 * @constant buttonVariants
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button Component Props
 * 
 * @interface ButtonProps
 * @extends React.ComponentProps<"button">
 * @extends VariantProps<typeof buttonVariants>
 */
interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Whether to render as a child component (using Radix Slot) */
  asChild?: boolean
}

/**
 * Button Component
 * 
 * A versatile button component that supports multiple visual variants, sizes,
 * and composition patterns. Built on top of Radix UI's Slot component for
 * maximum flexibility and accessibility.
 * 
 * Features:
 * - Multiple visual variants (default, destructive, outline, secondary, ghost, link)
 * - Three size options (sm, default, lg, icon)
 * - Composition support via asChild prop
 * - Full accessibility support
 * - Focus management and keyboard navigation
 * - Dark mode support
 * - Icon integration with automatic sizing
 * - Disabled state handling
 * 
 * @component
 * @param {ButtonProps} props - The component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"} [props.variant="default"] - Visual variant
 * @param {"default" | "sm" | "lg" | "icon"} [props.size="default"] - Size variant
 * @param {boolean} [props.asChild=false] - Render as child component using Radix Slot
 * @returns {React.ReactElement} The rendered button component
 * 
 * @example
 * ```tsx
 * // Basic button
 * <Button>Click me</Button>
 * 
 * // Button with variant and size
 * <Button variant="destructive" size="lg">Delete</Button>
 * 
 * // Button as a link using asChild
 * <Button asChild>
 *   <Link href="/about">Learn More</Link>
 * </Button>
 * 
 * // Button with icon
 * <Button variant="outline" size="icon">
 *   <Search className="h-4 w-4" />
 * </Button>
 * ```
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
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
