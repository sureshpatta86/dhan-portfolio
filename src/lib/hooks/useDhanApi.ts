import { useQuery } from '@tanstack/react-query';
import { DhanApiResponse, DhanApiError } from '@/lib/types';

// Generic API function to fetch any Dhan endpoint
async function fetchDhanData<T = any>(endpoint: string): Promise<DhanApiResponse<T>> {
  // Determine the correct API path based on endpoint
  let apiPath: string;
  if (endpoint === 'trading/funds') {
    apiPath = `/api/trading/funds`;
  } else if (endpoint === 'trading/ledger') {
    apiPath = `/api/trading/ledger`;
  } else {
    // Default to portfolio endpoints
    apiPath = `/api/portfolio/${endpoint}`;
  }
  
  const response = await fetch(apiPath, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Try to parse error response, but handle empty body
    const text = await response.text();
    let errorData: DhanApiError | null = null;
    try {
      errorData = text ? JSON.parse(text) : null;
    } catch {
      errorData = null;
    }
    throw new Error(errorData?.error || `Failed to fetch ${endpoint}`);
  }

  // Handle empty response body
  const text = await response.text();
  if (!text) return null as any;
  return JSON.parse(text);
}

// Generic hook for any Dhan API endpoint
export function useDhanApi<T = any>(
  endpoint: string,
  options?: {
    staleTime?: number;
    gcTime?: number;
    refetchInterval?: number | false;
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ['dhan', endpoint],
    queryFn: () => fetchDhanData<T>(endpoint),
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchInterval: options?.refetchInterval ?? 60 * 10000, // 10 minutes
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: options?.enabled ?? true,
  });
}
