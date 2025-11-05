import { Empty, List } from 'antd';
import { TaskCard } from './';
import type { TasksList as TasksListType, Task } from "types/index";
import { useFetch } from '../hooks';

export default function TasksList({ id }: { id: number }) {
  const { data: list, loading: loadingList, error: errorList } = useFetch<TasksListType>(`/lists/${id}`);
  const { data: tasks, loading: loadingTasks, error: errorTasks } = useFetch<Task[]>(`/lists/${id}/tasks`);
  
  const loading = loadingList || loadingTasks;
  const error = errorList || errorTasks;

  return (
    <List
      header={
        <span className='font-bold text-2xl text-white'>
          {loading ? 'Loading…' : list ? list.name : error ?? 'Error'}
          <span className='p-5 text-sm font-normal text-gray-400'>
            {loading ? 'Loading…' : list ? ('ID: ' + list.id) : error ?? 'Error'}
          </span>
        </span>
      }
      dataSource={tasks ?? []}
      renderItem={item => (<TaskCard key={item.id} id={item.id} />)}
      style={{ background: '#3d3d3d', margin: 20, padding: 20, paddingTop: 10,  width: 300 }}
      locale={{ emptyText: <Empty description={<span style={{ color: 'white', opacity: 0.7 }}>No data</span>} /> }}
    />
  );
}