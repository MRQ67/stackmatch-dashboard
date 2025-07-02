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
    <header className="flex flex-col bg-card border-b border-border h-16">
      {/* Top Navigation Bar */}
      <div className="relative flex items-center h-full px-4 sm:px-6">
        {/* Left side - Logo and Page Name */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold">
            <div className="w-6 h-6 bg-primary rounded-sm" />
            <span>StackMatch</span>
          </Link>
          <span className="text-lg font-medium text-gray-700">/</span>
          <span className="text-lg font-medium text-muted-foreground">{currentPageName}</span>
        </div>
      
        {/* Centered Navigation - Only on public pages */}
        {showCentralNav && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList className="space-x-4">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      <Link href={item.href}>
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}

        {/* Right side - Dynamic Content */}
        <div className={`flex items-center gap-4 ml-auto ${loading ? 'invisible' : 'visible'}`}>
            <>
              {/* Docs Page - Only Search */}
              {pathname === '/docs' && (
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search documentation..." className="pl-8 w-64" />
                </div>
              )}

              {/* Home Page */}
              {pathname === '/' && (user ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard">
                    <Button variant="outline">
                      Go to Dashboard
                    </Button>
                  </Link>
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
                        <Link href="/profile" className="w-full">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="w-full">Settings</Link>
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
                </div>
              ) : (
                <AuthButton />
              ))}

              {/* CLI Page */}
              {pathname === '/cli' && (
                <Link href="https://github.com/MRQ67/stackmatch-cli/releases/latest" target="_blank" rel="noopener noreferrer">
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" /> Download CLI
                  </Button>
                </Link>
              )}

              {/* About Us Page */}
              {pathname === '/about-us' && (
                <Link href="mailto:contact@example.com">
                  <Button size="sm">
                    <Mail className="mr-2 h-4 w-4" /> Contact Us
                  </Button>
                </Link>
              )}

              {/* Dashboard/Other Pages */}
              {!['/', '/docs', '/cli', '/about-us'].includes(pathname) && (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8 w-64" />
                  </div>
                  {user && (
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
                  )}
                </div>
              )}
            </>
          
        </div>
    </div>
    </header>
  );
}