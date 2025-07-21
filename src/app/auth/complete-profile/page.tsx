'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'
import imageCompression from 'browser-image-compression'

export default function CompleteProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleNext = async () => {
    setLoading(true)
    addToast('Updating profile...', 'info')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not found. Please sign in again.")
      }

      let avatar_url = user.user_metadata.avatar_url

      if (avatarFile) {
        addToast('Compressing image...', 'info')
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        }
        const compressedFile = await imageCompression(avatarFile, options)

        const filePath = `${user.id}/${Date.now()}-${compressedFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, compressedFile, { upsert: true })

        if (uploadError) {
          throw uploadError
        }

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(uploadData.path)
        avatar_url = urlData.publicUrl
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName || user.user_metadata.full_name,
          avatar_url: avatar_url,
        },
      })

      if (updateError) {
        throw updateError
      }

      addToast('Profile updated successfully!', 'success')
      router.refresh()
      router.push('/dashboard')

    } catch (error: unknown) {
      if (error instanceof Error) {
        addToast(error.message, 'error')
        console.error('Error updating profile:', error)
      } else {
        addToast('An unknown error occurred', 'error')
        console.error('Unknown error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    setLoading(true)
    addToast('Redirecting to dashboard...', 'info')
    router.push('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-xl border border-border">
        <h1 className="text-2xl font-bold text-center">Complete your Profile</h1>
        <div className="flex items-center justify-center">
          <label htmlFor="avatar-upload" className="cursor-pointer relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatarPreview || undefined} />
              <AvatarFallback className="flex flex-col items-center justify-center bg-muted text-muted-foreground">
                <Upload className="w-8 h-8" />
                <span>Upload</span>
              </AvatarFallback>
            </Avatar>
          </label>
          <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={loading} />
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="full-name">Full Name</Label>
            <Input id="full-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. John Doe" disabled={loading} />
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleSkip} disabled={loading}>Skip</Button>
          <Button onClick={handleNext} disabled={loading || (!fullName && !avatarFile)}>
            {loading ? 'Saving...' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}