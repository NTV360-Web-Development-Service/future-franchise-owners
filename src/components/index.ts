/**
 * @fileoverview Main component exports organized by category
 * 
 * Centralized exports for commonly used components across the application.
 * Organized by functional categories for better maintainability and discoverability.
 * 
 * @module Components
 */

// UI Components (shadcn/ui based)
export { Badge } from './ui/badge'
export { Button } from './ui/button'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
export { Navbar } from './ui/navbar'
export { Input } from './ui/input'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

// Franchise Components
export { default as FranchiseCard } from './franchise/FranchiseCard'
export { default as FranchiseGrid } from './franchise/FranchiseGrid'
export type { Franchise } from './franchise/FranchiseCard'

// Note: Page blocks are exported separately from ./blocks to keep this index client-safe.
// Import blocks from '@/components/blocks' for server-side page components.
