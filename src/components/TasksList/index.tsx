import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Button, Card, Dropdown, Empty, Input, Space } from 'antd';
import { useState } from 'react';
import type { Task } from '@/services';
import { createTask, deleteList, getList, getListTasks } from '@/services';
import TaskCard from '../TaskCard';

interface TasksListProps {
  id: number;
  onDelete?: () => void;
}

export default function TasksList({ id, onDelete }: TasksListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);

  const { data: list, loading: loadingList } = useRequest(() => getList(id), {
    refreshDeps: [id],
  });

  const { data: tasks, loading: loadingTasks } = useRequest(
    () => getListTasks(id),
    {
      refreshDeps: [id],
      onSuccess: (data: any) => {
        setTaskList(data || []);
      },
    },
  );

  const { run: handleDeleteList, loading: deleting } = useRequest(
    () => deleteList(id),
    {
      manual: true,
      onSuccess: () => {
        setIsDeleted(true);
        onDelete?.();
      },
      onError: (err: any) => {
        console.error('Failed to delete list:', err);
      },
    },
  );

  const { run: handleCreateTask, loading: creating } = useRequest(
    (name: string) => createTask({ name, listId: id }),
    {
      manual: true,
      onSuccess: (newTask: any) => {
        setTaskList([...taskList, newTask]);
        setTaskName('');
        setIsCreating(false);
      },
      onError: (err: any) => {
        console.error('Failed to create task:', err);
      },
    },
  );

  const handleCancel = () => {
    setTaskName('');
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (taskName.trim()) {
        handleCreateTask(taskName.trim());
      }
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleTaskDelete = (taskId: number) => {
    setTaskList(taskList.filter((task) => task.id !== taskId));
  };

  if (isDeleted) {
    return null;
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      label: 'Delete List',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDeleteList,
      disabled: deleting,
    },
  ];

  const loading = loadingList || loadingTasks;

  return (
    <Card
      title={
        <Space>
          <span>{loading ? 'Loading…' : list?.name || 'List'}</span>
          <span style={{ fontSize: 12, fontWeight: 'normal', opacity: 0.6 }}>
            ({taskList.length})
          </span>
        </Space>
      }
      extra={
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" size="small">
            •••
          </Button>
        </Dropdown>
      }
      style={{
        minWidth: 300,
        maxWidth: 300,
        height: 'fit-content',
        maxHeight: 'calc(100vh - 200px)',
      }}
      styles={{
        body: {
          maxHeight: 'calc(100vh - 300px)',
          overflowY: 'auto',
        },
      }}
    >
      {taskList.length > 0
        ? taskList.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              onDelete={() => handleTaskDelete(task.id)}
            />
          ))
        : !isCreating && <Empty description="No tasks" />}

      {isCreating ? (
        <div style={{ marginTop: 8 }}>
          <Input.TextArea
            placeholder="Enter task name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ marginBottom: 8 }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleCreateTask(taskName.trim())}
              loading={creating}
              size="small"
            >
              Add
            </Button>
            <Button onClick={handleCancel} size="small">
              Cancel
            </Button>
          </Space>
        </div>
      ) : (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          block
          onClick={() => setIsCreating(true)}
          style={{ marginTop: taskList.length > 0 ? 8 : 0 }}
        >
          Add Task
        </Button>
      )}
    </Card>
  );
}
