'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ToastProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from 'next/document'

// Component that uses useSearchParams
function AuthContent() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const searchParams = useSearchParams()
  const [isSignUp, setIsSignUp] = useState(searchParams.get('signup') === 'true')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  useEffect(() => {
    setIsSignUp(searchParams.get('signup') === 'true');
  }, [searchParams]);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    addToast('Processing...', 'info')

    let error = null;
    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      error = signUpError;
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
    }

    if (error) {
      addToast(error.message, 'error')
    } else {
      addToast(isSignUp ? 'Check your email for the confirmation link!' : 'Signed in successfully!', 'success')
      if (isSignUp) {
        router.push('/auth/complete-profile');
      } else {
        router.push('/dashboard');
      }
    }
    setLoading(false)
  }

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setLoading(true)
    addToast('Redirecting to provider...', 'info')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      addToast(error.message, 'error')
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
            {isSignUp
              ? "Create your account to start managing and comparing your development environments." 
              : "Sign in to your account to access your personalized dashboard and environment tools."}
          </p>
        </div>

        {/* Right Section - Auth Form */}
        <div className="p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold mb-4 text-foreground">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              {isSignUp && (
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
            <Separator className="my-6" />
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => handleSocialAuth('google')}
                disabled={loading}
                className="w-full"
              >
                Sign In with Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialAuth('github')}
                disabled={loading}
                className="w-full"
              >
                Sign In with GitHub
              </Button>
            </div>
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full mt-4"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Button>
            <Link href="/auth/reset-password" className="block text-center mt-2 text-primary hover:underline text-sm">
              Forgot your password?
            </Link>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}/
/ Main component that wraps AuthContent with Suspense
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden md:grid md:grid-cols-2">
          <div className="flex flex-col items-center justify-center p-8 bg-card text-foreground">
            <div className="w-24 h-24 mb-4 bg-primary rounded-full animate-pulse"></div>
            <div className="h-8 bg-card rounded w-1/2 animate-pulse mb-2"></div>
            <div className="h-4 bg-card rounded w-3/4 animate-pulse"></div>
          </div>
          <div className="p-8">
            <div className="text-center mb-4">
              <div className="h-8 bg-card rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-card rounded"></div>
              <div className="h-10 bg-card rounded"></div>
              <div className="h-10 bg-card rounded"></div>
              <div className="h-10 bg-card rounded"></div>
              <div className="h-1 bg-card rounded my-6"></div>
              <div className="h-10 bg-card rounded"></div>
              <div className="h-10 bg-card rounded"></div>
              <div className="h-6 bg-card rounded w-1/2 mx-auto mt-4"></div>
            </div>
          </div>
        </Card>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}