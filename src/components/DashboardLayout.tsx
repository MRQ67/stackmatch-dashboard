
'use client'

import React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Header from './Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getPageName = (path: string, params: URLSearchParams) => {
    switch (path) {
      case '/':
        return 'Home';
      case '/dashboard':
        const dashboardTab = params.get('tab');
        switch (dashboardTab) {
          case 'environments':
            return 'My Environments';
          case 'scanner':
            return 'Environment Scanner';
          case 'compare':
            return 'Environment Comparison';
          case 'public-environments':
            return 'Public Environments';
          case 'popular-environments':
            return 'Popular Environments';
          default:
            return 'Dashboard Overview';
        }
      case '/auth':
        return 'Sign In/Sign Up';
      case '/auth/reset-password':
        return 'Reset Password';
      case '/docs':
        return 'Documentation';
      case '/cli':
        return 'CLI Tool';
      case '/about-us':
        return 'About Us';
      case '/profile':
        // For profile and its sub-tabs, the main page name is 'Profile'
        return 'Profile';
      case '/users': // These will now redirect to /profile?tab=users
        return 'Users';
      case '/analytics': // These will now redirect to /profile?tab=analytics
        return 'Analytics';
      case '/settings': // These will now redirect to /profile?tab=settings
        return 'Settings';
      default:
        // Handle dynamic routes like /environments/[id] or /environments/[id]/edit
        if (path.startsWith('/environments/') && path.endsWith('/edit')) {
          return 'Edit Environment';
        } else if (path.startsWith('/environments/')) {
          return 'Environment Details';
        }
        // Handle the new dynamic dashboard route: /USER_ID/dashboard or /USER_ID/dashboard?tab=...
        if (path.match(/^\/[^/]+\/dashboard/)) { // Matches /USER_ID/dashboard or /USER_ID/dashboard?tab=...
            const dashboardTab = searchParams.get('tab');
            switch (dashboardTab) {
              case 'environments':
                return 'My Environments';
              case 'scanner':
                return 'Environment Scanner';
              case 'compare':
                return 'Environment Comparison';
              case 'public-environments':
                return 'Public Environments';
              case 'popular-environments':
                return 'Popular Environments';
              default:
                return 'Dashboard Overview';
            }
        }
        return 'Unknown Page';
    }
  };

  const noHeaderPaths = ['/auth', '/auth/reset-password'];
  const showHeader = !noHeaderPaths.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showHeader && <Header currentPageName={getPageName(pathname, searchParams)} />}
      <main className={`flex-1 w-full ${pathname === '/' ? 'bg-background' : 'bg-muted'} ${!showHeader ? 'flex items-center justify-center' : ''}`}>
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
