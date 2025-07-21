'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input' // Keep Input for search bar

interface Environment {
  id: string;
  name: string;
  description: string;
  updated_at: string;
  os?: string; // Add OS field
  hostname?: string; // Add hostname field
  is_public?: boolean; // Add is_public field
}

type SortColumn = 'name' | 'description' | 'updated_at';
type SortDirection = 'asc' | 'desc';

export default function EnvironmentList() {
  const supabase = createClient()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnvironments = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('environments')
        .select('id, name, description, updated_at, data, is_public')
        .eq('user_id', user.id);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const environmentsWithDetails = data?.map(env => ({
        ...env,
        os: env.data?.system?.os,
        hostname: env.data?.system?.hostname,
      })) || [];

      setEnvironments(environmentsWithDetails);
      setLoading(false);
    };

    fetchEnvironments();
  }, [supabase]);

  

  const sortedAndFilteredEnvironments = useMemo(() => {
    let sortableEnvironments = [...environments];

    if (searchTerm) {
      sortableEnvironments = sortableEnvironments.filter(env =>
        env.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        env.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting logic (can be adapted for cards if needed, but less critical for visual layout)
    sortableEnvironments.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableEnvironments;
  }, [environments, searchTerm, sortColumn, sortDirection]);

  if (loading) {
    return <div className="text-center py-8">Loading environments...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search environments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAndFilteredEnvironments.map((env) => (
          <Card key={env.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                <Link
                  href={`/environments/${env.id}`}
                  className="hover:underline">
                  {env.name}
                </Link>
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => router.push(`/environments/${env.id}`)}>
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/environments/${env.id}/edit`)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/compare?env1=${env.id}`)}>
                    Compare
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-grow">
              {env.hostname && <p className="text-sm text-muted-foreground">Hostname: {env.hostname}</p>}
              {env.os && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Image
                    src={`/${env.os.toLowerCase()}.svg`}
                    alt={env.os}
                    width={16}
                    height={16}
                    className="inline-block mr-1"
                  />
                  <span>OS: {env.os}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{env.description || 'No description provided.'}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant={env.is_public ? 'default' : 'secondary'}>
                {env.is_public ? 'Public' : 'Private'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Last Updated: {new Date(env.updated_at).toLocaleDateString()}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
