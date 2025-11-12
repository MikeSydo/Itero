import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useMatch, useRequest, history } from '@umijs/max';
import { Button, Descriptions, Spin, Typography, Space, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Task {
  id: number;
  name: string;
  listId: number;
}

interface TaskWithDetails extends Task {
  list?: {
    id: number;
    name: string;
    boardId: number;
  };
}

export default function Task() {
  const match = useMatch('/tasks/:taskId');
  const taskId = Number(match?.params.taskId);

  const { data: task, loading, error } = useRequest<{ data: TaskWithDetails }>(
    async () => {
      if (!taskId || Number.isNaN(taskId)) {
        throw new Error('Invalid task ID');
      }
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      const data = await response.json();
      return { data };
    },
    {
      refreshDeps: [taskId],
    }
  );

  const { run: deleteTask, loading: deleting } = useRequest(
    async () => {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('Таск успішно видалено');
        if (task?.list?.boardId) {
          history.push(`/boards/${task.list.boardId}`);
        } else {
          history.push('/boards');
        }
      },
      onError: () => {
        message.error('Помилка при видаленні таска');
      },
    }
  );

  const handleBack = () => {
    if (task?.list?.boardId) {
      history.push(`/boards/${task.list.boardId}`);
    } else {
      history.push('/boards');
    }
  };

  if (!taskId || Number.isNaN(taskId)) {
    return (
      <PageContainer>
        <ProCard>
          <div style={{ padding: 24 }}>Невірний ID таска</div>
        </ProCard>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <ProCard>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        </ProCard>
      </PageContainer>
    );
  }

  if (error || !task) {
    return (
      <PageContainer>
        <ProCard>
          <div style={{ padding: 24 }}>
            <Title level={4}>Помилка завантаження таска</Title>
            <p>{error?.message || 'Таск не знайдено'}</p>
            <Button onClick={handleBack}>Повернутися назад</Button>
          </div>
        </ProCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={
        <Space>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          />
          <span>{task.name}</span>
        </Space>
      }
      extra={[
        <Button key="edit" icon={<EditOutlined />}>
          Редагувати
        </Button>,
        <Button
          key="delete"
          danger
          icon={<DeleteOutlined />}
          loading={deleting}
          onClick={() => {
            deleteTask();
          }}
        >
          Видалити
        </Button>,
      ]}
    >
      <ProCard>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="ID">{task.id}</Descriptions.Item>
          <Descriptions.Item label="Назва">{task.name}</Descriptions.Item>
          <Descriptions.Item label="ID списку">{task.listId}</Descriptions.Item>
          {task.list && (
            <>
              <Descriptions.Item label="Назва списку">
                {task.list.name}
              </Descriptions.Item>
              <Descriptions.Item label="ID дошки">
                {task.list.boardId}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </ProCard>

      <ProCard title="Опис" style={{ marginTop: 16 }}>
        <Typography.Paragraph>
          Додати детальніший опис...
        </Typography.Paragraph>
      </ProCard>
    </PageContainer>
  );
}
