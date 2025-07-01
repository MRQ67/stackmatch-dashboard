'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Environment {
  id: string;
  name: string;
  description: string;
  updated_at: string;
}

export default function EnvironmentEditorPage() {
  const supabase = createClient()
  const { id } = useParams()
  const router = useRouter()
  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!id) return;

    const fetchEnvironment = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('environments')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setEnvironment(data)
      setName(data.name)
      setDescription(data.description)
      setLoading(false)
    }

    fetchEnvironment()
  }, [id])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    setError(null)

    if (!environment) {
      setError('Environment data not loaded.')
      setSubmitting(false)
      return
    }

    const oldName = environment.name;
    const oldDescription = environment.description;

    // Optimistic UI update
    setEnvironment(prev => prev ? { ...prev, name, description } : null);
    setMessage('Updating environment...');

    const { error: updateError } = await supabase
      .from('environments')
      .update({ name, description })
      .eq('id', environment.id)

    if (updateError) {
      setError(updateError.message);
      setMessage(''); // Clear optimistic message
      // Revert UI on error
      setEnvironment(prev => prev ? { ...prev, name: oldName, description: oldDescription } : null);
    } else {
      setMessage('Environment updated successfully!');
      router.push(`/environments/${environment.id}`);
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading environment for editing...</div>
      </DashboardLayout>
    )
  }

  if (error && !environment) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      </DashboardLayout>
    )
  }

  if (!environment) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Environment not found.</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4 text-card-foreground">Edit Environment: {environment.name}</h2>
      <div className="bg-card p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
        {message && <p className="mt-4 text-sm text-primary">{message}</p>}
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </div>
    </DashboardLayout>
  )
}
