'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EnvironmentScannerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard?tab=scanner');
  }, [router]);

  return null; // This page will redirect, so no content is rendered directly
}