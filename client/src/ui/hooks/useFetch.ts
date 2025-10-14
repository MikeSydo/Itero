import { useEffect, useState } from 'react';

export function useFetch<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`${api}${path}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (!cancelled) setData(result);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to fetch');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, path]);

  return { data, loading, error };
}
