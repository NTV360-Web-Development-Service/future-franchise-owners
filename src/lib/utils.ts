import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge conditional class names and resolve Tailwind CSS conflicts.
 *
 * - Accepts `string`, array, and object forms as supported by `clsx`
 * - Uses `tailwind-merge` to deduplicate and prefer the latest variant
 *
 * @param inputs Class name fragments to merge
 * @returns Merged class name string with conflicts resolved
 * @example
 * cn('px-2', { 'px-4': isActive }) // 'px-4'
 * cn(['text-sm', condition && 'text-lg']) // 'text-lg'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
