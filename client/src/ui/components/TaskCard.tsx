import { Card } from 'antd';
import { useEffect, useState } from 'react';
import type { Task } from '../../electron/types';

export default function TaskCard({ id }: { id: number }) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3000';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`${api}/tasks/${id}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Task = await response.json();
        if (!cancelled) setTask(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to fetch');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, id]);

  return (
    <Card
      title={<span className="text-white">{loading ? 'Loading…' : task ? task.title : error ?? 'Error'}</span>}
      variant='borderless'
      style={{ background: 'black', marginBottom: 10 }}
      styles={{header:{borderBottom: 0, background: 'black'}, body:{background:'black', color:'white', marginTop:-30}}}
    >
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'salmon' }}>{error}</div>}
      {!loading && !error && task && (<div style={{ opacity: 0.7 }}>ID: {task.id}</div>)}
    </Card>
  );
}
