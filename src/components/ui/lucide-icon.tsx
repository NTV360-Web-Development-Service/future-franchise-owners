/**
 * @fileoverview Dynamic Lucide Icon Renderer
 *
 * Dynamically renders Lucide React icons by name string.
 * Used for rendering industry icons stored as strings in the database.
 *
 * @module Components/UI/LucideIcon
 * @version 1.0.0
 */

'use client'

import * as Icons from 'lucide-react'
import { LucideProps } from 'lucide-react'

/**
 * Props for the LucideIcon component
 */
interface LucideIconProps extends Omit<LucideProps, 'ref'> {
  /** Name of the Lucide icon to render */
  name: string
  /** Optional fallback icon if the specified icon doesn't exist */
  fallback?: keyof typeof Icons
}

/**
 * Dynamically renders a Lucide icon by name
 *
 * @param props - Component props including icon name
 * @returns Rendered Lucide icon or fallback
 *
 * @example
 * <LucideIcon name="Briefcase" size={16} />
 * <LucideIcon name="Dumbbell" className="text-blue-500" />
 */
export function LucideIcon({ name, fallback = 'Circle', ...props }: LucideIconProps) {
  // Get the icon component from lucide-react
  const IconComponent = (Icons as any)[name] || (Icons as any)[fallback]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react, using fallback "${fallback}"`)
    return null
  }

  return <IconComponent {...props} />
}

export default LucideIcon
