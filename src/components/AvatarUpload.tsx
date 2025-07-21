'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ToastProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { updateAvatar } from '@/app/profile/actions'
import imageCompression from 'browser-image-compression'

export function AvatarUpload() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { addToast } = useToast()

  const handleAvatarUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const fileInput = form.elements.namedItem('avatar') as HTMLInputElement
    const file = fileInput.files?.[0]

    if (!file) {
      addToast('Please select a file.', 'error')
      return
    }

    startTransition(async () => {
      addToast('Compressing image...', 'info')
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        }
        const compressedFile = await imageCompression(file, options)

        const formData = new FormData()
        formData.append('avatar', compressedFile, compressedFile.name)

        addToast('Uploading new avatar...', 'info')
        const result = await updateAvatar(formData)
        if (result?.error) {
          addToast(result.error, 'error')
        } else {
          addToast('Avatar updated successfully!', 'success')
          setIsOpen(false)
        }
      } catch (error) {
        console.error('Compression or upload error:', error)
        addToast(error instanceof Error ? error.message : 'An unknown error occurred.', 'error')
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-50">Change Photo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAvatarUpdate} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">New Avatar</label>
            <Input id="avatar" name="avatar" type="file" accept="image/*" required />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
