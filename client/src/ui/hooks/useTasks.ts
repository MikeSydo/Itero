/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import type { Task } from '../../electron/types';

export function useTasks() {
  const [taskIds, setTaskIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${api}/tasks`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: Task[] = await r.json();
      setTaskIds(data.map((t) => t.id));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { taskIds, loading, error, reload };
}
