'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AnimatedLogo from '@/components/AnimatedLogo'

export default function DashboardRedirectPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.replace(`/${session.user.id}/dashboard`)
      } else {
        router.replace('/auth')
      }
    }

    checkUser()
  }, [router, supabase])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <AnimatedLogo />
      <p className="text-lg text-muted-foreground">
        Redirecting to your dashboard... <span className="animate-spin">⚙️</span>
      </p>
    </div>
  )
}
