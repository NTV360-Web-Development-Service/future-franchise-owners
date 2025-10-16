/**
 * @fileoverview Card Component
 * 
 * A collection of card components for creating structured content containers.
 * Provides a consistent design system for displaying grouped information
 * with headers, content, actions, and footers.
 * 
 * @module Components/UI/Card
 * @version 1.0.0
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card Component
 * 
 * The main container component for card layouts. Provides a styled
 * container with rounded corners, shadow, and proper spacing for
 * organizing content into distinct sections.
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {React.ReactElement} The rendered card container
 * 
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * CardHeader Component
 * 
 * Container for card header content including titles, descriptions,
 * and action elements. Provides consistent spacing and layout for
 * the top section of a card.
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {React.ReactElement} The rendered card header
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * CardTitle Component
 * 
 * Displays the main title text for a card. Provides consistent
 * typography and styling for card headings.
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {React.ReactElement} The rendered card title
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * CardDescription Component
 * 
 * Displays descriptive text below the card title. Uses muted
 * text styling for secondary information.
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {React.ReactElement} The rendered card description
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * CardAction Component
 * 
 * Container for action elements like buttons or icons positioned
 * in the top-right corner of the card header area.
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {React.ReactElement} The rendered card action area
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * CardContent Component
 * 
 * Main content area of the card. Provides consistent padding
 * and spacing for the primary card content.
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {React.ReactElement} The rendered card content area
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/**
 * CardFooter Component
 * 
 * Footer area of the card, typically used for action buttons
 * or additional metadata. Includes automatic border styling
 * when preceded by other card components.
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {React.ReactElement} The rendered card footer
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
