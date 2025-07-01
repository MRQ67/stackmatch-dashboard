'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UsersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/profile?tab=users');
  }, [router]);

  return null; // This page will redirect, so no content is rendered directly
}