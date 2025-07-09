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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
let Switch: React.FC<{ checked: boolean; onCheckedChange: (checked: boolean) => void }>;
try {
  Switch = require('@/components/ui/switch').Switch;
} catch (e) {
  // Fallback Switch component if not available
  Switch = ({ checked, onCheckedChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${
        checked ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProfilePage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('UTC+0')
  const [notifications, setNotifications] = useState<{
    email: boolean;
    push: boolean;
    weeklyReport: boolean;
  }>({
    email: true,
    push: false,
    weeklyReport: true
  })
  const [theme, setTheme] = useState('system')
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
        setName(user.user_metadata?.full_name || '')
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const getInitials = () => {
    if (!user) return ''
    return user.email?.charAt(0).toUpperCase() || 'U'
  }

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    addToast('Updating profile...', 'info')

    if (!user) {
      addToast('No user logged in.', 'error')
      setLoading(false)
      return
    }

    const oldEmail = user.email;
    const oldName = name;

    // Optimistic UI update
    setUser(prev => prev ? { ...prev, email: email, user_metadata: { ...prev.user_metadata, full_name: name } } : null);

    const { error: updateError } = await supabase.auth.updateUser({
      email: email,
      data: { full_name: name }
    })

    if (updateError) {
      addToast(updateError.message, 'error');
      // Revert UI on error
      setUser(prev => prev ? { ...prev, email: oldEmail, user_metadata: { ...prev.user_metadata, full_name: oldName } } : null);
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
      <div className="flex flex-col space-y-6">
        <h2 className="text-2xl font-bold text-card-foreground">Profile Settings</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Settings Content */}
          <div className="flex-1">
            <Tabs value={currentTab} onValueChange={(value) => router.push(`/profile?tab=${value}`)}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal information and contact details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={user?.user_metadata?.avatar_url} alt={name} />
                            <AvatarFallback>{getInitials()}</AvatarFallback>
                          </Avatar>
                          <Button variant="outline" size="sm" type="button">Change</Button>
                        </div>
                      </div>
                      <Button type="submit" disabled={loading} className="mt-4">
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences and security.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Change Password</h4>
                          <p className="text-sm text-muted-foreground">Update your account password</p>
                        </div>
                        <Button variant="outline">Change Password</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Time Zone</h4>
                          <p className="text-sm text-muted-foreground">Set your local time zone</p>
                        </div>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                            <SelectItem value="UTC-5">UTC-5 (New York)</SelectItem>
                            <SelectItem value="UTC+1">UTC+1 (Berlin)</SelectItem>
                            <SelectItem value="UTC+8">UTC+8 (Singapore)</SelectItem>
                            <SelectItem value="UTC+9">UTC+9 (Tokyo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">Receive email notifications</p>
                        </div>
                        <Switch 
                          checked={notifications.email} 
                          onCheckedChange={(checked: boolean) => setNotifications({...notifications, email: checked})} 
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Push Notifications</h4>
                          <p className="text-sm text-muted-foreground">Enable push notifications</p>
                        </div>
                        <Switch 
                          checked={notifications.push} 
                          onCheckedChange={(checked: boolean) => setNotifications({...notifications, push: checked})} 
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Weekly Reports</h4>
                          <p className="text-sm text-muted-foreground">Get weekly activity reports</p>
                        </div>
                        <Switch 
                          checked={notifications.weeklyReport} 
                          onCheckedChange={(checked: boolean) => setNotifications({...notifications, weeklyReport: checked})} 
                        />
                      </div>
                    </div>
                    <Button className="mt-4">Save Preferences</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the application.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">Small</Button>
                        <Button variant="default" size="sm">Medium</Button>
                        <Button variant="outline" size="sm">Large</Button>
                      </div>
                    </div>
                    <Button className="mt-4">Save Preferences</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - User Profile Card */}
          <div className="w-full md:w-64 lg:w-80 space-y-6">
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={name || 'User'} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-lg font-medium">{name || 'User Name'}</h3>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Change Photo
                  </Button>
                  
                  <div className="w-full pt-4 border-t mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Member since</span>
                      <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last active</span>
                      <span>Just now</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Role</span>
                      <span>Developer</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}