'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Menu, 
  X, 
  Home,
  Upload,
  Building2,
  Mail,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'


interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
    description: 'Overview and analytics'
  },
  {
    name: 'Franchises',
    href: '/admin/franchises',
    icon: Building2,
    description: 'Manage franchise listings',
    children: [
      {
        name: 'All Franchises',
        href: '/admin/franchises',
        icon: Building2
      }
    ]
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
    description: 'Pages and blog content',
    children: [
      {
        name: 'Pages',
        href: '/admin/content/pages',
        icon: FileText
      },
      {
        name: 'Blog Posts',
        href: '/admin/content/blog',
        icon: FileText
      }
    ]
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'User management'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration'
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Admin Panel</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {isActive(item.href) && (
                    <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Active
                    </Badge>
                  )}
                </Link>
                
                {/* Sub-navigation */}
                {item.children && isActive(item.href) && (
                  <div className="ml-7 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                          pathname === child.href
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                        )}
                      >
                        <child.icon className="h-3 w-3" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">View Site</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Go to public website</p>
              </div>
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-slate-900 dark:text-slate-100">Admin</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
        </div>
      </body>
    </html>
  )
}