import { Card } from 'antd';
import type { Task } from '../../electron/types';
import { useFetch } from '../hooks';

export default function TaskCard({ id }: { id: number }) {
  const { data: task, loading, error } = useFetch<Task>(`/tasks/${id}`);
  return (
    <Card
      title={<span className="text-white">{loading ? 'Loading…' : task ? task.name : error ?? 'Error'}</span>}
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
