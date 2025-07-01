'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PublicEnvironmentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard?tab=public-environments');
  }, [router]);

  return null; // This page will redirect, so no content is rendered directly
}