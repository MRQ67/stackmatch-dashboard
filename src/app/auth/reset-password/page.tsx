'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ToastProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    addToast('Sending reset link...', 'info')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      addToast(error.message, 'error')
    } else {
      addToast('Password reset email sent. Check your inbox!', 'success')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden md:grid md:grid-cols-2">
        {/* Left Section - Logo and Description */}
        <div className="flex flex-col items-center justify-center p-8 bg-card text-foreground">
          {/* Placeholder for a larger logo */}
          <div className="w-24 h-24 mb-4 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-4xl font-bold">
            S
          </div>
          <h2 className="text-3xl font-bold mb-2">StackMatch</h2>
          <p className="text-center text-sm opacity-90">
            Enter your email address to receive a password reset link.
          </p>
        </div>

        {/* Right Section - Reset Password Form */}
        <div className="p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold mb-4 text-foreground">
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
            <Link href="/auth" className="block text-center mt-4 text-primary hover:underline text-sm">
              Back to Sign In
            </Link>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}