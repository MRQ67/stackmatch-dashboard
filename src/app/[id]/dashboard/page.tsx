'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import DashboardLayout from "@/components/DashboardLayout"
import DashboardCard from "@/components/DashboardCard"
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import EnvironmentList from '@/components/EnvironmentList'

interface Environment {
  id: string;
  name: string;
  description: string;
  updated_at: string;
  is_public: boolean;
  data: Record<string, unknown> | string | null;
}

type SortColumn = 'name' | 'description' | 'updated_at';
type SortDirection = 'asc' | 'desc';

// Simple JSON diffing function (from compare page)
const jsonDiff = (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
  const diff: { added?: Record<string, unknown>; removed?: Record<string, unknown>; changed?: Record<string, unknown> } = {};

  for (const key in obj1) {
    if (!(key in obj2)) {
      if (!diff.removed) diff.removed = {};
      diff.removed[key] = obj1[key];
    }
  }

  for (const key in obj2) {
    if (!(key in obj1)) {
      if (!diff.added) diff.added = {};
      diff.added[key] = obj2[key];
    } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
      if (!diff.changed) diff.changed = {};
      diff.changed[key] = { old: obj1[key], new: obj2[key] };
    }
  }
  return diff;
};

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const pathname = usePathname();
  const userId = pathname.split('/')[1];

  // --- Overview Tab States ---
  const [totalEnvironments, setTotalEnvironments] = useState<number | null>(null);
  const [recentEnvironments, setRecentEnvironments] = useState<Environment[]>([]);
  const [lastScanDate, setLastScanDate] = useState<string | null>(null);
  const [environmentsShared, setEnvironmentsShared] = useState<number | null>(null);
  const [loadingTotal, setLoadingTotal] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingLastScan, setLoadingLastScan] = useState(true);
  const [loadingShared, setLoadingShared] = useState(true);
  const [errorTotal, setErrorTotal] = useState<string | null>(null);
  const [errorRecent, setErrorRecent] = useState<string | null>(null);
  const [errorLastScan, setErrorLastScan] = useState<string | null>(null);
  const [errorShared, setErrorShared] = useState<string | null>(null);

  // --- Scanner Tab States ---
  const [file, setFile] = useState<File | null>(null);
  const [loadingScanner, setLoadingScanner] = useState(false);

  // --- Compare Tab States ---
  const [allEnvironments, setAllEnvironments] = useState<Environment[]>([])
  const [selectedEnv1, setSelectedEnv1] = useState<string | null>(null)
  const [selectedEnv2, setSelectedEnv2] = useState<string | null>(null)
  const [env1Details, setEnv1Details] = useState<Environment | null>(null)
  const [env2Details, setEnv2Details] = useState<Environment | null>(null)
  // Loading and error states for compare tab
  const [, setLoadingCompare] = useState(true);
  const [, setErrorCompare] = useState<string | null>(null);
  

  // --- Public Environments Tab States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [environments, setEnvironments] = useState<Environment[]>([]);

  // --- Effects for Overview Tab ---
  useEffect(() => {
    if (currentTab === 'overview') {
      const fetchDashboardData = async () => {
        setLoadingTotal(true);
        setLoadingRecent(true);
        setLoadingLastScan(true);
        setLoadingShared(true);
        setErrorTotal(null);
        setErrorRecent(null);
        setErrorLastScan(null);
        setErrorShared(null);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setTotalEnvironments(0);
          setRecentEnvironments([]);
          setLoadingTotal(false);
          setLoadingRecent(false);
          return;
        }

        // Fetch total environments for the logged-in user
        const { count: totalCount, error: totalError } = await supabase
          .from('environments')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id);

        if (totalError) {
          setErrorTotal(totalError.message);
        } else {
          setTotalEnvironments(totalCount);
        }
        setLoadingTotal(false);

        // Fetch recent environments for the logged-in user
        const { data: recentData, error: recentError } = await supabase
          .from('environments')
          .select('id, name, description, updated_at, is_public, data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5);

        if (recentError) {
          setErrorRecent(recentError.message);
        } else {
          setRecentEnvironments(recentData || []);
          // Set last scan date from the most recent environment
          if (recentData && recentData.length > 0) {
            setLastScanDate(recentData[0].updated_at);
          } else {
            setLastScanDate('N/A');
          }
        }
        setLoadingRecent(false);
        setLoadingLastScan(false);

        // Fetch count of environments shared by the logged-in user
        const { count: sharedCount, error: sharedError } = await supabase
          .from('environments')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('is_public', true);

        if (sharedError) {
          setErrorShared(sharedError.message);
        } else {
          setEnvironmentsShared(sharedCount);
        }
        setLoadingShared(false);
      };

      fetchDashboardData();
    }
  }, [currentTab, supabase]);

  // --- Effects for Compare Tab ---
  useEffect(() => {
    if (currentTab === 'compare') {
      const fetchEnvironments = async () => {
        setLoadingCompare(true)
        const { data, error } = await supabase
          .from('environments')
          .select('id, name, description, updated_at, is_public, data')

        if (error) {
          setErrorCompare(error.message)
          setLoadingCompare(false)
          return
        }
        setAllEnvironments(data as Environment[] || [])
        setLoadingCompare(false)
      }
      fetchEnvironments()
    }
  }, [currentTab, supabase]);

  useEffect(() => {
    if (currentTab === 'compare') {
      const fetchEnvDetails = async (envId: string, setDetails: React.Dispatch<React.SetStateAction<Environment | null>>) => {
        if (!envId) {
          setDetails(null)
          return
        }
        const { data, error } = await supabase
          .from('environments')
          .select('*')
          .eq('id', envId)
          .single()

        if (error) {
          console.error('Error fetching environment details:', error.message)
          setDetails(null)
          return
        }
        setDetails(data)
      }

      fetchEnvDetails(selectedEnv1 as string, setEnv1Details)
      fetchEnvDetails(selectedEnv2 as string, setEnv2Details)
    }
  }, [currentTab, selectedEnv1, selectedEnv2, supabase])

  const comparisonResult = useMemo(() => {
    if (env1Details?.data && typeof env1Details.data === 'object' && env1Details.data !== null &&
        env2Details?.data && typeof env2Details.data === 'object' && env2Details.data !== null) {
      return jsonDiff(env1Details.data as Record<string, unknown>, env2Details.data as Record<string, unknown>);
    }
    return null;
  }, [env1Details, env2Details]);

  // --- Effects for Public Environments Tab ---
  useEffect(() => {
    if (currentTab === 'public-environments') {
      const fetchPublicEnvironments = async () => {
        const { data, error } = await supabase
          .from('environments')
          .select('*')
          .eq('is_public', true);

        if (error) {
          console.error('Error fetching public environments:', error.message);
          return;
        }
        setEnvironments(data || []);
      };
      fetchPublicEnvironments();
    }
  }, [currentTab, supabase]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredPublicEnvironments = useMemo(() => {
    let sortableEnvironments = [...environments];

    if (searchTerm) {
      sortableEnvironments = sortableEnvironments.filter(env =>
        env.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        env.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    sortableEnvironments.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableEnvironments;
  }, [environments, searchTerm, sortColumn, sortDirection]);

  // --- Scanner Tab Handlers ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      // addToast(''); // Clear previous messages - assuming addToast is available globally or passed
    }
  };

  const handleUpload = async () => {
    if (!file) {
      // addToast('Please select a JSON file to upload.', 'error');
      return;
    }

    if (file.type !== 'application/json') {
      // addToast('Only JSON files are allowed.', 'error');
      return;
    }

    setLoadingScanner(true);
    // addToast('Uploading and processing...', 'info');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const jsonContent = JSON.parse(e.target?.result as string);

          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            // addToast('You must be logged in to upload environments.', 'error');
            setLoadingScanner(false);
            return;
          }

          // addToast('Saving environment...', 'info');
          const { data, error } = await supabase
            .from('environments')
            .insert([
              {
                name: file.name.replace('.json', ''),
                description: 'Uploaded environment',
                data: jsonContent,
                user_id: user.id,
              },
            ])
            .select()
            .single();

          if (error) {
            // addToast(`Error saving environment: ${error.message}`, 'error');
          } else {
            // addToast('File uploaded and processed successfully!', 'success');
            router.push(`/environments/${data.id}`);
          }
        } catch {
          // addToast(`Error parsing JSON file. Please ensure it's valid.`, 'error');
        }
      };
      reader.readAsText(file);
    } catch {
      // addToast(`Error during file upload`, 'error');
    }

    setLoadingScanner(false);
  };

  return (
    <DashboardLayout>
      <Tabs value={currentTab} onValueChange={(value) => router.push(`/${userId}/dashboard?tab=${value}`)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="environments">My Environments</TabsTrigger>
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="public-environments">Public Environments</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview">
          <h2 className="text-2xl font-bold mb-4 text-card-foreground">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <TooltipProvider>
              <DashboardCard title="Total Environments">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-3xl font-bold text-foreground">
                      {loadingTotal ? "Loading..." : errorTotal ? "Error" : (totalEnvironments !== null ? String(totalEnvironments) : 'N/A')}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total number of environments you have created or cloned.</p>
                  </TooltipContent>
                </Tooltip>
                <p className="text-sm text-muted-foreground">Your managed environments</p>
              </DashboardCard>
            </TooltipProvider>
            <DashboardCard title="Last Scan Date">
              {loadingLastScan ? (
                <p className="text-xl text-muted-foreground">Loading...</p>
              ) : errorLastScan ? (
                <p className="text-xl text-destructive">Error</p>
              ) : (
                <p className="text-3xl font-bold text-foreground">
                  {lastScanDate ? new Date(lastScanDate).toLocaleDateString() : 'N/A'}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Date of your most recent environment scan</p>
            </DashboardCard>
            <DashboardCard title="Environments Shared">
              {loadingShared ? (
                <p className="text-xl text-muted-foreground">Loading...</p>
              ) : errorShared ? (
                <p className="text-xl text-destructive">Error</p>
              ) : (
                <p className="text-3xl font-bold text-foreground">
                  {loadingShared ? "Loading..." : errorShared ? "Error" : (environmentsShared !== null ? String(environmentsShared) : 'N/A')}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Number of environments you&apos;ve made public</p>
            </DashboardCard>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-card-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <DashboardCard title="Scan New Environment">
              <p className="text-foreground mb-4">Upload a new environment JSON file to add it to your collection.</p>
              <Button asChild>
                <Link href={`/${userId}/dashboard?tab=scanner`}>
                  Go to Scanner
                </Link>
              </Button>
            </DashboardCard>
            <DashboardCard title="Browse Public Environments">
              <p className="text-foreground mb-4">Discover and explore environments shared by the community.</p>
              <Button asChild>
                <Link href={`/${userId}/dashboard?tab=public-environments`}>
                  Browse Public
                </Link>
              </Button>
            </DashboardCard>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-card-foreground">Recent Activity</h2>
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard title="Recently Updated Environments">
              {loadingRecent ? (
                <p className="text-muted-foreground">Loading recent activity...</p>
              ) : errorRecent ? (
                <p className="text-destructive">Error: {errorRecent}</p>
              ) : recentEnvironments.length > 0 ? (
                <ul className="list-disc pl-5">
                  {recentEnvironments.map((env) => (
                    <li key={env.id} className="mb-2">
                      <Link
                        href={`/environments/${env.id}`}
                        className="text-primary hover:underline">
                        {env.name}
                      </Link>
                      <span className="text-sm text-muted-foreground ml-2">({new Date(env.updated_at).toLocaleString()})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No recent activity.</p>
              )}
            </DashboardCard>
          </div>
        </TabsContent>

        {/* My Environments Tab Content */}
        <TabsContent value="environments">
          <h2 className="text-2xl font-bold mb-4 text-card-foreground">My Environments</h2>
          <EnvironmentList />
        </TabsContent>

        {/* Scanner Tab Content */}
        <TabsContent value="scanner">
          <h2 className="text-2xl font-bold mb-4 text-card-foreground">Environment Scanner</h2>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <p className="mb-4 text-foreground">Upload an environment JSON file to scan and add it to your environments.</p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="mb-4 block w-full text-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
            <Button
              onClick={handleUpload}
              disabled={loadingScanner || !file}
            >
              {loadingScanner ? 'Processing...' : 'Upload and Scan'}
            </Button>
          </div>
        </TabsContent>

        {/* Compare Tab Content */}
        <TabsContent value="compare">
          <h2 className="text-2xl font-bold mb-4 text-card-foreground">Environment Comparison</h2>
          <div className="bg-card p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="env1">Select Environment 1</Label>
                <Select
                  value={selectedEnv1 || ''}
                  onValueChange={(value) => setSelectedEnv1(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    {allEnvironments.map((env) => (
                      <SelectItem key={env.id} value={env.id}>
                        {env.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="env2">Select Environment 2</Label>
                <Select
                  value={selectedEnv2 || ''}
                  onValueChange={(value) => setSelectedEnv2(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    {allEnvironments.map((env) => (
                      <SelectItem key={env.id} value={env.id}>
                        {env.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {(env1Details || env2Details) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">Environment 1 Details</h3>
                {env1Details ? (
                  <div>
                    <p className="text-foreground"><strong>Name:</strong> {env1Details.name}</p>
                    <p className="text-foreground"><strong>Description:</strong> {env1Details.description}</p>
                    <p className="text-foreground"><strong>Last Updated:</strong> {new Date(env1Details.updated_at).toLocaleString()}</p>
                    {env1Details.data && (
                      <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-2 text-foreground">Configuration:</h4>
                        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm text-foreground">
                          {typeof env1Details.data === 'object' ? JSON.stringify(env1Details.data, null, 2) : String(env1Details.data)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-foreground">No environment selected or details not found.</p>
                )}
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">Environment 2 Details</h3>
                {env2Details ? (
                  <div>
                    <p className="text-foreground"><strong>Name:</strong> {env2Details.name}</p>
                    <p className="text-foreground"><strong>Description:</strong> {env2Details.description}</p>
                    <p className="text-foreground"><strong>Last Updated:</strong> {new Date(env2Details.updated_at).toLocaleString()}</p>
                    {env2Details.data && (
                      <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-2 text-foreground">Configuration:</h4>
                        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm text-foreground">
                          {typeof env2Details.data === 'object' ? JSON.stringify(env2Details.data, null, 2) : String(env2Details.data)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-foreground">No environment selected or details not found.</p>
                )}
              </div>
            </div>
          )}

          {!!comparisonResult && (Object.keys(comparisonResult).length > 0) && (
            <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-card-foreground">Differences</h3>
              {comparisonResult.added && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-primary">Added in Environment 2:</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-auto text-sm text-foreground">
                    {comparisonResult.added ? JSON.stringify(comparisonResult.added, null, 2) : ''}
                  </pre>
                </div>
              )}
              {comparisonResult.removed && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-destructive">Removed from Environment 2:</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-auto text-sm text-foreground">
                    {comparisonResult.removed ? JSON.stringify(comparisonResult.removed, null, 2) : ''}
                  </pre>
                </div>
              )}
              {comparisonResult.changed && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-accent-foreground">Changed:</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-auto text-sm text-foreground">
                    {comparisonResult.changed ? JSON.stringify(comparisonResult.changed, null, 2) : ''}
                  </pre>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Public Environments Tab Content */}
        <TabsContent value="public-environments">
          <h2 className="text-2xl font-bold mb-4 text-card-foreground">Browse Public Environments</h2>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search public environments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('description')}
                  >
                    Description {sortColumn === 'description' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('updated_at')}
                  >
                    Last Updated {sortColumn === 'updated_at' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredPublicEnvironments.map((env) => (
                  <TableRow key={env.id} className="cursor-pointer hover:bg-muted">
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{env.name}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{env.description}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{new Date(env.updated_at).toLocaleDateString()}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Popular Environments Tab Content */}
        <TabsContent value="popular-environments">
          <h2 className="text-2xl font-bold mb-4 text-card-foreground">Popular Environments</h2>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <p className="text-foreground">This page will display a list of popular environment configurations.</p>
            <p className="mt-2 text-sm text-muted-foreground">Coming soon: Ranking based on clones, views, and other metrics!</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}