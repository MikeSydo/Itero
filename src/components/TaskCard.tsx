import { useState } from 'react';
import { Card, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { Task } from 'types/index';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate, useParams } from '@umijs/max';

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const { id } = task; 
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

  if (isDeleted) {
    return null;
  }

  const menuItems: MenuProps['items'] = [
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: 'black',
    marginBottom: 10,
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1,
  };

  const navigate = useNavigate();

  const handleOpenTaskDetails = async () => {
    navigate(`/boards/${boardId}/c/${id}`);
  }

  return (
    <Card onClick={handleOpenTaskDetails}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      title={<span style={{color:'white'}}>{task.name}</span>} 
      variant='borderless'
      style={style}
      styles={{header:{borderBottom: 0, background: 'black'}, body:{background:'black', color:'white', marginTop:-30}}}
    >
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