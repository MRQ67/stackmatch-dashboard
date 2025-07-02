'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Search, Download, Mail } from 'lucide-react'
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import AuthButton from './AuthButton'
import ThemeToggle from './ThemeToggle'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface HeaderProps {
  currentPageName: string;
}

export default function Header({ currentPageName }: HeaderProps) {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    // Fetch user on initial component mount
    fetchAndSetUser();

    // Set up a listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // When the user signs in or their data is updated, fetch the latest user data
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchAndSetUser();
      } 
      // When the user signs out, clear the user data
      else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Docs', href: '/docs' },
    { name: 'CLI', href: '/cli' },
    { name: 'About Us', href: '/about-us' },
  ];

  const publicNavPaths = [
    '/',
    '/docs',
    '/cli',
    '/about-us',
  ];

  const showCentralNav = publicNavPaths.includes(pathname);

  return (
    <header className="flex flex-col bg-card border-b border-border">
      {/* Top Navigation Bar */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4 justify-self-start">
          <Link
            href="/"
            legacyBehavior>
            <a className="flex items-center gap-2 text-lg font-semibold">
              {/* Placeholder for a logo */}
              <div className="w-6 h-6 bg-primary rounded-sm" />
              <span>StackMatch</span>
            </a>
          </Link>
          <span className="text-lg font-medium text-gray-700">/</span>
          <span className="text-lg font-medium text-muted-foreground">{currentPageName}</span>
        </div>

        {/* Centered Navigation Items (conditionally rendered) */}
        {showCentralNav && (
          <NavigationMenu className="hidden md:flex transition-opacity duration-300 justify-self-center">
            <NavigationMenuList className="space-x-4">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="flex items-center gap-4 justify-self-end">
          {loading ? null : user ? (
            // User is signed in
            (<>
              {pathname === '/' ? (
                <Link href="/dashboard" legacyBehavior>
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : pathname === '/cli' ? (
                <Link
                  href="https://github.com/MRQ67/stackmatch-cli/releases/latest"
                  passHref
                  legacyBehavior>
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" /> Download CLI
                  </Button>
                </Link>
              ) : pathname === '/about-us' ? (
                <Link href="mailto:contact@example.com" legacyBehavior>
                  <Button size="sm">
                    <Mail className="mr-2 h-4 w-4" /> Contact Us
                  </Button>
                </Link>
              ) : pathname.startsWith('/profile') ? (
                // No search bar on profile page when signed in
                (null)
              ) : (
                // Search bar on other pages when signed in
                (<div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Type / to search" className="pl-8" />
                </div>)
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || "User Avatar"} />
                      <AvatarFallback>{user?.email ? user.email[0].toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.user_metadata?.full_name || "User"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <ThemeToggle />
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>)
          ) : (
            // User is not signed in
            (pathname === '/' ? (<AuthButton />) : pathname === '/cli' ? (
              <Link
                href="https://github.com/MRQ67/stackmatch-cli/releases/latest"
                asChild>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" /> Download CLI
                </Button>
              </Link>
            ) : pathname === '/about-us' ? (
              <Link href="mailto:contact@example.com" legacyBehavior>
                <Button size="sm">
                  <Mail className="mr-2 h-4 w-4" /> Contact Us
                </Button>
              </Link>
            ) : (
              // Search bar on other pages when not signed in
              (<div className="relative w-64">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Type / to search" className="pl-8" />
              </div>)
            ))
          )}
        </div>
      </div>
    </header>
  );
}