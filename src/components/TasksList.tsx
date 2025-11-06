import { useState, useEffect } from 'react';
import { Empty, List, Button, Typography, Input, Space, Dropdown, Flex } from 'antd';
import type { MenuProps } from 'antd';
import { TaskCard } from './';
import type { TasksList as TasksListType, Task } from 'types/index';
import { useFetch } from '../hooks';
import { DeleteOutlined } from '@ant-design/icons'

const { Title } = Typography;

export default function TasksList({ id }: { id: number }) {
  const { data: list, loading: loadingList, error: errorList } = useFetch<TasksListType>(`/lists/${id}`);
  const { data: tasks, loading: loadingTasks, error: errorTasks } = useFetch<Task[]>(`/lists/${id}/tasks`);
  const [isCreating, setIsCreating] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [creating, setCreating] = useState(false);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);

  const loading = loadingList || loadingTasks;
  const error = errorList || errorTasks;
  const api =  `http://localhost:${process.env.PORT || 3000}`;

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

  const handleDelete = async () => {
    try {
      const response = await fetch(`${api}/lists/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      setIsDeleted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (isDeleted) {
    return null;
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined/>,
      danger: true,
      onClick: handleDelete,
    },
  ];

  return (
    <div style={{background: '#3d3d3d'}}>
      <Flex gap= {160 }>
        <Title level={3} style={{ color: 'white', margin: 20}}>
          {loading ? 'Loading…' : list ? list.name : error ?? 'Error'}
        </Title>
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <Button 
            style={{ marginTop: 20, color: 'white', background:'#3d3d3d', borderColor:'#3d3d3d', fontSize: 30, paddingBottom: 15}}
            onMouseEnter={(e) => {e.currentTarget.style.background = '#8c7d0d'}}
            onMouseLeave={(e) => {e.currentTarget.style.background = '#3d3d3d'}}
          >
            ...
          </Button>
        </Dropdown>
      </Flex>
      <List
        style={{ margin:20, marginBottom: 5, width: 300 }}
        dataSource={taskList}
        renderItem={item => (<TaskCard key={item.id} id={item.id} />)}
        locale={{ emptyText: <div /> }}
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