import { Empty, List, Button, Typography } from 'antd';
import { TaskCard } from './';
import type { TasksList as TasksListType, Task } from '../../electron/types';
import { useFetch } from '../hooks';

const { Title } = Typography;

export default function TasksList({ id }: { id: number }) {
  const { data: list, loading: loadingList, error: errorList } = useFetch<TasksListType>(`/lists/${id}`);
  const { data: tasks, loading: loadingTasks, error: errorTasks } = useFetch<Task[]>(`/lists/${id}/tasks`);
  
  const loading = loadingList || loadingTasks;
  const error = errorList || errorTasks;

  return (
    <div className='bg-[#3d3d3d] m-5 mr-1 '>
      <Title level={3} style={{ color: 'white', margin: 20}}>
        {loading ? 'Loading…' : list ? list.name : error ?? 'Error'}
        <span className='p-5 text-sm font-normal text-gray-400'>
          {loading ? 'Loading…' : list ? ('ID: ' + list.id) : error ?? 'Error'}
        </span>
      </Title>
      <List
        style={{ margin:20, marginBottom: 5, width: 300 }}
        dataSource={tasks ?? []}
        renderItem={item => (<TaskCard key={item.id} id={item.id} />)}
        locale={{ emptyText: <Empty description={<span style={{ color: 'white', opacity: 0.7 }}>No data</span>} /> }}
      />
      <Button 
        style = {{background: '#3d3d3d', borderColor:'#3d3d3d', color: 'white', marginLeft:20, marginBottom:5, padding:10, width: 300, display: 'flex', justifyContent: 'flex-start'}}
        onMouseEnter={(e) => e.currentTarget.style.background = '#8c7d0d'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#3d3d3d'}
      >
        + Create
      </Button>
    </div>
  );
}