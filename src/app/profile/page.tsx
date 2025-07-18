'use client'

import { useEffect, useState, useTransition } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useToast } from '@/components/ToastProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AvatarUpload } from '@/components/AvatarUpload';
import { updateProfile } from './actions'

import { Switch } from '@/components/ui/switch';

export default function ProfilePage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('UTC+0')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyReport: true
  })
  const [theme, setTheme] = useState('system')
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
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
        // Here you would fetch and set other user settings like timezone, notifications, theme
      }
      setLoading(false)
    }

    fetchUser()
  }, [supabase.auth])

  const getInitials = () => {
    if (!user) return ''
    return name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
  }

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    
    startTransition(async () => {
      addToast('Updating profile...', 'info');
      const result = await updateProfile(formData);
      if (result.error) {
        addToast(result.error, 'error');
      } else {
        addToast(result.success || 'Profile updated successfully!', 'success');
      }
    });
  }
  
  const handleSettingsSave = (type: string) => {
    startTransition(() => {
      addToast(`Saving ${type} settings...`, 'info');
      // Mock saving settings
      setTimeout(() => {
        addToast(`${type} settings saved!`, 'success');
      }, 1000);
    });
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${user?.id}/dashboard`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold text-card-foreground">Profile Settings</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <Tabs value={currentTab} onValueChange={(value) => router.push(`/profile?tab=${value}`)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal information and contact details.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isPending} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isPending} />
                      </div>
                      <Button type="submit" disabled={isPending} className="mt-4">
                        {isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account">
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
                        <Button variant="outline" disabled={isPending}>Change Password</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" disabled={isPending}>Enable 2FA</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Time Zone</h4>
                          <p className="text-sm text-muted-foreground">Set your local time zone</p>
                        </div>
                        <Select value={timezone} onValueChange={setTimezone} disabled={isPending}>
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
                    <Button className="mt-4" onClick={() => handleSettingsSave('Account')} disabled={isPending}>
                      {isPending ? 'Saving...' : 'Save Account Settings'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
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
                          onCheckedChange={(checked) => setNotifications({...notifications, email: checked})} 
                          disabled={isPending}
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
                          onCheckedChange={(checked) => setNotifications({...notifications, push: checked})} 
                          disabled={isPending}
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
                          onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})} 
                          disabled={isPending}
                        />
                      </div>
                    </div>
                    <Button className="mt-4" onClick={() => handleSettingsSave('Notification')} disabled={isPending}>
                      {isPending ? 'Saving...' : 'Save Notification Preferences'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the application.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select value={theme} onValueChange={setTheme} disabled={isPending}>
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
                        <Button variant="outline" size="sm" disabled={isPending}>Small</Button>
                        <Button variant="default" size="sm" disabled={isPending}>Medium</Button>
                        <Button variant="outline" size="sm" disabled={isPending}>Large</Button>
                      </div>
                    </div>
                    <Button className="mt-4" onClick={() => handleSettingsSave('Appearance')} disabled={isPending}>
                      {isPending ? 'Saving...' : 'Save Appearance Preferences'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

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
                  <AvatarUpload userId={user.id} currentAvatar={user.user_metadata.avatar_url} />
                  
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