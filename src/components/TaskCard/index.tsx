import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Button, Card, Dropdown, Space } from 'antd';
import { useState } from 'react';
import { deleteTask, getTask } from '@/services';

interface TaskCardProps {
  id: number;
  onDelete?: () => void;
}

export default function TaskCard({ id, onDelete }: TaskCardProps) {
  const [isDeleted, setIsDeleted] = useState(false);

  const {
    data: task,
    loading,
    error,
  } = useRequest(() => getTask(id), {
    refreshDeps: [id],
  });

  const { run: handleDeleteTask, loading: deleting } = useRequest(
    () => deleteTask(id),
    {
      manual: true,
      onSuccess: () => {
        setIsDeleted(true);
        onDelete?.();
      },
      onError: (err: any) => {
        console.error('Failed to delete task:', err);
      },
    },
  );

  if (isDeleted) {
    return null;
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => {
        // TODO: Implement edit functionality
        console.log('Edit task:', id);
      },
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDeleteTask,
      disabled: deleting,
    },
  ];

  return (
    <Card
      size="small"
      loading={loading}
      style={{ marginBottom: 8, cursor: 'pointer' }}
      hoverable
      extra={
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" size="small" onClick={(e) => e.stopPropagation()}>
            •••
          </Button>
        </Dropdown>
      }
    >
      {error && <div style={{ color: 'red' }}>Error loading task</div>}
      {!loading && !error && task && (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <div style={{ fontWeight: 500 }}>{task.name}</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>ID: {task.id}</div>
        </Space>
      )}
    </Card>
  );
}
