import { useEffect, useState } from 'react';

export function useFetch<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<string | null>(null);
  const PORT = process.env.PORT || 3000;
  const api = `http://localhost:${PORT}`;

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    
    (async () => {
      try {
        const response = await fetch(`${api}${path}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (!cancelled) setData(result);
      } catch (e: unknown) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to fetch');
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
