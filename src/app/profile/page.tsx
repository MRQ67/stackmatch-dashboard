'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useToast } from '@/components/ToastProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ProfilePage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'profile';

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        setEmail(user.email || '')
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    addToast('Updating profile...', 'info')

    if (!user) {
      addToast('No user logged in.', 'error')
      setLoading(false)
      return
    }

    const oldEmail = user.email; // Store old email for potential revert

    // Optimistic UI update
    setUser(prev => prev ? { ...prev, email: email } : null);

    const { error: updateError } = await supabase.auth.updateUser({
      email: email,
    })

    if (updateError) {
      addToast(updateError.message, 'error');
      // Revert UI on error
      setUser(prev => prev ? { ...prev, email: oldEmail } : null);
    } else {
      addToast('Profile updated successfully!', 'success');
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading profile...</div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Please log in to view your profile.</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4 text-card-foreground">Profile Settings</h2>
      <Tabs value={currentTab} onValueChange={(value) => router.push(`/profile?tab=${value}`)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">General Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">My Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </div>
        </TabsContent>
        <TabsContent value="users">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Users Management</h3>
            <p>This section will allow you to manage users.</p>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Analytics Dashboard</h3>
            <p>This section will display various analytics and statistics.</p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">General Settings</h3>
            <p>This section will allow you to configure application settings.</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}