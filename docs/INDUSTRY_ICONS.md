# Industry Icons Implementation

## Overview

Updated the Industries collection to use Lucide icons that are dynamically rendered in the frontend.

## Changes Made

### 1. Industries Collection Icon Field

**File:** `src/collections/Industries.ts`

Changed the `icon` field from free-text to a dropdown select with 25 predefined Lucide icon options:

- 💼 Briefcase (General Business)
- 🏋️ Dumbbell (Fitness/Gym)
- ☕ Coffee (Food & Beverage)
- 🍔 UtensilsCrossed (Restaurant)
- 🏠 Home (Home Services)
- 🔧 Wrench (Maintenance/Repair)
- ❤️ Heart (Health & Wellness)
- 🩺 Stethoscope (Healthcare)
- 👥 Users (Senior Care)
- 🏃 Activity (Sports)
- ✨ Sparkles (Spa/Beauty)
- 👷 HardHat (Construction)
- 📚 BookOpen (Education)
- 👶 Baby (Childcare)
- 🐾 PawPrint (Pet Services)
- 🚗 Car (Automotive)
- ✨ Sparkle (Cleaning)
- 💰 DollarSign (Financial Services)
- 🏪 Store (Retail)
- 📦 Package (Shipping/Logistics)
- 🎨 Palette (Creative Services)
- 📱 Smartphone (Technology)
- 🏢 Building2 (Hospitality)
- ✈️ Plane (Travel)
- 🎵 Music (Entertainment)

### 2. Dynamic Icon Renderer

**File:** `src/components/ui/lucide-icon.tsx`

Created a client component that dynamically renders Lucide icons by name string:

```tsx
<LucideIcon name="Briefcase" size={16} />
<LucideIcon name="Dumbbell" className="text-blue-500" />
```

Features:

- Fallback icon support (defaults to 'Circle')
- Full TypeScript type safety
- Passes all Lucide icon props

### 3. Updated Data Pipeline

**File:** `src/components/blocks/FranchiseGridBlock.tsx`

- Extract `categoryIcon` from industry relationship
- Pass icon through to franchise cards
- Updated depth to 2 for relationship population

### 4. Updated FranchiseCard

**File:** `src/components/franchise/FranchiseCard.tsx`

- Added `categoryIcon?: string` to Franchise type
- Display icon next to category name in Badge
- Icon appears before category text with proper spacing

### 5. Updated Franchise Detail Page

**File:** `src/app/(frontend)/franchises/[id]/page.tsx`

- Changed from `franchise.category` to `franchise.industry` relationship
- Display industry icon on detail page
- Increased depth to 2 for relationship population

## User Experience

### In Admin Panel

- Users see a dropdown with emoji + description for each icon
- No guessing icon names - clear visual selection
- All icons are guaranteed to exist in Lucide React

### On Frontend

- Icons render as actual Lucide React components
- Displayed next to category name in franchise cards
- Displayed on franchise detail pages
- Consistent sizing and styling across the site

## Example Usage

When a user creates a new industry:

1. Select "🏋️ Dumbbell (Fitness/Gym)" from dropdown
2. Value stored in database: `"Dumbbell"`
3. Frontend renders: `<Dumbbell size={14} />` next to "Fitness"

## Notes

- All icon values match Lucide React component names exactly
- Dynamic rendering ensures no bundling issues
- Fallback prevents broken displays if icon not found
- Client component required for dynamic import
