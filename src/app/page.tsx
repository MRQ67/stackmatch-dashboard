'use client'

import Link from 'next/link'
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to StackMatch!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Manage and compare your development environments with ease.
        </p>
        <div className="flex gap-4">
          <Link href="/auth?signup=true">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-gray-800 border border-gray-300        │
 │           hover:bg-gray-100">Sign In</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}