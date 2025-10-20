import { useState, useEffect } from 'react';
import { Empty, List, Button, Typography, Input, Space } from 'antd';
import { TaskCard } from './';
import type { TasksList as TasksListType, Task } from '../../electron/types';
import { useFetch } from '../hooks';

const { Title } = Typography;

export default function TasksList({ id }: { id: number }) {
  const { data: list, loading: loadingList, error: errorList } = useFetch<TasksListType>(`/lists/${id}`);
  const { data: tasks, loading: loadingTasks, error: errorTasks } = useFetch<Task[]>(`/lists/${id}/tasks`);
  const [isCreating, setIsCreating] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [creating, setCreating] = useState(false);
  const [taskList, setTaskList] = useState<Task[]>([]);
  
  const loading = loadingList || loadingTasks;
  const error = errorList || errorTasks;

  useEffect(() => {
    if (tasks) {
      setTaskList(tasks);
    }
  }, [tasks]);

  const handleCreateTask = async () => {
    if (!taskName.trim()) {
      return;
    }

    setCreating(true);
    try {
      const api = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
      const response = await fetch(`${api}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: taskName,
          listId: id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');
      
      const newTask = await response.json();
      setTaskList([...taskList, newTask]);
      setTaskName('');
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    setTaskName('');
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateTask();
    }
  };

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
        dataSource={taskList}
        renderItem={item => (<TaskCard key={item.id} id={item.id} />)}
        locale={{ emptyText: <Empty description={<span style={{ color: 'white', opacity: 0.7 }}>No data</span>} /> }}
      />
      
      {isCreating ? (
        <div style={{ marginLeft: 20, marginBottom: 5, width: 300 }}>
          <Input
            placeholder="Enter task name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyUp={handleKeyPress}
            autoFocus
            style={{ marginBottom: 10 }}
          />
          <Space>
            <Button 
              type="primary"
              onClick={handleCreateTask}
              loading={creating}
            >
              Add Task
            </Button>
            <Button onClick={handleCancel}>
              X
            </Button>
          </Space>
        </div>
      ) : (
        <Button 
          style = {{background: '#3d3d3d', borderColor:'#3d3d3d', color: 'white', marginLeft:20, marginBottom:5, padding:10, width: 300, display: 'flex', justifyContent: 'flex-start'}}
          onMouseEnter={(e) => e.currentTarget.style.background = '#8c7d0d'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#3d3d3d'}
          onClick={() => setIsCreating(true)}
        >
          + Create
        </Button>
      )}
    </div>
  );
}