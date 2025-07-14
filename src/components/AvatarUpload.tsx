'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ToastProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { updateAvatar } from '@/app/profile/actions'

export function AvatarUpload({ userId, currentAvatar }: { userId: string, currentAvatar: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { addToast } = useToast()

  const handleAvatarUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      addToast('Uploading new avatar...', 'info')
      const result = await updateAvatar(formData)
      if (result?.error) {
        addToast(result.error, 'error')
      } else {
        addToast('Avatar updated successfully!', 'success')
        setIsOpen(false)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">Change Photo</Button>
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
