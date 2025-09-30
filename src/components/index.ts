/**
 * @fileoverview Main component exports organized by category
 * @module components
 */

// UI Components (shadcn/ui)
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

// Layout Components
export { NavbarBlock } from './layout/NavbarBlock'

// Note: Page blocks are exported separately from ./blocks to keep this index client-safe.
