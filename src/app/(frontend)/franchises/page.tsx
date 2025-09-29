import React from 'react'
import FranchiseFiltersGrid, { type Franchise } from './FranchiseFiltersGrid'

export default function FranchisesPage() {
  // Sample data; will be replaced with CMS data later
  const franchises: Franchise[] = [
    {
      name: 'Franchise Alpha',
      category: 'Automotive',
      description: 'A leading opportunity with proven success.',
      cashRequired: '$300,000',
      tags: ['Featured', 'Priority', 'Best Score 90'],
    },
    {
      name: 'Franchise Beta',
      category: 'Business Services',
      description: 'Trusted brand with nationwide presence.',
      cashRequired: '$50,000',
      tags: ['User Pick', 'Low Cost', 'Best Score 88'],
    },
    {
      name: 'Franchise Gamma',
      category: 'Food & Beverage',
      description: 'High-growth mobile food concept.',
      cashRequired: '$100,000',
      tags: ['Home Based', 'Best Score 87'],
    },
    {
      name: 'Franchise Delta',
      category: 'Senior Care',
      description: 'Care services franchise with strong support.',
      cashRequired: '$50,000',
      tags: ['New Arrival', 'Best Score 86'],
    },
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">Franchise Directory</h1>
        <span className="text-sm text-muted-foreground">Filter and browse all franchises</span>
      </div>

      <FranchiseFiltersGrid franchises={franchises} />
    </div>
  )
}