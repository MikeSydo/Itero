import { useState } from 'react';
import { Card, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { DeleteOutlined, CheckCircleFilled, CheckCircleOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Task } from 'types/index';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate, useParams } from '@umijs/max';

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const { id, isCompleted } = task; 
  const [isDeleted, setIsDeleted] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { boardId } = useParams<{ boardId: string }>();
  
  const api = `http://localhost:${process.env.PORT || 3000}`;

  const handleDelete = async () => {
    try {
      const response = await fetch(`${api}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      setIsDeleted(true);
      onDelete();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComplete = async () => {
    try {
      const response = await fetch(`${api}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      window.dispatchEvent(new CustomEvent('taskUpdated', { 
        detail: { taskId: id, listId: task.listId } 
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (isDeleted) {
    return null;
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'complete',
      label: isCompleted ? 'Mark as incomplete' : 'Mark as complete',
      icon: isCompleted 
        ? <CheckCircleFilled style={{ color: '#52c41a' }} /> 
        : <CheckCircleOutlined />,
      onClick: (info) => {
        info.domEvent.stopPropagation(); 
        handleToggleComplete();
      },
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined/>,
      danger: true,
      onClick: (info) => {
        info.domEvent.stopPropagation(); 
        handleDelete();
      },
    },
  ];

  const navigate = useNavigate();

  const handleOpenTaskDetails = async () => {
    navigate(`/boards/${boardId}/c/${id}`);
  }

  const hasDescription = task.description && task.description.trim().length > 0;
  const hasDate = task.endDate || task.startedDate;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day}/${month}`;
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return today.getFullYear() === date.getFullYear() &&
           today.getMonth() === date.getMonth() &&
           today.getDate() === date.getDate();
  };

  const isPastDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDateStatus = () => {
    if (task.endDate) {
      if (isPastDate(task.endDate)) {
        return { text: 'Overdue', color: '#ff4d4f' };
      } else if (isToday(task.endDate)) {
        return { text: 'Soon', color: '#faad14' };
      }
    }
    return null;
  };

  const dateStatus = getDateStatus();
  const isOverdue = dateStatus?.text === 'Overdue';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isOverdue && !isCompleted ? '#5c1c1c' : (isCompleted ? '#1a1a1a' : 'black'),
    marginBottom: 10,
    cursor: 'grab',
    opacity: isDragging ? 0.5 : (isCompleted ? 0.6 : 1),
  };

  const getDateDisplay = () => {
    if (task.startedDate && task.endDate) {
      return `${formatDate(task.startedDate)} - ${formatDate(task.endDate)}`;
    } else if (task.endDate) {
      return formatDate(task.endDate);
    }
    return '';
  };

  return (
    <Card onClick={handleOpenTaskDetails}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      title={
        <span style={{
          color:'white', 
          textDecoration: isCompleted ? 'line-through' : 'none',
          display: 'block',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          paddingRight: '55px',
          lineHeight: 1.3
        }}>
          {task.name}
        </span>
      } 
      variant='borderless'
      style={style}
      styles={{header:{borderBottom: 0, background: 'black', minHeight: 'auto', paddingBottom: 8, padding: '12px 16px'}, body:{background:'black', color:'white', paddingTop: 0}}}
    >
      {(hasDescription || hasDate) && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 8, flexWrap: 'wrap' }}>
          {hasDescription && (
            <FileTextOutlined style={{ color: '#888', fontSize: 16 }} />
          )}
          {hasDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CalendarOutlined style={{ color: '#888', fontSize: 16 }} />
              <span style={{ color: '#888', fontSize: 12 }}>{getDateDisplay()}</span>
              {dateStatus && (
                <span style={{ 
                  backgroundColor: dateStatus.color, 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: 4, 
                  fontSize: 11,
                  fontWeight: 500
                }}>
                  {dateStatus.text}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
        <Button 
          style={{ position: 'absolute', top: 12, right: 10, color: 'white', background:'black', borderColor:'Black', fontSize: 30, paddingBottom: 15}}
          onMouseEnter={(e) => {e.currentTarget.style.background = '#8c7d0d'}}
          onMouseLeave={(e) => {e.currentTarget.style.background = 'black'}}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          ...
        </Button>
      </Dropdown>
    </Card>
  );
}