/* eslint-disable @typescript-eslint/no-explicit-any */
import { Empty, List } from 'antd';
import TaskCard from './TaskCard';
import type { TasksList, Task } from '../../electron/types';
import { useEffect, useState } from 'react';

export default function TasksList({ id }: { id: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
    const [TasksList, setTasksList] = useState<TasksList | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const api = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    
    useEffect(() => {
        let cancelled = false;
        (async () => {
          try {
            const response = await fetch(`${api}/lists/${id}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data_TasksList: TasksList = await response.json();
            if (!cancelled) setTasksList(data_TasksList);
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

    useEffect(() => {
        let cancelled = false;
        (async () => {
          try {
            const response = await fetch(`${api}/lists/${id}/tasks`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data_tasks: Task[] = await response.json();
            if (!cancelled) setTasks(data_tasks);
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
        <List
            header={<span className='font-bold text-2xl text-white'>
                    {loading ? 'Loading…' : TasksList ? TasksList.name : error ?? 'Error'}
                    <span className='p-5 text-sm font-normal text-gray-400'>
                        {loading ? 'Loading…' : TasksList ?('ID: '+TasksList.id) : error ?? 'Error'}
                    </span>
                </span>}
      dataSource={tasks}
      renderItem={item => (<TaskCard key={item.id} id={item.id} />)}
            style={{ background: '#3d3d3d', margin: 20, padding: 20, paddingTop: 10,  width: 300 }}
      locale={{ emptyText: <Empty description={<span style={{ color: 'white', opacity: 0.7 }}>No data</span>} /> }}
        />
    );
}