'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface Environment {
  id: string;
  name: string;
  description: string;
  updated_at: string;
  data?: Record<string, any>;
  user_id?: string; // Add user_id to interface
}

export default function EnvironmentDetailPage() {
  const supabase = createClient()
  const { id } = useParams()
  const router = useRouter()
  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cloning, setCloning] = useState(false)
  const [cloneMessage, setCloneMessage] = useState('')
  const [deleting, setDeleting] = useState(false)

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
      setLoading(false)
    }

    fetchEnvironment()
  }, [id, supabase])

  const handleClone = async () => {
    setCloning(true)
    setCloneMessage('Cloning environment...')

    if (!environment) {
      setCloneMessage('Error: Environment data not loaded.')
      setCloning(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setCloneMessage('You must be logged in to clone environments.')
      setCloning(false)
      return
    }

    try {
      const { data: newEnvironment, error: cloneError } = await supabase
        .from('environments')
        .insert([
          {
            name: `Clone of ${environment.name}`,
            description: `Cloned from ${environment.description}`,
            data: environment.data,
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (cloneError) {
        setCloneMessage(`Error cloning environment: ${cloneError.message}`)
      } else {
        setCloneMessage('Environment cloned successfully!')
        router.push(`/environments/${newEnvironment.id}`)
      }
    } catch (err: Error) {
      setCloneMessage(`An unexpected error occurred: ${err.message}`)
    }

    setCloning(false)
  }

  const handleDelete = async () => {
    setDeleting(true);
    if (!environment) {
      setError('Environment data not loaded.');
      setDeleting(false);
      return;
    }

    const { error: deleteError } = await supabase
      .from('environments')
      .delete()
      .eq('id', environment.id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      router.push('/environments'); // Redirect to environments list after deletion
    }
    setDeleting(false);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading environment details...</div>
      </DashboardLayout>
    )
  }

  if (error) {
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-card-foreground">{environment.name}</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleClone}
            disabled={cloning}
          >
            {cloning ? 'Cloning...' : 'Clone Environment'}
          </Button>
          <Button asChild>
            <Link href={`/environments/${environment.id}/edit`}>
              Edit Environment
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Environment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your
                  environment and remove its data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {cloneMessage && <p className="mb-4 text-sm text-muted-foreground">{cloneMessage}</p>}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <p className="text-foreground mb-2"><strong>Description:</strong> {environment.description}</p>
        <p className="text-foreground mb-2"><strong>Last Updated:</strong> {new Date(environment.updated_at).toLocaleString()}</p>

        {environment.data && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Environment Configuration</AccordionTrigger>
              <AccordionContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(environment.data, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </DashboardLayout>
  );
}
