
'use client'

import React, { Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Header from './Header'

// Create a separate component that uses useSearchParams
function DashboardContent({ children }: { children: React.ReactNode }) {
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
    <div className="flex flex-col h-full bg-background">
      {showHeader && <Header currentPageName={getPageName(pathname, searchParams)} />}
      <main className={`flex-1 w-full ${pathname === '/' ? 'bg-background' : 'bg-muted'} ${!showHeader ? 'flex items-center justify-center' : ''}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
// Main DashboardLayout component that wraps DashboardContent with Suspense
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-full bg-background">
        <div className="h-16 bg-card border-b border-border"></div>
        <main className="flex-1 w-full bg-muted">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-4 bg-card rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-4 bg-card rounded col-span-2"></div>
                    <div className="h-4 bg-card rounded col-span-1"></div>
                  </div>
                  <div className="h-4 bg-card rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    }>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}